# The docs-theme quickstart template

This project provides a minimal template for code.siemens.io websites using the Siemens MkDocs theme:

* Basic MkDocs configuration including the Siemens `docs-theme`
* Website deployment using Gitlab Pages
* Review deployment for visual feedback in Merge Requests
* _(optional)_: basic [renovate](https://docs.renovatebot.com/) configuration to keep your project fresh (requires setup)
* _(optional)_: comes with pre-installed plugins commonly used at Siemens (e.g. `plantuml-markdown`, `mkdocs-literate-nav`)

## Create a new project

Follow the link below to create a new MkDocs project based on this template:

1. [Fork this repository](https://code.siemens.com/code-examples/docs-theme-quickstart/-/forks/new).

1. Once you've created the project, go to your project settings to
   [remove the fork relationship](https://docs.gitlab.com/ee/user/project/settings/#removing-a-fork-relationship).

   In your project's left sidebar, go **Settings > General > Advanced** and expand the section:

   <!-- We use uploads here so that assets don't end up in the users' repo -->
   ![Project advanced settings](https://code.siemens.com/code-examples/docs-theme-quickstart/uploads/964e5ec32dd4d610a7d93b392b591773/project-settings-advanced.png)

1. Scroll down and click on **Remove fork relationship**:

   ![Remove fork](https://code.siemens.com/code-examples/docs-theme-quickstart/uploads/b55141bb592d043352a66183068aab21/project-settings-remove-fork.png)

   > **Note**: You must have Owner permissions of the forked project to be able to remove the fork
   > relationship. If someone else forked the project and you are doing this after the fact, you
   > might not be able to see this option in your project settings.

## First use

If you want to see your GitLab Pages before making any changes, you need to trigger the pipeline one time to get it deployed.
In your project's left sidebar, go to **CI/CD > Pipelines** and press the `Run pipeline` button.

If the pipeline passed with `Job succeeded`, you can find the URL under **Deploy > Pages**  in the `Access pages` field.

From now on, you can start editing your documentation and deploy your site using Siemens branding.

## Building locally

To work locally with this project, you'll have to follow the steps below:

1. Fork, clone or download this project
1. Install [uv](https://docs.astral.sh/uv/)
1. Install Node.js 20 or newer (required to build the Siemens `docs-theme` from source)
1. Ensure the vendored Siemens theme sources are present under `vendor/docs-theme` (managed via `git subtree`; if the directory is missing, restore it from git or re-import `https://code.siemens.com/code-ops/docs-theme.git` into `vendor/docs-theme` with `git subtree`)
1. Install the locked Python dependencies: `uv sync --locked`
1. Build and install the Siemens theme locally:
   * Run `./scripts/bootstrap-docs-theme.sh` (this can be executed in WSL)
   * After updating the vendored theme, commit the generated `vendor/docs-theme/mkdocs_siemens/` files so CI can install the prebuilt theme package without reaching the Siemens npm registry.
1. Preview your project: `uv run mkdocs serve`, then available at `http://127.0.0.1:8000`
1. Modify content, live reloading will reflect your changes immediately
1. Generate the website: `uv run mkdocs build` (optional)
1. (Optional) Remember to keep your theme dependencies up to date.
   Use `uv lock --upgrade` to get patches and minor version upgrades.
   To update the vendored theme sources to the latest upstream changes:
   * Check the latest docs-theme release or tag in the upstream changelog and releases: `https://code-ops.code.siemens.io/docs-theme/changelog/`
   * Review the upgrade guide for breaking changes before updating: `https://code-ops.code.siemens.io/docs-theme/upgrade/`
   * Pull the selected upstream tag into `vendor/docs-theme` with `git subtree`, for example: `git subtree pull --prefix=vendor/docs-theme https://code.siemens.com/code-ops/docs-theme.git <tag> --squash`
   * Rerun `./scripts/bootstrap-docs-theme.sh` to regenerate the built theme files
   * Commit the updated vendored sources together with the regenerated `vendor/docs-theme/mkdocs_siemens/` files
   or automate all updates via [renovate-bot](https://code.siemens.io/ci/renovate-bot/).

## Recommendations

### Navigation

When building large sites or aggregating multiple sites together, as an alternative to standard MkDocs navigation configured in `mkdocs.yml`
we recommend using the [mkdocs-literate-nav plugin](https://github.com/oprypin/mkdocs-literate-nav), which is installed with this quickstart template by default.

This plugin will make your life easier by defining your navigation in Markdown rather than in the YAML configuration file.
It also distributes navigation to the corresponding documentation folders and allows specifying it in a more granular way.
**Using this plugin is highly recommended if you want to push your content to the [Siemens Developer Portal](https://developer.internal.siemens.com/).**

You can find more details on configuring navigation this way in the documentation for the [mkdocs-literate-nav plugin](https://github.com/oprypin/mkdocs-literate-nav).

## Learn more

Visit [Siemens docs-theme](https://code.siemens.com/code-ops/docs-theme/) for the full documentation
and the [MkDocs documentation](https://www.mkdocs.org/) if you'd like to learn more about the technology
behind our theme.

### Contributing

We love :heart: contributions!

Use the issue tracker to document bugs or missing features.

Contribute by using the [merge request
workflow](https://docs.gitlab.com/ce/development/contributing/merge_request_workflow.html).
