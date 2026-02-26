# Text Analysis Service

FastAPI service for sentiment analysis and word counting of draft evaluation text.

## Prerequisites

- Python 3.9-3.10
- [Poetry](https://python-poetry.org/docs/#installation)

## Setup

```bash
cd apps/text-analysis-service
poetry install
```

## Running

```bash
poetry run uvicorn app.main:app --reload
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
poetry run pytest tests/
```

## Endpoints

- `GET /` — Welcome message
- `GET /health` — Health check
- `POST /analyze/sentiment` — Analyze text sentiment
- `POST /wordcount` — Count words with optional sentiment filtering
