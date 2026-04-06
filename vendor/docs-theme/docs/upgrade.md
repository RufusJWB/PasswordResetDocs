# Upgrade & Migration Guide

## Upgrade docs-theme from v6.x to v7.x

With version 7, docs-theme has been upgraded to [mkdocs-material 9.4+](https://squidfunk.github.io/mkdocs-material/changelog/#9.4.0),
which replaces `materialx` with its own emoji extension. You will need to adjust your configuration as follows:

=== "6.x"

    ```yaml title="mkdocs.yml"
    markdown_extensions:
      - pymdownx.emoji:
          emoji_index: !!python/name:mkdocs_siemens.icons.twemoji
          emoji_generator: !!python/name:materialx.emoji.to_svg
    ```

=== "7.x"

    ```yaml title="mkdocs.yml"
    markdown_extensions:
      - pymdownx.emoji:
          emoji_index: !!python/name:mkdocs_siemens.icons.twemoji
          emoji_generator: !!python/name:material.extensions.emoji.to_svg
    ```

The width of the header, content, and footer containers is now consistenly controlled by
the `.md-grid` class via `max-width` the same way as in the upstream theme, with the default width set to `1600px`.
This improves the alignment of the content with other elements, but if you've been using width or margin overrides
for your site, you will need to adjust them accordingly.
Please check the [Content area width](features/index.md#content-area-width) section for more details.

The `en-custom` language partial is no longer present. If you've configured this in your mkdocs.yml configuration,
simply omit it or provide your own custom partial if you'd like a different title for the Table of Contents on your site.

Version 7 also supports adding multiple topics for links in large footers as
[outlined in Siemens Brand](https://brandville.siemens.com/en/design-guides-templates/web-new/online-design-system-new/components-footer-new).
Single-column links are now left-aligned. See the [Siemens footer](features/index.md#the-siemens-footer) section on how to configure them.

Additionally, the partials have been modified to reduce nesting.
If you override partials, you may need to adjust your file names and `include` statements:

|                v6.x                |             v7.x              |
| ---------------------------------- | ----------------------------- |
| `src/partials/siemens/header.html` | `src/partials/header.html`    |
| `src/partials/siemens/footer.html` | `src/partials/copyright.html` |

docs-theme now also no longer applies padding on the `md-content` element for larger screens.
If you use custom overrides or hide elements such as navigation or the table of contents,
this may affect the look and feel of the content.

## Upgrade docs-theme from v5.x to v6.x

With version 6, docs-theme comes with a new light and dark scheme more closely aligned
with current Siemens Brand guidelines. If you've previously explicitly set a `palette`
option, you should remove it or configure one of the new schemes explicitly.
See [Dark and light scheme](features/index.md#dark-and-light-scheme)
on how to set up the dark scheme or a color palette toggle.

The PlantUML integration now also follows these brand changes and renders with Siemens colors
on both schemes if you configure the extension properly. See
[PlantUML rendering](features/integrations.md#plantuml-rendering) for more details.

## Upgrade docs-theme from v4.x to v5.x

With version 5, upstream [mkdocs-material](https://squidfunk.github.io/mkdocs-material/)
has been upgraded to version 9. Please first consult the
[upgrade documentation](https://squidfunk.github.io/mkdocs-material/upgrade/#upgrading-from-8x-to-9x)
for all the changes.

Notably, the footer navigation is now opt-in, meaning you have to explicitly add `navigation.footer`
to your theme features in order for the previous/next page buttons to appear on your site:

```yaml title="mkdocs.yml"
theme:
  features:
    - navigation.footer
```

### Using plugins

As of mkdocs-material v9, plugins provided by mkdocs-material are now namespaced with `material/`,
as documented in [MkDocs 1.4.1 release notes](https://www.mkdocs.org/about/release-notes/#version-142-2022-11-01).
You must use this in your `mkdocs.yml` configuration.

=== "4.x"

    ```yaml title="mkdocs.yml"
    plugins:
      - search
      - social
      - tags
    ```

=== "5.x"

    ```yaml title="mkdocs.yml"
    plugins:
      - search
      - material/social
      - material/tags
    ```

The material search plugin is also now namespaced as `material/search`. For compatibility,
this theme now wraps the search plugin as `code-siemens-com-docs-theme/search`.
When overriding the search partial, this explicit naming must be preserved.

```jinja2
{% if "code-siemens-code-docs-theme/search" in config.plugins or "material/search" in config.plugins %}
  <!-- custom overrides here -->
{% endif %}
```

### Hiding features in frontmatter

With version 5, hiding the community button and the license text on a specific page via
its frontmatter has changed to align with the
[upstream approach](https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/#hiding-the-sidebars).
You should now list them in the `hide:` key the same way as hiding features in the upstream theme:

=== "4.x"

    ```markdown
    ---
    hide:
      - navigation
      - toc
    hide_community_button: true
    hide_license_text: true
    ---

    # Document title
    ...
    ```

=== "5.x"

    ```markdown
    ---
    hide:
      - navigation
      - toc
      - community_button
      - license_text
    ---

    # Document title
    ...
    ```

## Upgrade docs-theme from v3.x to v4.x

With version 4, upstream [mkdocs-material](https://squidfunk.github.io/mkdocs-material/)
has been upgraded to version 8, and the minimum supported Python version is 3.8. The theme
is no longer published to the BT Artifactory - you should use the
[code.siemens.com registry](index.md#usage) instead.

Please check the upstream [upgrade guide](https://squidfunk.github.io/mkdocs-material/upgrade/#upgrading-from-7x-to-8x)
in case you are affected. Also check the [Changelog](changelog.md#400-2023-04-11) entry for a
full list of changes.

Most importantly, mermaid charts should now use the native integration to get proper
theming, instead of CDN-hosted javascript:

=== "3.x"

    ```yaml title="mkdocs.yml"
    markdown_extensions:
      - pymdownx.superfences:
          custom_fences:
            - name: mermaid
              class: mermaid
              format: !!python/name:pymdownx.superfences.fence_div_format

    extra_javascript:
      - https://cdn.siemens-web.com/js/mermaid/8.12.0/mermaid.min.js
    ```

=== "4.x"

    ```yaml title="mkdocs.yml"
    markdown_extensions:
      - pymdownx.superfences:
          custom_fences:
            - name: mermaid
              class: mermaid
              format: !!python/name:pymdownx.superfences.fence_code_format
    ```

## Upgrade docs-theme from v2.x to v3.x

With version 3 of the theme a breaking change has been introduced:
The upstream [mkdocs-material](https://squidfunk.github.io/mkdocs-material/) theme
is now no longer bundled with this package, but used as a dependency and extended.
As a result, the `base.html` template is not present in this package. If you use
custom templates in your pages, you should extend `main.html` instead and
adjust your template accordingly.

### Python venv

> **Hint:** We recommend using a virtual environment when working with pip.
> See our [development section](development.md) for instructions.

### Template extension

If you have defined a `custom_dir` in your `mkdocs.yml` and there is for example
a `brand-banner.html` that extends `base.html`, then you need to change it to
extend `main.html`.
The change must be made in all files that extend `base.html`.

#### Example

###### Version 2:

```html
{% extends "base.html" %}

{% block hero %}
  <style>.hero-banner{background:url(background.jpg);}</style>
  <section class="hero-banner">
  ...
```

###### Version 3:

```html
{% extends "main.html" %}

{% block hero %}
  <style>.hero-banner{background:url(background.jpg);}</style>
  <section class="hero-banner">
  ...
```

### PlantUML

If you use PlantUML in your documentation, you need to make sure that the Python module is
installed, as it is no longer a dependency of this theme.
When using PlantUML, you would have the following in your `mkdocs.yml`:

```yaml
markdown_extensions:
  - plantuml_markdown:
...
```

Install the module:

```shell
python3 -m pip install plantuml-markdown
```

## Upgrade docs-theme from v1.x to v2.x

With version 2.0, docs-theme has been upgraded from version 3.0.3 onto version 7.2.1+ of mkdocs-material
and from version 1.1 of MkDocs to version 1.2.2+.

### Upgrade Python packages

Please upgrade your Python packages. For example, if you are using [`uv`](https://docs.astral.sh/uv):

```shell
uv lock --upgrade-package mkdocs-code-siemens-code-docs-theme
```

### Changes in `mkdocs.yml`

Some adaptions need to be made to the `mkdocs.yml` configuration to make it run again.

There are some example configurations for
[code.siemens.com](https://siemens.code.siemens.io/code/)
([configuration](https://code.siemens.com/code-ops/docs-theme/-/blob/main/examples/mkdocs-code.yml)),
[simpl.siemens.io](https://simpl.code.siemens.io/simpl)
([configuration](https://code.siemens.com/code-ops/docs-theme/-/blob/main/examples/mkdocs-simpl.yml)),
[core/directory](https://core.code.siemens.io/directory/)
([configuration](https://code.siemens.com/code-ops/docs-theme/-/blob/main/examples/mkdocs-directory.yml))
and [core/food](https://core.code.siemens.io/food/)
([configuration](https://code.siemens.com/code-ops/docs-theme/-/blob/main/examples/mkdocs-food.yml))
available to have a look at.

#### Theme palette

##### Version 1:

```yaml
theme:
  palette:
    primary: 'teal'
    accent: 'teal'
```

##### Version 2:

```yaml
theme:
  palette:
    - scheme: default
      primary: teal
      accent: teal
```

#### Theme features

The list of features needs to be structured differently for v1 and v2 of the theme:

###### Version 1:

```yaml
theme:
  feature:
    tabs: true
```

###### Version 2:

```yaml
theme:
  features:
    - navigation.tabs
```

The following optional features are available and tested:

##### navigation.tertiary

Adds the first navigation level to the header on the right of the logo.

###### Version 1 (must be removed):

```yaml
extra:
  tertiary_nav_hirarchy: true
```

###### Version 2:

```yaml
theme:
  features:
    - navigation.tertiary
```

For more information, see our documentation on [tertiary navigation](features/index.md#tertiary_navigation).

##### openapi

###### Version 1 (must be removed):

```yaml
theme:
  feature:
    openapi_render: true
```

###### Version 2:

See OpenAPI inline rendering in the [Integrations documentation](features/integrations.md#openapi-inline-rendering).

##### navigation.sections

Structures top-level sections in the sidebar navigation as groups ([details](https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/#navigation-sections)).

##### navigation.tabs

Adds navigation tabs to the search bar, but doesn't remove the search bar if disabled ([details](https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/#navigation-tabs)).

##### navigation.top

Adds a 'back-to-top' overlay button ([details](https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/?h=navigation.top#back-to-top-button)).

##### navigation.expand
Expands the sections in the sidebar navigation ([details](https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/#navigation-expansion)).

##### header.autohide

Hides the header completely when scrolling down ([details](https://squidfunk.github.io/mkdocs-material/setup/setting-up-the-header/#automatic-hiding)).

##### logo

###### Version 1:

```yaml
theme:
  logo:
    icon: '\uE80C'
```

Should be removed.

##### include_search_page and search_index_only

The following needs to be present for v2:

```yaml
theme:
  include_search_page: false
  search_index_only: true
```

#### markdown_extensions

##### codehilite

###### Version 1:

```yaml
markdown_extensions:
  - codehilite:
      guess_lang: true
      linenums: true
```

###### Version 2 ([details](https://squidfunk.github.io/mkdocs-material/reference/code-blocks/?h=codehilite#highlight)):

```yaml
markdown_extensions:
  - pymdownx.highlight:
      linenums: true
      linenums_style: pymdownx-inline
```

##### pymdownx.extrarawhtml

###### Version 1:

```yaml
markdown_extensions:
  - pymdownx.extrarawhtml
```

###### Version 2 ([details](https://facelessuser.github.io/pymdown-extensions/about/releases/8.0/#retired-features)):

```yaml
markdown_extensions:
  - md_in_html
```

## Troubleshooting

Please see [Troubleshooting](troubleshooting.md).
