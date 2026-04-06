# Features & Integrations

The theme supports a number of optional features, which can be enabled on a per-project basis.

## Dark and light scheme

The theme comes in a dark and light scheme, following the Siemens Deep Blue and Light colors
defined by [Siemens Brand for Web](https://brandville.siemens.com/en/design-guides-templates/web-new).

By default, it will remain on the light scheme. You can change it to dark by configuring `mkdocs.yml`,
or add a palette toggle so that your users can switch between the dark, light or the system's preferred scheme.

Use the dark scheme only:

```yaml title="mkdocs.yml"
theme:
  palette:
    scheme: dark
```

Add a toggle for users to switch schemes:

```yaml title="mkdocs.yml"
theme:
  palette:
    - media: "(prefers-color-scheme)"
      toggle:
        icon: siemens/element/element-theme-auto
        name: Switch to light mode
    - media: "(prefers-color-scheme: light)"
      scheme: light
      toggle:
        icon: siemens/element/element-sun
        name: Switch to dark mode
    - media: "(prefers-color-scheme: dark)"
      scheme: dark
      toggle:
        icon: siemens/element/element-economy
        name: Switch to system theme
```

The order of the options matters: the first option will be the default scheme on your site.
You can also [customize the icons](icons.md#available-icons) and tooltip texts yourself.
See the [upstream documentation](https://squidfunk.github.io/mkdocs-material/setup/changing-the-colors)
for more details.

## Extending the theme

You can extend the theme with custom templates, partials, and blocks, as documented in the upstream
[mkdocs-material](https://squidfunk.github.io/mkdocs-material/customization/#extending-the-theme)
documentation.

You can follow the upstream instructions, with one important difference when overriding
blocks: you need to override `base-siemens.html`, rather than `base.html`.

Taking the upstream example, your custom `main.html` may instead look like this:

```html
{% extends "base-siemens.html" %}

{% block htmltitle %}
  <title>Lorem ipsum dolor sit amet</title>
{% endblock %}
```

### Hero banner

The theme provides predefined styling for a hero banner page .

It expects the following structure in your documentation project for the hero page:

```text
.
├─ docs/
├─ theme/
│  └─ hero-banner.html
│  └─ background.jpg
└─ mkdocs.yml
```

The location of the background image has to be specified in the `hero-banner.html` with a style tag:

```html
<style>.hero-banner{background:url(background.jpg);}</style>
```

A minimal content of the `hero-banner.html` could look like this
(note that you need to provide your own background image):

```html
{% extends "base-siemens.html" %}
{% block hero %}
  <style>.hero-banner{background:url(background.jpg);}</style>
  <section class="hero-banner">
    <div class="hero-banner-content">
      <div>
        <h1>Siemens</h1>
      </div>
    </div>
  </section>
{% endblock %}
```

You can override the styling and positioning of the banner, e.g. with a snippet as below:

```html
{% block hero %}
  <style>
    .hero-banner {background: url("../img/nice-background.png") center/cover;}
  </style>
  <section class="hero-banner">
    <div class="hero-banner-content">
  ...
{% endblock %}
```

Alternatively you can add your styles in an
[extra stylesheet](https://squidfunk.github.io/mkdocs-material/customization/#additional-css).

Examples of existing hero pages can be found, among others, at
[code.siemens.io](https://code.siemens.com/siemens/code/-/blob/main/theme/brand-banner.html),
[simpl](https://code.siemens.com/simpl/simpl/-/blob/master/theme/brand-banner.html) and
[opensource](https://code.siemens.com/siemens/opensource/-/blob/main/theme/intro-banner.html).

## Content area width

By default, the header/content/footer area is set to use a maximum width of 1600px.
This can be changed by adding an extra css with this rule:

```css
main .md-grid {
  max-width: 1440px;
}
```

This limits the width of the header/content/footer and centers it.
Of course, you can freely choose the desired width.

Please see the
[upstream documentation](https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/?h=grid#content-area-width)
for further details.

## Tertiary navigation

Adds the first level of the navigation tree to the header, on the right beside the logo, like used in
[code](https://siemens.code.siemens.io/code/) and [simpl](https://simpl.code.siemens.io/simpl/) docs.
It supports up to three sections before the first page item:

```yaml
nav:
- Documentation:
  - General:
    - Security & Authentication:
      - 'Overview':        'security/README.md'
```

With this example structure, `Documentation` would point to `security/README.md`.

## Instant navigation

Enables page loading via XHR. The search index survives navigation,
which is especially useful for large documentation sites.

Add the following lines to `mkdocs.yml`:

```yaml
theme:
  features:
    - navigation.instant
```

Please note that mermaid charts will only work properly together with instant
navigation when set up like described below.

## Mermaid charts

[Mermaid diagrams](https://mermaid-js.github.io/mermaid/#/) are supported natively via
[mkdocs-material](https://squidfunk.github.io/mkdocs-material/reference/diagrams/).

Make sure to configure `pymdownx.superfences` as described in the upstream documentation:

```yaml
markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
```

## Hide the sidebars from a markdown file

With this instruction you can hide the TOC and/or the navigation sidebars:

```
---
hide:
- navigation
- toc
---
```

It has to be added to the top of the markdown file in which the sidebars should be hidden.

Please refer to the
[mkdocs-material docs](https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/#hiding-the-sidebars)
for further details.

## Language selection

You can make your documentation available in several languages
and let the user select the language via a dropdown.
To achieve this, add the following elements to your configuration:

```yaml
extra:
  alternate:
    - name: English
      link: <your-site>/en/
      lang: en
    - name: Deutsch
      link: <your-site>/de/
      lang: de
```

Once the extra configuration is in place,
a language selection icon will appear to the right of the search field.

The repository needs to be structured accordingly. You can find out how to do this in
[this discussion](https://github.com/squidfunk/mkdocs-material/discussions/2346).

For further information, please visit the [official documentation](https://squidfunk.github.io/mkdocs-material/setup/changing-the-language/#site-language-selector).

## The Siemens footer

This theme provides a Siemens-specific footer section that sits between the
[footer navigation](https://squidfunk.github.io/mkdocs-material/setup/setting-up-the-footer/#navigation) and the
[copyright notice](https://squidfunk.github.io/mkdocs-material/setup/setting-up-the-footer/#copyright-notice) and
[social links](https://squidfunk.github.io/mkdocs-material/setup/setting-up-the-footer/#social-links) provided
by the upstream theme. By default, it adds basic corporate and legal links, but you can use it to provide additional
links to your project.

For example, using a single topic (legacy):

```yaml
extra:
  links:
    - name: 'code'
      value: 'https://code.siemens.com/code-ops/docs-theme'
    - name: 'issues'
      value: 'https://code.siemens.com/code-ops/docs-theme/-/issues'
    - name: 'milestones'
      value: 'https://code.siemens.com/code-ops/docs-theme/-/milestones'
```

Or you can provide [multiple topics](https://brandville.siemens.com/en/design-guides-templates/web-new/online-design-system-new/components-footer-new)
and define their titles:

```yaml
extra:
  links:
    explore:
      - name: 'code'
        value: 'https://code.siemens.com/code-ops/docs-theme'
      - name: 'issues'
        value: 'https://code.siemens.com/code-ops/docs-theme/-/issues'
      - name: 'milestones'
        value: 'https://code.siemens.com/code-ops/docs-theme/-/milestones'
    "get involved":
      - name: 'yammer'
        value: 'https://www.yammer.com/siemenscrosscollaboration'
      - name: 'github'
        value: 'https://github.com/siemens'
```

It can also include a link to [Third-party Software](#third-party-software-license-bill-of-materials-page)
if configured.

### Overriding the footer

If you'd like to override the Siemens links legal information, for example, to extend it with additional links
to other portals, you can override the `partials/footer.html` partial as documented in the upstream
[documentation on overrides](https://squidfunk.github.io/mkdocs-material/customization/#overriding-partials).

## Customizing license text

### Hide license text

You can hide the license text at the bottom of every page using the following extra option in your `mkdocs.yml`:

```yaml
extra:
  hide_license_text: true
```

You can also configure or override this setting for individual pages in the front matter:

```markdown
---
hide:
  - license_text
---
```

### Use a custom license text

You can provide a custom license text to be displayed at the bottom of each page using the
``page_license_text`` extra option in `mkdocs.yml`, e.g.:

```yaml
extra:
  page_license_text: 'Except where otherwise noted, content on this site is licensed under the
              <a href="https://code.siemens.com/siemens/code/-/blob/main/LICENSE.md">
                The Siemens Inner Source License - 1.2
              </a>.'
```

To display the licenses of third-party software on your site, see our
[Plugin page](plugins.md#third-party-software-license--bill-of-materials-page).

## Multiple versions

You have the possibility to provide multiple versions of your documentation.
The theme adds a version selector in the top right corner when more than one version is detected.
You'll need to first install the Python package `mike` to manage your versions and enable the
plugin in MkDocs by adding the following to your `mkdocs.yml`:

```yaml
extra:
  version:
    provider: mike
```

The way `mike` manages multiple versions is inspired from the Github Pages feature and generates
persistent versions of the MkDocs documentation in a new branch (`gh-pages` by default).

For each deployment of a new version, the branch will be populated by a new MkDocs build according to the
command line options give to `mike`. E.g. to deploy a version 1.0.0 named `latest` in a branch called
`multiple-versions`, apply following command:

```shell
mike deploy -b multiple-versions -t latest 1.0.0
mike set-default -b multiple-versions 1.0.0
```

To deploy the branch with the persistent versions of your MkDocs site to GitLab Pages, add a `pages`
job in the pipeline definition of the persistent branch in `.gitlab-ci.yaml`:

```shell
pages:
  only:
    - multiple-versions
  script:
    - mkdir .public
    - cp -r * .public/
    - mv .public public
  artifacts:
    paths:
      - public
```

> Make sure the deployment branch is protected and only maintainers are able to push to it.

An example project using Git ***tags***, ***GitLab CI*** and ***mike*** to automatically deploy new versions of the
documentation when new releases are created is available under [docs-theme-demo](https://code.siemens.com/code-examples/docs-theme-demo).

You'll find further information in the official [mike documentation](https://github.com/jimporter/mike#usage).

You can also find more information in the [upstream project](https://squidfunk.github.io/mkdocs-material/setup/setting-up-versioning/).

## Including multiple projects in a single site

As with multiple versions described above, you can combine multiple documentation projects into one
to build more scalable, aggregated documentation pages.

You can find a complete example in the
[docs-theme-multirepo](https://code.siemens.com/code-examples/docs-theme-multirepo) project.

> **Note:** This comes with some caveats - we recommend keeping structures simple to avoid running into issues.

## 404 page

The theme provides a default 404 page. You can activate it in the mkdocs.yml:
```yaml
theme:
  static_templates:
    - 404.html
```
Alternatively you can provide your custom page:
```text
.
├─ docs/
├─ theme/
│  └─ 404.html
└─ mkdocs.yml
```

It should be of the same structure as the default 404 page:

```html
{% extends "main.html" %}

{% block content %}
  <h1>404 - Not found</h1>
{% endblock %}

{% block disqus %}{% endblock %}
```
## Badges

You can embed badges (e.g. from [shields.io](https://shields.io/) or generated via
[anybadge](https://github.com/jongracecox/anybadge)) in a paragraph of text by enabling the
[Markdown extension `attr_list`](https://python-markdown.github.io/extensions/attr_list/) in your `mkdocs.yml` file

```yaml
markdown_extensions:
  - attr_list
```

and adding the custom attribute `type="badge"` to the image element:

```md
Usage of a badge ![](https://img.shields.io/badge/label-value-green){ type="badge" } in a paragraph.
```
