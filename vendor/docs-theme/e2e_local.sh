#!/bin/sh

cd "$(dirname "$0")"

# renovate: datasource=docker depName=mcr.microsoft.com/playwright versioning=docker
PLAYWRIGHT_VERSION="v1.61.1-noble"
PLAYWRIGHT_IMAGE="mcr.microsoft.com/playwright:${PLAYWRIGHT_VERSION}"
OS=$(uname -s)
CWD=$(pwd)

if [ x"$DOCKER" = "x" ]; then
  DOCKER=docker
fi

case "$DOCKER" in
  *podman*)
    BRIDGE_ADDRESS=host.containers.internal
    ;;
  *)
    BRIDGE_ADDRESS=host.docker.internal
    ;;
esac

if command -v getenforce > /dev/null 2>&1 && [ "$(getenforce)" = "Enforcing" ]; then
  MOUNT_FLAGS=",Z"
fi

PLAYWRIGHT_HOST=$BRIDGE_ADDRESS
NETWORK_MODE=bridge

case "$OS" in
  Linux*)
    PLAYWRIGHT_HOST=localhost
    NETWORK_MODE=host
    ;;
  MINGW*)
    CWD=$(cygpath -w "$CWD")
    ;;
esac

echo "Using '$DOCKER' in '$NETWORK_MODE' mode, connecting to '$PLAYWRIGHT_HOST'"

if [ x"$1" = "xshell" ]; then
  shift
  $DOCKER run -it --rm \
    -e PLAYWRIGHT_HOST=$PLAYWRIGHT_HOST \
    -e PLAYWRIGHT_PROJECT=$PLAYWRIGHT_PROJECT \
    -e PLAYWRIGHT_SUITE=$PLAYWRIGHT_SUITE \
    -e CI=$CI \
    -v "$CWD":/e2e:rw$MOUNT_FLAGS \
    -w /e2e \
    --net=$NETWORK_MODE \
    --ipc=host \
    --entrypoint bash \
    $PLAYWRIGHT_IMAGE \
    "$@"
else
  if [ x"$1" = "xrun" ]; then
    shift
  fi

  if [ -n "$PLAYWRIGHT_PROJECT" ]; then
    set -- "--project=$PLAYWRIGHT_PROJECT" "$@"
  fi

  $DOCKER run -it --rm \
    -e PLAYWRIGHT_HOST=$PLAYWRIGHT_HOST \
    -e PLAYWRIGHT_PROJECT=$PLAYWRIGHT_PROJECT \
    -e PLAYWRIGHT_SUITE=$PLAYWRIGHT_SUITE \
    -e CI=$CI \
    -v "$CWD":/e2e:rw$MOUNT_FLAGS \
    -w /e2e \
    --net=$NETWORK_MODE \
    --ipc=host \
    $PLAYWRIGHT_IMAGE \
    yarn \
    playwright \
    test \
    "$@"
fi
