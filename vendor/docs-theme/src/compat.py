# Reinstate MkDocs' nav merge behavior under Zensical.
# MkDocs deep-merges inherited config but replaces lists, so a child nav
# replaces the parent nav. Zensical deep-merges lists instead. Reference this
# in the inherited config before INHERIT is resolved to opt back in:
# extra:
#   mkdocs_nav: !!python/name:mkdocs_siemens.compat.mkdocs_nav

import sys

_PATCHED = False


def _reinstate_mkdocs_nav() -> bool:
    global _PATCHED

    zensical_config = sys.modules.get("zensical.config")
    if not zensical_config or _PATCHED:
        return False

    merger = zensical_config.always_merger
    merge = merger.merge

    def merge_with_mkdocs_nav(parent, config):
        nav = config.get("nav") if isinstance(config, dict) else None
        merged = merge(parent, config)
        if nav is not None and isinstance(merged, dict):
            merged["nav"] = nav
        return merged

    merger.merge = merge_with_mkdocs_nav
    _PATCHED = True
    return True


mkdocs_nav = _reinstate_mkdocs_nav()
