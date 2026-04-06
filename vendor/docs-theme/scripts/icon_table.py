from mkdocs.structure.pages import Page

from mkdocs_siemens.icons import get_siemens_icons, ICONS_DIR

ICONS_PAGE = "features/icons.md"
ICONS_PLACEHOLDER = "<!-- Siemens icons -->"


def icon_table() -> str:
    table = ["| Icon | Markdown shortcode | Template icon path |", "|-|-|-|"]
    for key, value in sorted(get_siemens_icons().items()):
        path = value["path"].relative_to(ICONS_DIR.parent)
        table.append(f"| {key} | `{key}` | `{path}` |")

    return "\n".join(table)


def on_page_markdown(markdown: str, page: Page, **kwargs) -> str:
    if page.file.src_path != ICONS_PAGE:
        return markdown

    return markdown.replace(ICONS_PLACEHOLDER, icon_table())
