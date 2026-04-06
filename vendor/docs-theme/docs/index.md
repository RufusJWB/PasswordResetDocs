# docs-theme

This projects provides the official [code.siemens.io](https://code.siemens.io/) theme for MkDocs.

[MkDocs](https://www.mkdocs.org/) is a **static website generator** written in Python that helps you build project
documentation. It uses [markdown](https://en.wikipedia.org/wiki/Markdown) as input format for the documentation files.

The `docs-theme` project provides Siemens look-and-feel for your website and is meant to be installed on top of MkDocs.
See available [releases](https://code.siemens.com/code-ops/docs-theme/-/releases) and
[packages](https://code.siemens.com/code-ops/docs-theme/-/packages).

## Quickstart

The easiest way to get started using `docs-theme` is to use our
**[quickstart template](https://code.siemens.com/code-examples/docs-theme-quickstart)**.
Simply fork the project in your group/namespace according to the instructions in the
readme and your site will be deployed almost immediately with a few sample pages.

You can then start editing markdown and adding files directly in GitLab's web editor,
without a local installation. If you use a merge request workflow, the template will
automatically build [Review Apps](https://docs.gitlab.com/ee/ci/review_apps/) so you
can visually review changes directly from the merge request.

Alternatively, you can also use the
**[docs-theme-demo project](https://code.siemens.com/code-examples/docs-theme-demo)**
to get started. The demo project demonstrates how to use some of the more advanced features
of the theme, such as deploying multiple versions. Just like the quickstart project, you can
fork this project to learn how to use these features.

## Prerequisites

For more advanced use cases, you may want to install and work with the theme locally.

The `mkdocs-code-siemens-code-docs-theme` requires Python 3.8 or higher,
and a package manager such as `pip` or `poetry` to install and use the theme.

> **Note:** We highly recommend running this from your Python project's
> [virtual environment](https://docs.python.org/3/tutorial/venv.html)
> to avoid polluting your system's Python packages.
> See the [Development section](development.md) on how to set it up.

## Usage

In order to install and use the theme, follow the instructions below:

1. Add the theme package to your project's dependencies and install it via your favorite Python package manager (`pip`, `uv`, `poetry` etc).

      The package is named `mkdocs-code-siemens-code-docs-theme` and can be downloaded from the code.siemens.com package registry.

      - Example using uv:

        Declare the `mkdocs` index in your `pyproject.toml` file:

        ```toml
        [[tool.uv.index]]
        name = "mkdocs"
        url = "https://code.siemens.com/api/v4/projects/64538/packages/pypi/simple/"
        explicit = true

        [tool.uv.sources]
        mkdocs-code-siemens-code-docs-theme = { index = "mkdocs" }
        ```

        Before running `uv add mkdocs-code-siemens-code-docs-theme`.

      - Example using poetry:

        ```sh
        poetry source add --priority=explicit docs-theme https://code.siemens.com/api/v4/projects/64538/packages/pypi/simple/
        poetry add --source docs-theme mkdocs-code-siemens-code-docs-theme
        ```

      - Example using plain pip (not recommended):

        ```sh
        python3 -m pip install mkdocs-code-siemens-code-docs-theme -i https://code.siemens.com/api/v4/projects/64538/packages/pypi/simple
        ```

2. Configure the theme in your `mkdocs.yml` file.

      Example (note the name of the theme: `code-siemens-code-docs-theme`):

      ```yaml
      theme:
        name: 'code-siemens-code-docs-theme'
        language: en
        palette:
          - scheme: default
            primary: teal
            accent: teal
        features:
          - navigation.tabs
          - navigation.sections
          - navigation.expand
          - page.toc
      ```

### Example configurations of projects using the docs-theme

Below you can find a list of examples and projects that are actively using docs-theme. The configurations of these
projects might also be helpful in terms of additional guidance as to how the theme gets used and configured.

- [siemens/code](https://code.siemens.com/siemens/code/-/blob/main/mkdocs.yml)
- [simpl/simpl](https://code.siemens.com/simpl/simpl/-/blob/main/mkdocs.yml)
- [code-examples/docs-theme-quickstart](https://code.siemens.com/code-examples/docs-theme-quickstart/-/blob/main/mkdocs.yml) (the recommended quickstart template)
- [code-examples/docs-theme-demo](https://code.siemens.com/code-examples/docs-theme-demo/-/blob/main/mkdocs.yml) (uses `mike` for multi-version docs)
- [code-examples/docs-theme-multirepo](https://code.siemens.com/code-examples/docs-theme-multirepo/-/blob/main/mkdocs.yml) (uses `mkdocs-multirepo-plugin` for multi-project docs)
- [core/directory-client](https://code.siemens.com/core/directory-client/-/blob/v2.0.0/mkdocs.yml) (archived example, uses `mkdocstrings` to generate Python API docs)
