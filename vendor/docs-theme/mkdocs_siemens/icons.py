import copy
from pathlib import Path
from typing import Any, Dict, Union

import material.extensions.emoji  # type: ignore[import-untyped]

ICONS_DIR = Path(__file__).parent / "templates" / ".icons"


def get_siemens_icons() -> Dict[str, Dict[str, Union[str, Any]]]:
    """
    Return a dict of icon names and paths to inject into a custom index as defined in
    https://facelessuser.github.io/pymdown-extensions/extensions/emoji/#custom-emoji-indexes.

    The usage of `path` keys is consistent with inlined SVG icons in material.
    """
    locations = [ICONS_DIR / "siemens", ICONS_DIR / "siemens" / "element"]
    icons = {}

    for location in locations:
        for path in location.glob("*.svg"):
            name = f":siemens-{path.stem}:"
            icons[name] = {"name": name, "path": path}

    return icons


def twemoji(options: Dict[str, Any], md) -> Dict[str, Any]:
    """Extend the Material-provided Twemoji index with Siemens icons."""
    index = copy.deepcopy(material.extensions.emoji.twemoji(options, md))

    index["emoji"].update(get_siemens_icons())
    return index
