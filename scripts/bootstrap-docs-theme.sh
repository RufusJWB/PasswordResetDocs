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

COREPACK_INSTALL_DIR="${COREPACK_INSTALL_DIR:-${HOME}/.local/bin}"
mkdir -p "${COREPACK_INSTALL_DIR}"
case ":${PATH}:" in
  *":${COREPACK_INSTALL_DIR}:"*) ;;
  *) export PATH="${COREPACK_INSTALL_DIR}:${PATH}" ;;
esac

corepack enable --install-directory "${COREPACK_INSTALL_DIR}"
yarn --frozen-lockfile --ignore-engines
yarn src:compile
yarn src:postcss
yarn dist:cpy:src
yarn dist:cpy:vendor
yarn dist:cpy:html
yarn src:hash
popd > /dev/null

cd "${ROOT_DIR}"
VENV_PYTHON="${ROOT_DIR}/.venv/bin/python"
if [[ -x "${VENV_PYTHON}" ]]; then
  uv pip install --python "${VENV_PYTHON}" --no-deps "${THEME_DIR}"
else
  uv pip install --no-deps "${THEME_DIR}"
fi
