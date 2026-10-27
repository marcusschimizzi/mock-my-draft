# Text Analysis Service

FastAPI service for sentiment analysis and word counting of draft evaluation text.

## Prerequisites

- [uv](https://docs.astral.sh/uv/getting-started/installation/)

uv will automatically download Python 3.12, matching `.python-version` and both Docker images.

Python 3.9 and 3.10 environments must be recreated with `uv sync --locked`. The security update also upgrades FastAPI/Starlette and pytest plus its reporting plugins; the HTTP endpoints and JSON responses are unchanged. Python CI now runs lint, tests, packaging, and a lockfile vulnerability audit separately from the JavaScript jobs.

## Setup

```bash
cd apps/text-analysis-service
uv sync
```

## Running

```bash
uv run uvicorn app.main:app --reload
```

Or from the repo root:

```bash
npx turbo run dev --filter=@mmd/text-analysis-service
```

The service runs on port 3000 by default. Set the `PORT` env var to change it.

## Environment Variables

The service uses Postgres for text analysis data. Set these in a `.env` file or your environment:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `POSTGRES_USER` | `user` | Database user |
| `POSTGRES_PASSWORD` | `password` | Database password |
| `POSTGRES_SERVER` | `localhost` | Database host |
| `POSTGRES_PORT` | `5432` | Database port |
| `POSTGRES_DB` | `textanalysis` | Database name |

## Tests

```bash
uv run pytest tests/
```

## Endpoints

- `GET /` — Welcome message
- `GET /health` — Health check
- `POST /analyze/sentiment` — Analyze text sentiment
- `POST /wordcount` — Count words with optional sentiment filtering
