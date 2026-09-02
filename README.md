# Password reset docs

An [MkDocs](https://www.mkdocs.org/) site that documents **how to reset a Siemens account password**
(self-service, manager-driven, and emergency processes).

The repository was started from the Siemens `docs-theme-quickstart` template.

## Where this repo lives

| Remote | URL | Purpose |
| --- | --- | --- |
| `GitHubOrigin` | `https://github.com/RufusJWB/PasswordResetDocs.git` | The repository — runs `.github/workflows/docs.yml`. Tracked by local `main`. |
| `docs-theme` | `https://code.siemens.com/code-ops/docs-theme.git` | Upstream source for the vendored theme (`git subtree`) |

GitHub Actions is the only CI.

## Git LFS — why the theme snapshots are not vendored

Upstream's `vendor/docs-theme/.gitattributes` marks the Cypress/Playwright visual-regression
snapshots (`*.snap.png`, `playwright/e2e/**/*.png`) as Git LFS files, but **those LFS objects are not
available on the server** — they return HTTP 404. That caused two separate failures:

- `git clone` / `git pull` aborting with `smudge filter lfs failed`;
- `git push` rejected by GitHub with `GH008: Your push referenced at least N unknown Git LFS objects`,
  which no client-side setting can bypass.

So `vendor/docs-theme/cypress/` and `vendor/docs-theme/playwright/` are **deliberately excluded** from
the vendored subtree. They are test fixtures; nothing in the docs or theme build reads them. The
update script re-removes them after every `git subtree pull`.

A normal `git clone` now works with no special flags. Only if you check out a commit from before this
change do you still need to skip the smudge filter:

```bash
git lfs install --local --skip-smudge   # writes to .git/config only
```

## Repository layout

```text
.github/workflows/docs.yml   GitHub Actions pipeline (build + GitHub Pages)
docs/                        Markdown content and screenshots
  index.md                   The entire site content (single page)
  *.png                      Screenshots referenced from index.md
scripts/update-docs-theme.ps1     Full theme update: subtree pull, Linux rebuild, cleanup
scripts/bootstrap-docs-theme.sh   Rebuilds the vendored theme from source (Linux/WSL only)
vendor/docs-theme/           Siemens theme, vendored via git subtree
  mkdocs_siemens/            Prebuilt theme package — committed, this is what CI installs
mkdocs.yml                   Site config: theme, nav, markdown extensions
pyproject.toml / uv.lock     Python dependencies, managed with uv
renovate.json5               Dependency update automation
site/                        Build output — git-ignored
```

## Content

All content lives in [docs/index.md](docs/index.md). Images use relative paths
(`./EnterPassword2.png`, `./Act%20on%20behalf%201.png`, …).

Navigation is defined explicitly in `mkdocs.yml`. The `mkdocs-literate-nav` package is no longer
used by this project. MkDocs' default `search` plugin remains enabled automatically.

## The theme

`mkdocs.yml` selects `theme.name: code-siemens-code-docs-theme`. That theme is not on PyPI and is not a
declared dependency in `pyproject.toml`/`uv.lock` — it is installed from the vendored subtree:

```bash
uv pip install --no-deps ./vendor/docs-theme    # installs mkdocs-code-siemens-code-docs-theme 8.3.0
```

The build output (`vendor/docs-theme/mkdocs_siemens/`) is **committed**, so neither CI nor a normal
local build needs Node.js, Yarn, or access to the Siemens npm registry.

Keep `mkdocs-material` in `pyproject.toml` matching the exact pin in
`vendor/docs-theme/pyproject.toml` (theme 8.3.0 → `mkdocs-material==9.7.7`). The theme is installed
with `--no-deps`, so nothing enforces this automatically.

## Building locally

```bash
uv sync --locked                              # install locked Python deps
uv pip install --no-deps ./vendor/docs-theme  # install the prebuilt vendored theme
uv run mkdocs serve                           # http://127.0.0.1:8000, live reload
uv run mkdocs build --strict                  # what CI runs; output in site/
```

`site/`, `.cache/`, and the theme's `node_modules/` are git-ignored.

## Updating the vendored theme

Use the script — it handles every quirk documented below:

```powershell
./scripts/update-docs-theme.ps1              # newest tag on the docs-theme remote
./scripts/update-docs-theme.ps1 -Tag v8.4.0  # a specific tag
```

It requires a clean working tree, plus `git`, a running Docker daemon, and `uv`. It pulls the tag,
drops the LFS snapshot directories, rebuilds `mkdocs_siemens/` in a Linux container, removes the build
byproducts, warns on `mkdocs-material` drift, and finishes with a strict build. Changes are left
staged but **uncommitted** for review.

Commit the updated sources **together with** the regenerated `vendor/docs-theme/mkdocs_siemens/`.
CI only checks that the directory *exists*, so a stale prebuilt package would ship unnoticed.

### What the script works around

If you ever need to do this by hand:

- **Build on Linux, not Windows.** The theme's yarn scripts are POSIX-only — e.g.
  `cpy . '!**/*.html' '!**/*.scss' '../mkdocs_siemens' --dot --cwd=src`. Yarn 1.x spawns `cmd.exe` on
  Windows (even when launched from Git Bash), which does not strip single quotes, so the glob
  exclusions are ignored and output lands in a literal directory named `'..`. The result is a silently
  corrupt theme. `jq` is also required by `src:hash`.
- **Drop `cypress/` and `playwright/` after every pull** — see the Git LFS section above.
- **Superseded hashed stylesheets.** `postcss-hash` writes `code-<name>.<hash>.css` but never deletes
  the previous one, so `git rm` the old pair once the templates point at the new hash.
- **`sed` backups.** `src:hash` leaves `*.html.bak` under `mkdocs_siemens/templates/`. The root
  `.gitignore` rule for these is **dead** — `vendor/docs-theme/.gitignore` contains
  `!/mkdocs_siemens/templates/**`, and a nested `.gitignore` overrides the root — so delete them
  manually or they will be committed.
- **`mkdocs-material` pin.** Match the theme's exact pin, then `uv lock`.
- Read the changelog offline with `git fetch docs-theme --tags` then `git show <tag>:CHANGELOG.md`;
  the [changelog](https://code-ops.code.siemens.io/docs-theme/changelog/) and
  [upgrade guide](https://code-ops.code.siemens.io/docs-theme/upgrade/) are on the intranet.

## CI/CD — `.github/workflows/docs.yml`

Workflow **Docs CI/CD**, triggered on `pull_request` and on `push` to any branch. Concurrency group
`docs-<workflow>-<ref>` with `cancel-in-progress`. Permissions: `contents: read`, `pages: write`,
`id-token: write`. Env: `UV_LINK_MODE=copy`.

**`build`** (ubuntu-latest):

1. `actions/checkout@v6`
2. `astral-sh/setup-uv@v8.0.0`, `actions/setup-python@v6` (Python 3.12)
3. `uv sync --locked`
4. Assert `vendor/docs-theme/mkdocs_siemens/` is present, then `uv pip install --no-deps ./vendor/docs-theme`
5. `uv run mkdocs build --strict`, plus `--no-directory-urls` for pull requests
6. Uploads `site/` as the `site` artifact (`actions/upload-artifact@v7`, 1 day retention)
7. On a push to the default branch only: `actions/upload-pages-artifact@v3`

**`deploy`**: needs `build`, runs only on a push to the default branch, uses the `github-pages`
environment and `actions/deploy-pages@v4`.

## Dependency updates

`renovate.json5` extends `config:recommended` and `group:allNonMajor`. It does not cover the vendored
theme — update that manually with `git subtree` as described above.

## Contributing

Use the GitHub issue tracker to report problems, and contribute through pull requests. Every pull
request builds the site with `--strict` and uploads the rendered `site/` as a workflow artifact.

## License

[Siemens Inner Source License v1.4](LICENSE.md).
