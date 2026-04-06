#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
THEME_DIR="${THEME_DIR:-${ROOT_DIR}/vendor/docs-theme}"

if [[ ! -d "${THEME_DIR}" ]]; then
  echo "Expected vendored theme sources in ${THEME_DIR}. Import the docs-theme repository via git subtree before running this script." >&2
  exit 1
fi

pushd "${THEME_DIR}" > /dev/null
if ! command -v corepack >/dev/null 2>&1; then
  npm install --global corepack@0.24.1
fi
corepack enable
yarn --frozen-lockfile
yarn src:compile
yarn src:postcss
yarn dist:cpy:src
yarn dist:cpy:vendor
yarn dist:cpy:html
yarn src:hash
popd > /dev/null

cd "${ROOT_DIR}"
uv pip install --no-deps "${THEME_DIR}"
