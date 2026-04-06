import os

# We have our own roadmap for migrating our downstream theme.
# See https://code.siemens.com/siemens/code/-/issues/8241
os.environ["NO_MKDOCS_2_WARNING"] = "true"
# ProperDocs renamed the env var in https://github.com/ProperDocs/properdocs/pull/53
os.environ["DISABLE_MKDOCS_2_WARNING"] = "true"
