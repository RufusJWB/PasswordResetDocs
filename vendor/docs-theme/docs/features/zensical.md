# Static site generators

[MkDocs](https://www.mkdocs.org/) is the primary supported static site generator for this theme.
The theme is also tested with [Zensical](https://zensical.org/) for compatibility, so you can
migrate when you are ready.

## MkDocs

```sh
uv run mkdocs build --strict
uv run mkdocs serve
```

## Zensical

Install the theme with the `zensical` extra to pull in Zensical. Example using [uv](https://docs.astral.sh/uv/):

```shell-session
uv add "mkdocs-code-siemens-code-docs-theme[zensical]"
```

Then build or serve with Zensical:

```sh
uv run zensical build --strict
uv run zensical serve
```

## Migrating from MkDocs to Zensical

- Install the theme with the `zensical` extra and switch commands from `mkdocs` to `zensical`.
- Drive `use_directory_urls` from an environment variable so both engines behave the same (see below).
- Opt in to the MkDocs-compatible navigation merge if you use `INHERIT` and override `nav` (see below).
- Opt in to the Zensical licenses shim if you use the licenses plugin (see below).
- Use the list form for footer links if the order matters (see below).
- Remove `extra.favicon` from your `mkdocs.yml` if present, unless you provide your own favicon (see below).
- Fix any broken links that Zensical reports in `--strict` mode.
- Follow the upstream [Zensical documentation](https://zensical.org/about/) for anything else.

### Directory URLs

Zensical has no `--no-directory-urls` command-line flag. Drive `use_directory_urls` from an
environment variable in the config so both engines behave the same way:

```yaml
use_directory_urls: !ENV [USE_DIRECTORY_URLS, true]
```

Export `USE_DIRECTORY_URLS=false` when the site is served from a sub-path, for example CI review
artifacts. MkDocs reads the same variable, so you can drop the `--no-directory-urls` flag and keep
a single mechanism across both engines.

### Inherited navigation deep-merge behavior

MkDocs deep-merges inherited config but replaces lists, so a child `nav` replaces the parent `nav`.
Zensical deep-merges lists instead. When you use `INHERIT` and override `nav`, opt in to the
MkDocs-compatible merge shim in the inherited config:

```yaml
extra:
  mkdocs_nav: !!python/name:mkdocs_siemens.compat.mkdocs_nav
```

This reinstates the MkDocs behavior where a child `nav` replaces the parent `nav`.

### Licenses plugin

Zensical does not execute MkDocs plugin hooks. To use the theme's licenses page with Zensical, keep
`plugins: - licenses`, install both extras, and add the Python reference below:

```shell-session
uv add "mkdocs-code-siemens-code-docs-theme[licenses,zensical]"
```

```yaml
plugins:
  - licenses:
      bom_link: true

extra:
  licenses: !!python/name:mkdocs_siemens.compat_licenses.licenses
```

### Footer link order

Zensical sorts mapping keys before rendering templates. If the order of footer links matters, use a
list for `extra.links` instead of a mapping:

```yaml
extra:
  links:
    - explore:
        - name: code
          value: https://code.siemens.com/code-ops/docs-theme
        - name: issues
          value: https://code.siemens.com/code-ops/docs-theme/-/issues
    - community:
        - name: community
          value: https://engage.cloud.microsoft/main/org/siemens.com
```

### Default favicon

If you want to use the default favicon, your `mkdocs.yml` should not specify `extra.favicon`. The default favicon is provided by the theme and will be used automatically if you do not override it.

If you define `extra.favicon` as `assets/images/favicon.png` and do not provide your own favicon at that path, it will incorrectly use the default Zensical favicon instead of the theme's default favicon. To use the theme's default favicon, simply remove the `extra.favicon` entry from your `mkdocs.yml` or provide your own favicon at the specified path.
