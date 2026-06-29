#!/usr/bin/env sh

set -eu

docker compose -f compose.yaml config --quiet
docker compose -f compose.yaml -f compose.debug.yaml config --quiet

printf '%s\n' 'Compose configuration is valid.'
