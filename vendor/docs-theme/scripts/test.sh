#!/bin/sh
set -e

# renovate: datasource=docker depName=cypress/included versioning=docker
CYPRESS_VERSION="15.13.0"
CYPRESS_BROWSER="${CYPRESS_BROWSER:-chrome}"

OS=$(uname -s)
if [ x$OS = "xLinux" ]; then
  CYPRESS_HOST=localhost
  NETWORK_MODE=host
  DISPLAY=$DISPLAY
  XHOST_ADDRESS="local:docker"
else
  CYPRESS_HOST=host.docker.internal
  NETWORK_MODE=bridge
  DISPLAY=$LOCAL_ADDRESS:0
  XHOST_ADDRESS=localhost
fi

case "$1" in
  run)
    shift
    docker run -it --rm \
      -u $(id -u ${USER}):$(id -g ${USER}) \
      -v $PWD:/e2e:rw \
      -w /e2e \
      -e CYPRESS_BROWSER \
      -e CYPRESS_HOST \
      -e CYPRESS_SUITE \
      -e CYPRESS_updateSnapshots \
      --net=$NETWORK_MODE \
      "cypress/included:${CYPRESS_VERSION}" \
      --project . \
      --browser ${CYPRESS_BROWSER} \
      --e2e \
      "$@"
    ;;

  open)
    shift
    docker run -it --rm \
      -u $(id -u ${USER}):$(id -g ${USER}) \
      -e DISPLAY=$DISPLAY \
      -v $PWD:/e2e:rw \
      -w /e2e \
      --net=$NETWORK_MODE \
      --entrypoint cypress \
      "cypress/included:${CYPRESS_VERSION}" \
      open \
      --project . \
      --e2e \
      "$@"
    ;;
esac
