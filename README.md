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

On Windows PowerShell, use:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/run-tests.ps1
```

Both helper scripts return the Playwright test exit code and clean up the
Compose containers and network after the run.

The generated HTML report is saved in `playwright-report/`.

## Configure the test environment

Compose uses sensible defaults, so no configuration file is required. To
practice environment-based configuration, create a local `.env` file from the
included example:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Available values:

| Variable | Default | Purpose |
| --- | --- | --- |
| `API_PORT` | `3000` | Internal API port used by the service and tests |
| `SERVICE_NAME` | `demo-api` | Service name returned by the health endpoint |

For example:

```dotenv
API_PORT=3100
SERVICE_NAME=qa-lab-api
```

The `.env` file is ignored by Git and excluded from the Docker build context.

## Debug the API container

The normal test workflow keeps the API inside the Compose network. When you
want to inspect it from the host machine, add the debug override:

```bash
docker compose -f compose.yaml -f compose.debug.yaml up --build api
```

Then check the health endpoint from another terminal:

```bash
curl http://127.0.0.1:3000/health
```

PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/health
```

If you changed `API_PORT` in `.env`, use that port in the URL. Clean up after
manual checks with:

```bash
docker compose -f compose.yaml -f compose.debug.yaml down --remove-orphans
```

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
|-- .env.example
|-- api/
|   |-- Dockerfile
|   `-- server.js
|-- scripts/
|   |-- run-tests.ps1
|   `-- run-tests.sh
|-- tests/
|   `-- api.spec.js
|-- compose.yaml
|-- compose.debug.yaml
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
