# flake8: noqa
import json

from setuptools import find_packages  # type: ignore[import-untyped]

# Load package.json contents
with open("package.json") as data:
    package = json.load(data)

# Load README contents
with open("README.md", encoding="utf-8") as data:
    LONG_DESCRIPTION = data.read()

NAME = package["name"]
VERSION = package["version"]
URL = package["homepage"]
LICENSE = package["license"]
DESCRIPTION = package["description"]
LONG_DESCRIPTION = LONG_DESCRIPTION
LONG_DESCRIPTION_CONTENT_TYPE = "text/markdown"
AUTHOR = package["author"]["name"]
AUTHOR_EMAIL = package["author"]["email"]
CLASSIFIERS = [
    "Development Status :: 5 - Production/Stable",
    "Environment :: Web Environment",
    "License :: SISL 1.1",
    "Programming Language :: JavaScript",
    "Programming Language :: Python",
    "Topic :: Documentation",
    "Topic :: Software Development :: Documentation",
    "Topic :: Text Processing :: Markup :: HTML",
]
PACKAGES = find_packages(exclude=["src*"])
INCLUDE_PACKAGE_DATA = True
PYTHON_REQUIRES = ">=3.8.0"
EXTRAS_REQUIRE = {
    "licenses": ["cyclonedx-bom>=7,<8"],
}
ENTRY_POINTS = {
    "mkdocs.themes": [
        "code-siemens-code-docs-theme = mkdocs_siemens.templates",
    ],
    "mkdocs.plugins": [
        "code-siemens-code-docs-theme/licenses = mkdocs_siemens.plugins.licenses.plugin:LicensePlugin",
        # Wrapping the material search plugin as our own ensures it's always picked up correctly
        # instead of the builtin mkdocs search plugin. For more context, see
        # https://github.com/squidfunk/mkdocs-material/issues/4581
        "code-siemens-code-docs-theme/search = material.plugins.search.plugin:SearchPlugin",
    ],
}
ZIP_SAFE = False
INSTALL_REQUIRES = [
    "mkdocs>=1.6.1",
]
