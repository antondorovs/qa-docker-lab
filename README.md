# QA Docker Lab

A practical Docker lab for running automated QA checks in isolated
containers.

The first example starts:

- a small Node.js API container;
- a Playwright test container;
- three API checks against the service over the Compose network.

## Prerequisites

- Docker Desktop, or Docker Engine with Docker Compose;
- Git Bash, WSL, or another POSIX shell to use the helper script.

Node.js is only required when running the tests without Docker.

## Run with Docker Compose

Build the images and run the complete test workflow:

```bash
docker compose up --build --abort-on-container-exit --exit-code-from tests
```

Clean up the containers and network:

```bash
docker compose down --remove-orphans
```

On Linux, macOS, Git Bash, or WSL, both commands can be run with:

```bash
sh scripts/run-tests.sh
```

The generated HTML report is saved in `playwright-report/`.

## Run tests locally

Start the API:

```bash
node api/server.js
```

In another terminal, install dependencies and run the tests:

```bash
npm ci
npm test
```

The local tests use `http://127.0.0.1:3000` by default. Override it when
needed:

```bash
BASE_URL=http://example.test npm test
```

PowerShell:

```powershell
$env:BASE_URL = "http://example.test"
npm test
```

## Project structure

```text
.
|-- api/
|   |-- Dockerfile
|   `-- server.js
|-- scripts/
|   `-- run-tests.sh
|-- tests/
|   `-- api.spec.js
|-- compose.yaml
|-- Dockerfile
|-- package.json
`-- playwright.config.js
```

## Useful commands

Rebuild only the test image:

```bash
docker compose build tests
```

Run the tests again while the API container is already running:

```bash
docker compose run --rm tests
```

View service logs:

```bash
docker compose logs api
```
