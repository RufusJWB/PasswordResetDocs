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

## Cloning — Git LFS caveat

`vendor/docs-theme/.gitattributes` marks `*.snap.png` (Cypress visual-regression snapshots) as Git LFS
files, but **those LFS objects are not available on the server**. A normal clone or pull therefore dies
with:

```text
Object does not exist on the server: [404]
error: external filter 'git-lfs filter-process' failed
fatal: ...snap.png: smudge filter lfs failed
```

The snapshots are test fixtures — nothing in the docs or theme build reads them — so simply skip the
LFS smudge:

```bash
# when cloning
GIT_LFS_SKIP_SMUDGE=1 git clone https://github.com/RufusJWB/PasswordResetDocs.git

# in an existing clone (writes to .git/config only)
git lfs install --local --skip-smudge
```

The `*.snap.png` files are then checked out as small LFS pointer text files, which is harmless.

## Repository layout

```text
.github/workflows/docs.yml   GitHub Actions pipeline (build + GitHub Pages)
docs/                        Markdown content and screenshots
  index.md                   The entire site content (single page)
  SUMMARY.md                 Navigation, read by mkdocs-literate-nav (not published)
  *.png                      Screenshots referenced from index.md
scripts/bootstrap-docs-theme.sh   Rebuilds the vendored theme from source (bash/WSL, Node + Yarn)
vendor/docs-theme/           Siemens theme, vendored via git subtree (~2500 files)
  mkdocs_siemens/            Prebuilt theme package — committed, this is what CI installs
mkdocs.yml                   Site config: theme, nav, markdown extensions
pyproject.toml / uv.lock     Python dependencies, managed with uv
renovate.json5               Dependency update automation
site/                        Build output — git-ignored
```

## Content

All content lives in [docs/index.md](docs/index.md). Images use relative paths
(`./EnterPassword2.png`, `./Act%20on%20behalf%201.png`, …).

Navigation comes from [docs/SUMMARY.md](docs/SUMMARY.md) via the `mkdocs-literate-nav` plugin, so
`mkdocs.yml` has no `nav:` key. Two things to know when editing it:

- Nested entries need **4-space** indentation — that is Python-Markdown's requirement and the
  plugin's `tab_length` default. Two spaces silently fails with
  `Did not find any item/section content specified`.
- `SUMMARY.md` is listed under `exclude_docs` so it defines the nav without being published as a page.

`mkdocs.yml` also lists `search` explicitly: declaring any `plugins:` block replaces the MkDocs
default of `['search']`, so omitting it would silently disable site search. The theme additionally
ships a `licenses` plugin (enabled on the theme's own site) that this project does not use.

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

Only needed when bumping the theme.

> **Build on Linux, not Windows.** The theme's yarn scripts are POSIX-only — e.g.
> `cpy . '!**/*.html' '!**/*.scss' '../mkdocs_siemens' --dot --cwd=src`. Yarn 1.x spawns `cmd.exe` on
> Windows (even when launched from Git Bash), which does not strip single quotes, so the glob
> exclusions are ignored and the output lands in a literal directory named `'..`. The result is a
> silently corrupt theme. Use WSL with Node installed, or a container:
>
> ```bash
> docker run --rm -v "$PWD/vendor/docs-theme:/work" -v docstheme_nm:/work/node_modules \
>   -w /work node:20-bookworm bash -c "apt-get update -qq && apt-get install -y -qq jq && \
>   yarn --frozen-lockfile --ignore-engines && yarn src:compile && yarn src:postcss && \
>   yarn dist:cpy:src && yarn dist:cpy:vendor && yarn dist:cpy:html && yarn src:hash"
> ```

1. Check the [changelog](https://code-ops.code.siemens.io/docs-theme/changelog/) and
   [upgrade guide](https://code-ops.code.siemens.io/docs-theme/upgrade/) for breaking changes.
   `git fetch docs-theme --tags` then `git show <tag>:CHANGELOG.md` works offline.
2. `git subtree pull --prefix=vendor/docs-theme docs-theme <tag> --squash`
3. Rebuild `mkdocs_siemens/` — `./scripts/bootstrap-docs-theme.sh` on Linux/WSL, or the container
   command above followed by `uv pip install --no-deps ./vendor/docs-theme`.
4. Clean up two things the build leaves behind:
   - **Superseded hashed stylesheets.** `postcss-hash` writes `code-main.<hash>.css` but never deletes
     the previous one, so `git rm` the old pair once `base-siemens.html` points at the new hash.
   - **`sed` backups.** `src:hash` leaves `*.html.bak` under `mkdocs_siemens/templates/`. The root
     `.gitignore` rule for these is **dead** — `vendor/docs-theme/.gitignore` contains
     `!/mkdocs_siemens/templates/**`, and a nested `.gitignore` overrides the root — so delete them
     manually or they will be committed.
5. Sync the `mkdocs-material` pin (see above), then `uv lock`.
6. Commit the updated sources **together with** the regenerated `vendor/docs-theme/mkdocs_siemens/`.
   CI only checks that the directory *exists*, so a stale prebuilt package would ship unnoticed.

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
