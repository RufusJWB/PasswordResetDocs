#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
THEME_DIR="${ROOT_DIR}/.cache/docs-theme"
THEME_REF="${THEME_REF:-v8.0.1}"
THEME_REPO="${THEME_REPO:-https://code.siemens.com/code-ops/docs-theme.git}"
GITLAB_USERNAME="${GITLAB_REPO_USERNAME:-${UV_INDEX_MKDOCS_USERNAME:-}}"
GITLAB_TOKEN="${GITLAB_REPO_TOKEN:-${UV_INDEX_MKDOCS_PASSWORD:-}}"

if [[ -n "${GITLAB_USERNAME}" && -n "${GITLAB_TOKEN}" ]]; then
  git config --global url."https://${GITLAB_USERNAME}:${GITLAB_TOKEN}@code.siemens.com/".insteadOf "https://code.siemens.com/"
fi

rm -rf "${THEME_DIR}"
git clone --depth 1 --branch "${THEME_REF}" "${THEME_REPO}" "${THEME_DIR}"

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
