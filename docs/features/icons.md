# Siemens UI icons

The theme bundles the entire set of the Siemens Brand UI icons and SiMPL Element icons.
You can use these icons directly in Markdown or in your templates.

!!! info

    For more details on the terms and usage of these icons, explore the
    [Siemens Brandville UI Icons portal](https://brandville.siemens.com/en/design-elements/icons/ui-icons),
    as well as the [SiMPL Element portal](https://simpl.code.siemens.io/simpl/icons/element/).

## Usage

You can follow the upstream instructions on how to
[configure and use icons](https://squidfunk.github.io/mkdocs-material/reference/icons-emojis)
in Markdown, with one exception: the emoji index must point to `mkdocs_siemens.icons.twemoji`. For example:

```yaml
markdown_extensions:
  - attr_list
  - pymdownx.emoji:
      emoji_index: !!python/name:mkdocs_siemens.icons.twemoji
      emoji_generator: !!python/name:material.extensions.emoji.to_svg
```

Using this configuration, you can then use shorthand names directly.
For example, `:siemens-qr-code:` will show as :siemens-qr-code:.

To see all the Markdown shortcodes for available icons, explore the [table below](#available-icons).

## Using icons in templates

You can follow the upstream instructions on how to
[integrate icons](https://squidfunk.github.io/mkdocs-material/reference/icons-emojis/#using-icons-in-templates)
in your templates. To see the paths to available icons, explore the [table below](#available-icons).

## Available icons

The following is a complete list of currently available icons bundled with the theme.

<!-- Siemens icons -->
