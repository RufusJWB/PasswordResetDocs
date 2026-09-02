# Development

## Repository

The theme extends the [mkdocs-material](https://squidfunk.github.io/mkdocs-material/) theme for MkDocs.
We follow the upstream source structure and provide our overrides in the `src` directory, with the same file structure.
Additionally, Siemens-only sources that are not overrides but additional features, are provided in `siemens/` subdirectories.

The `mkdocs_siemens/` directory is populated during the build process with the files from `src/`,
where the SCSS files initially get compiled into `assets/stylesheets/code-main.css`.

The `playwright/` directory contains everything for E2E testing, including resources, test cases and snapshots.

## Getting Started

First, install Python, Node.js, [uv](https://docs.astral.sh/uv) and [yarn 1](https://classic.yarnpkg.com).
Currently, [`jq`](https://jqlang.github.io/jq/) must also be installed on your system.

Run the following in `docs-theme/` to prepare the development environment:

```shell-session
yarn --frozen-lockfile
yarn dist:setup
```

!!! note
    When you make changes to files in `src/` you have to run `yarn dist:setup`  and restart your `zensical serve`
    process to see the changes on `http://127.0.0.1:8000/`.

Optionally, you can also build the Python package (wheel) and later install it explicitly (this will not be an editable install):

```shell-session
yarn dist:build
```

## E2E testing

Set up the development environment as described above under development. Build the theme before running E2E tests:

```sh
yarn dist:setup
```

To get consistent results locally, you should run tests with a dockerized Cypress or Playwright image
that matches versions and browsers used in CI tests. A convenience script is available
[via `scripts/test.sh`](https://code.siemens.com/code-ops/docs-theme/-/blob/main/scripts/test.sh).

```sh
yarn dist:setup
yarn e2e:start # must be running for the duration of the tests, e.g. in a separate shell session
yarn e2e:docker
```

For Playwright, use:

```sh
yarn dist:setup
yarn e2e:start # must be running for the duration of the tests
./e2e_local.sh run
```

!!! important
    Please make sure you're connected to SNX when running `yarn e2e:start` as rendering PlantUML diagrams requires
    access to our internal [Kroki](https://kroki.io) server.

By default, the Cypress Docker scripts run all browsers and suites through `yarn e2e:docker`.
For Playwright, pass `PLAYWRIGHT_PROJECT=chromium` or `PLAYWRIGHT_PROJECT=firefox` and use `PLAYWRIGHT_SUITE=minimal` for the minimal suite.

Additionally, if you've made changes to the theme or upgraded dependencies and need to update
the snapshots, you can do so using the `--update-snapshots` flag for Playwright:

```sh
./e2e_local.sh run --update-snapshots
```

For Cypress, use the `CYPRESS_updateSnapshots` variable:

```sh
CYPRESS_updateSnapshots=true yarn e2e:docker
```

!!! hint
    You can also manually run individual tests in interactive mode using `./scripts/test.sh open` (Cypress)
    or `./e2e_local.sh shell` followed by `yarn playwright test --ui` (Playwright).

When you're done, and you want to get rid of the test suite and `mkdocs.yml`, run the following:

```sh
yarn e2e:clean
```

If your platform does not support running E2E tests locally in Docker, you can save updated snapshots
by running the manual `test-e2e-pw-snapshots` or `test-e2e-snapshots` job as a workaround. You can then download the updated
snapshots and commit them.

## Quick peek

If you just want to have a quick look at the theme, you can do this:

```sh
yarn --frozen-lockfile
yarn dist:setup
yarn e2e:start
```

!!! important
    Please make sure you're connected to SNX when running `yarn e2e:start` as rendering PlantUML diagrams requires
    access to our internal [Kroki](https://kroki.io) server.

This will start serving `http://127.0.0.1:8000` (all features suite) and `http://127.0.0.1:8001` (minimal suite).

If you want to make changes to this theme and develop against an existing MkDocs site,
you have to build the theme and reference it in your `mkdocs.yml`

```yaml
theme:
  name: code-siemens-code-docs-theme
```

and start serving these docs:

```sh
uv run zensical serve
```
