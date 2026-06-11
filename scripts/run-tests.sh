#!/usr/bin/env sh

set -eu

cleanup() {
  docker compose down --remove-orphans
}

trap cleanup EXIT

docker compose up --build --abort-on-container-exit --exit-code-from tests
