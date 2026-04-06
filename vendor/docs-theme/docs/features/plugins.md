# Plugins

The theme comes with plugins [provided by Material for MkDocs](https://squidfunk.github.io/mkdocs-material/?q=plugin)
as well as our own plugins to extend it.

## Using plugins provided by Material for MkDocs

You can use all plugins provided by the Material theme, with one caveat: Material plugins must be defined in `mkdocs.yml`
as [namespaced plugins](https://www.mkdocs.org/about/release-notes/#version-141-2022-10-15), with the exception of the
`search` plugin, which is a special case.

For example, to enable the tags and social plugins:

```yaml
plugins:
  - search
  - material/social
  - material/tags
```

Alternatively, you can also explicitly namespace the `search` plugin:

```yaml
plugins:
  - material/search
  - material/social
  - material/tags
```

## Third-party Software License & Bill of Materials page

The theme comes with a plugin enabling you to list the OSS licenses used to build the website.
A link to `Third-party Software` will be added to the footer when this plugin is enabled.

It will generate a JSON [CycloneDX SBOM](https://cyclonedx.org/) to aid in OSS clearing, and render
a Bill of Materials table on the license page, with links to available license texts below.

You'll need to install the theme with the `licenses` extra. Example using plain pip:

```shell-session
python3 -m pip install mkdocs-code-siemens-code-docs-theme[licenses] -i https://code.siemens.com/api/v4/projects/64538/packages/pypi
```

Example using poetry:

```sh
poetry config repositories.docs-theme https://code.siemens.com/api/v4/projects/64538/packages/pypi/simple
poetry add --source docs-theme mkdocs-code-siemens-code-docs-theme[licenses]
```

Then, enable the `licenses` plugin in `mkdocs.yml`:

```yaml
plugins:
  - search
  - licenses
```

The plugin supports generating and parsing CycloneDX SBOMs, as this is a superset of the
[Siemens Standard BOM](https://code.siemens.com/scpautomation/standard-bom) that can help you in
your OSS clearing tasks.

!!! note
    The BOM generator adds component details on a best-effort basis. Please be aware of its
    [limitations](https://cyclonedx-bom-tool.readthedocs.io/en/latest/usage.html#parser-schema-support).

### Including or excluding components

By default, the plugin will list all Python packages used to build the website, except for
the theme itself (`mkdocs-code-siemens-code-docs-theme`), which is Inner Source.

!!! tip
    For this reason, you may want to use separate dependency groups to ensure only
    the packages relevant to the website build are collected.

However, you can customize this by using the `include:` or `exclude:` options. `include:` takes
precedence over `exclude:` in case you'd like to only publish third-party software from an allowlist,
meaning `exclude:` will be ignored if both are configured.

Excluding packages:

```yaml
plugins:
  - search
  - licenses:
      exclude:
        - Jinja2
        - urllib3
```

Explicitly including packages:

```yaml
plugins:
  - search
  - licenses:
      include:
        - mkdocs-material
        - mkdocs-material-extensions
```

This way, you control the packages displayed manually, while the licenses plugin takes
care of extracting and displaying the component details and licenses.

!!! note
    These packages are not excluded from the raw SBOM files as these are intended to help
    with the clearing process.

### Providing your own CycloneDX SBOM

If you are using other technologies, or you'd like to customize the list even more, your can
add your own SBOM which you can generate with any of the available
[SBOM generators](https://cyclonedx.org/tool-center/). To display it on the license page, use the
`bom_files` entry. For example:

```yaml
plugins:
  - search
  - licenses:
      bom_files:
        - cyclonedx-npm.json
        - cyclonedx-maven.json
```

An example extracting a custom SBOM from your `poetry.lock` file using
[cyclonedx-python](https://github.com/CycloneDX/cyclonedx-python) might look like this:

```sh
poetry add --group dev cyclonedx-bom

poetry run cyclonedx-bom --poetry --format json --output cyclonedx-poetry.json
```

Or, if you bundle your own JavaScript dependencies with your website, extract an SBOM from your
`yarn.lock` file using [@cyclonedx/bom](https://github.com/CycloneDX/cyclonedx-node-module):

```sh
yarn add --dev @cyclonedx/bom@3.10.6

yarn cyclonedx-node --include-license-text --output cyclonedx-node.json
```

You can then add this to your build scripts in `pyproject.toml` or `package.json` to have them available
when building the website.

This will display both your SBOMs and the default ones provided by the theme. To skip collecting the
theme's own SBOMs and only display your own, you can disable them:

```yaml
plugins:
  - search
  - licenses:
      default: false
```

### Show or hide content

You can choose to hide the OSS License texts (and show only the BOM table). This is displayed by default.

```yaml
plugins:
  - search
  - licenses:
      notice: false
```

You can provide download links to the SBOM JSON files on your license page. This is not displayed by default.

```yaml
plugins:
  - search
  - licenses:
      bom_link: true
```

## Blog

This theme has support for the [material/blog plugin](https://squidfunk.github.io/mkdocs-material/setup/setting-up-a-blog/). You can enable it by adding the following to your `mkdocs.yml`:

```yaml
plugins:
  - material/blog
  - ...

nav:
  - Blog:
    - blog/index.md
  - ...
```

Please follow the [mkdocs-material documentation](https://squidfunk.github.io/mkdocs-material/setup/setting-up-a-blog/#configuration) for further configuration.

### Caveats

- If you are using the `baselevel` option for the `page.toc` feature, the titles of your blog posts will be displayed twice. This is because the heading is reduced and is no longer picked up as a title. To get around this you can either stop using the `baselevel` option, or define the `title` of each individual blog post in the frontmatter instead.
- In some cases, the `navigation.tertiary` option may cause the "Blog", "Archive", and "Categories" sections to appear in the secondary navigation (on top) rather than the sidebar. This doesn't affect functionality but may appear less intuitive to users. There is no known workaround for this at this time apart from disabling the option or nesting the blog section deeper in the navigation.
