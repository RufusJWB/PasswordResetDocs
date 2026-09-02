import re
import sys
from pathlib import Path
from typing import Optional, Union
from urllib.parse import unquote, urlparse

from cyclonedx.contrib.license.factories import LicenseFactory
from cyclonedx.model import AttachedText
from cyclonedx.model.bom import Bom
from cyclonedx.model.component import Component, ComponentType
from cyclonedx.model.component_evidence import ComponentEvidence
from cyclonedx.model.license import DisjunctiveLicense
from cyclonedx.model.tool import Tool
from cyclonedx.output import make_outputter
from cyclonedx.schema import OutputFormat, SchemaVersion
from cyclonedx_py._internal.utils import license_trove_classifier
from cyclonedx_py._internal.utils.cdx import licenses_fixup
from packageurl import PackageURL
from pkginfo import Distribution

if sys.version_info >= (3, 13):
    from importlib.metadata import Distribution as InstalledDistribution
    from importlib.metadata import distribution, distributions
    from importlib.metadata._meta import SimplePath
else:
    from importlib_metadata import Distribution as InstalledDistribution
    from importlib_metadata import SimplePath, distribution, distributions

DOCS_THEME_DIST = distribution("mkdocs-code-siemens-code-docs-theme")
MKDOCS_BOM_PYTHON_FILE = "cyclonedx-mkdocs.json"
MKDOCS_BOM_JS_FILE = "mkdocs_siemens/templates/.data/cyclonedx-js.json"


def get_theme_bom_file() -> Union[Path, SimplePath]:
    origin = DOCS_THEME_DIST.origin

    if not origin or not origin.dir_info.editable:
        return DOCS_THEME_DIST.locate_file(MKDOCS_BOM_JS_FILE)

    # we're in editable mode, use the local file
    dist_dir = unquote(urlparse(origin.url).path)
    if sys.platform == "win32":
        dist_dir = dist_dir.lstrip("/")
    return Path(dist_dir) / MKDOCS_BOM_JS_FILE


def collect_evidence(component_name: str) -> Optional[list[DisjunctiveLicense]]:
    licenses = []
    license_re = re.compile("LICEN[CS]E.*|COPYING.*")

    dist = distribution(component_name)
    if not dist.files:
        return None
    license_files = [f for f in dist.files if license_re.match(f.name)]

    if not license_files:
        return None

    for license_file in license_files:
        license_text = AttachedText(content=license_file.read_text())
        bom_license = DisjunctiveLicense(name=str(license_file), text=license_text)
        licenses.append(bom_license)

    return licenses


def collect_metadata_licenses(
    metadata: Distribution, license_factory: LicenseFactory
) -> list:
    """Extract declared licenses from package metadata fields.

    Checks License-Expression (PEP 639), classifier trove strings,
    and the legacy License field, similar to what cyclonedx-bom's
    own environment analysis does.
    """
    licenses = []

    license_expression = metadata.license_expression
    if license_expression is not None:
        # PEP 639: License-Expression takes precedence over classifiers and License
        return [license_factory.make_from_string(license_expression)]

    # Fall back to classifiers and License field
    classifiers = metadata.classifiers or []
    for classifier in classifiers:
        if not isinstance(
            classifier, str
        ) or not license_trove_classifier.is_license_trove(classifier):
            continue

        spdx_id = license_trove_classifier.license_trove2spdx(classifier)
        if spdx_id is None:
            # Last resort: extract short name from classifier
            spdx_id = classifier.rsplit("::", 1)[-1].strip()
        if not spdx_id:
            continue
        licenses.append(license_factory.make_from_string(spdx_id))

    if metadata.license:
        lic = license_factory.make_from_string(metadata.license)
        if isinstance(lic, DisjunctiveLicense) and lic.id is None:
            return licenses
        licenses.append(lic)

    return licenses


def get_pkginfo_metadata(dist: InstalledDistribution) -> Optional[Distribution]:
    metadata = dist.read_text("METADATA") or dist.read_text("PKG-INFO")
    if metadata is None:
        return None

    pkginfo_metadata = Distribution()
    pkginfo_metadata.parse(metadata.encode())
    return pkginfo_metadata


def get_environment_bom(dest_dir: Path) -> Path:
    bom = Bom()
    license_factory = LicenseFactory()

    # Add tool metadata
    bom.metadata.tools.tools.add(
        Tool(
            vendor="Siemens AG",
            name=DOCS_THEME_DIST.name,
            version=DOCS_THEME_DIST.version,
        )
    )

    for dist in distributions():
        if dist.metadata:
            component = Component(
                name=dist.metadata["Name"],
                type=ComponentType.LIBRARY,
                version=dist.metadata["Version"],
                description=dist.metadata["Summary"],
                purl=PackageURL(
                    type="pypi",
                    name=dist.metadata["Name"],
                    version=dist.metadata["Version"],
                ),
            )

            # Add declared licenses from package metadata
            pkginfo_metadata = get_pkginfo_metadata(dist)
            if pkginfo_metadata:
                metadata_licenses = collect_metadata_licenses(
                    pkginfo_metadata, license_factory
                )
                component.licenses.update(metadata_licenses)

            # Add license file texts as evidence
            # https://cyclonedx.org/docs/1.4/json/#components_items_evidence_licenses
            evidence_licenses = collect_evidence(component.name)
            if evidence_licenses:
                if component.evidence is None:
                    component.evidence = ComponentEvidence()
                component.evidence.licenses.update(evidence_licenses)

            licenses_fixup(component)

            bom.components.add(component)

    dest_file = Path(dest_dir) / MKDOCS_BOM_PYTHON_FILE
    outputter = make_outputter(
        bom=bom, output_format=OutputFormat.JSON, schema_version=SchemaVersion.V1_7
    )
    outputter.output_to_file(str(dest_file), allow_overwrite=True)

    return dest_file
