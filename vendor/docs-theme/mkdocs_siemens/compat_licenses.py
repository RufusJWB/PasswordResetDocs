from __future__ import annotations

import shutil
import sys
from pathlib import Path
from typing import Any

from .plugins.licenses.plugin import LicensePlugin

PATCH_MARKER = "_mkdocs_siemens_licenses_patch"

_PLUGIN: LicensePlugin | None = None


def _sanitize_template_data(value: Any) -> Any:
    if value is None:
        return ""
    if isinstance(value, dict):
        return {key: _sanitize_template_data(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_sanitize_template_data(item) for item in value]
    return value


def _configure_licenses(config: dict[str, Any]) -> None:
    plugin_config = config["plugins"].get("licenses")
    if plugin_config is None:
        return

    plugin_options = plugin_config.get("config", {})
    license_config = {
        "default": True,
        "notice": True,
        "bom_files": [],
        "bom_link": False,
        "exclude": [],
        "include": [],
        **plugin_config,
        **plugin_options,
    }
    root_dir = Path(config["root_dir"])
    license_config["bom_files"] = [
        path if (path := Path(bom_file)).is_absolute() else root_dir / path
        for bom_file in license_config.get("bom_files", [])
    ]

    global _PLUGIN

    if _PLUGIN is None:
        _PLUGIN = LicensePlugin()

    _PLUGIN.config = license_config
    template_dir = _PLUGIN._temp_dir_path
    bom_files = _PLUGIN.get_bom_files()
    components = _PLUGIN.get_bom_components()

    for bom_file in bom_files:
        destination = template_dir / bom_file.name
        if bom_file.resolve() != destination.resolve():
            shutil.copyfile(bom_file, destination)

    config["extra"]["licenses"] = {
        "_licenses": {
            "notice": license_config.get("notice", True),
            "bom_link": license_config.get("bom_link", False),
        },
        "_boms": [{"name": bom_file.name} for bom_file in bom_files],
        "_components": _sanitize_template_data(components),
    }

    config["theme_dirs"].append(str(template_dir))
    config["theme"]["static_templates"].extend(
        ["_licenses.html", *[bom_file.name for bom_file in bom_files]]
    )


def _patch_zensical_config() -> bool:
    zensical_config = sys.modules.get("zensical.config")
    if zensical_config is None:
        return False

    apply_defaults = getattr(zensical_config, "_apply_defaults")
    if getattr(apply_defaults, PATCH_MARKER, False):
        return True

    def apply_defaults_with_licenses(
        config: dict[str, Any], path: str
    ) -> dict[str, Any]:
        result = apply_defaults(config, path)
        _configure_licenses(result)
        theme_files = getattr(zensical_config, "_list_templates")(result)
        result["template_hash"] = getattr(zensical_config, "_hash")(theme_files)
        return result

    setattr(apply_defaults_with_licenses, PATCH_MARKER, True)
    setattr(zensical_config, "_apply_defaults", apply_defaults_with_licenses)
    return True


licenses = _patch_zensical_config()
