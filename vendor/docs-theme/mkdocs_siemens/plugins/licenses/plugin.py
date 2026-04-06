import json
from pathlib import Path
from shutil import copy2
from tempfile import TemporaryDirectory
from typing import Any, Dict, List

from mkdocs.config import config_options
from mkdocs.config.base import Config
from mkdocs.config.defaults import MkDocsConfig
from mkdocs.plugins import BasePlugin
from mkdocs.structure.files import File, Files

from . import sbom

MISSING_IMPORT_MESSAGE = (
    "Required packages missing. Please ensure they are installed using extras: "
    "'pip install mkdocs-code-siemens-code-docs-theme[licenses]'."
)

DEFAULT_EXCLUDES = [
    "asyncio",  # no license, python stdlib backport
    sbom.DOCS_THEME_DIST.name,  # our own package, not third-party,
    "element-base-theme",  # Siemens inner source
    "element-icons",  # Siemens inner source
]


class LicensePlugin(BasePlugin):
    config_scheme = (
        ("default", config_options.Type(bool, default=True)),
        ("notice", config_options.Type(bool, default=True)),
        ("bom_files", config_options.Type(list, default=[])),
        ("bom_link", config_options.Type(bool, default=False)),
        ("exclude", config_options.Type(list, default=[])),
        ("include", config_options.Type(list, default=[])),
    )

    def __init__(self):
        # mkdocs preserves filepaths on copy - use a temp dir to flatten them.
        self._temp_dir = TemporaryDirectory()
        self._temp_dir_path = Path(self._temp_dir.name)

    def on_config(self, config: MkDocsConfig, **kwargs) -> MkDocsConfig:
        """
        Add license file to static templates, and inject license and BOM details into
        base config.
        """

        # Inject base config with plugin config
        config["_boms"] = self.get_bom_files()
        config["_components"] = self.get_bom_components()
        config["_licenses"] = self.config
        config["theme"].static_templates.add("_licenses.html")
        return config

    def on_files(self, files: Files, config: MkDocsConfig, **kwargs):
        """Copy all BOM files to site_dir to make them available for download."""

        if not config["_boms"]:
            return files

        for bom_file in config["_boms"]:
            if not bom_file.name == sbom.MKDOCS_BOM_PYTHON_FILE:
                copy2(bom_file, f"{self._temp_dir_path}/{bom_file.name}")

            files.append(
                File(
                    bom_file.name,
                    src_dir=self._temp_dir_path,
                    dest_dir=config["site_dir"],
                    use_directory_urls=config["use_directory_urls"],
                )
            )
        return files

    def on_post_build(self, config: Config) -> None:
        self._temp_dir.cleanup()

    def on_build_error(self, **kwargs: Any) -> None:
        self._temp_dir.cleanup()

    def get_bom_files(self) -> List[Path]:
        """Return list of path strings to relevant SBOM files."""
        bom_files = self.config["bom_files"].copy()

        if self.config["default"]:
            bom_files += [
                sbom.get_theme_bom_file(),
                sbom.get_environment_bom(self._temp_dir_path),
            ]

        return [Path(bom) for bom in bom_files]

    def get_bom_components(self) -> List[Dict]:
        """Return a flat list of components from all available SBOM files"""
        includes = self.config["include"]
        excludes = self.config["exclude"] + DEFAULT_EXCLUDES
        components = []

        for bom_file in self.get_bom_files():
            with open(bom_file, "r", encoding="utf-8") as f:
                bom = json.load(f)

            if includes:
                filtered = [dep for dep in bom["components"] if dep["name"] in includes]
            else:
                filtered = [
                    dep for dep in bom["components"] if dep["name"] not in excludes
                ]

            components.extend(filtered)

        return components
