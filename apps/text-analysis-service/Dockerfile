FROM python:3.9-slim-bookworm AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.7.21 /uv /uvx /bin/

ENV UV_PROJECT_ENVIRONMENT=/opt/venv

COPY /apps/text-analysis-service/pyproject.toml /apps/text-analysis-service/uv.lock ./

RUN uv sync --locked --no-dev --no-install-project --python /usr/local/bin/python

FROM python:3.9-slim-bookworm AS runner

WORKDIR /app

# Copy the installed dependencies from the builder image
COPY --from=builder /opt/venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"

COPY /apps/text-analysis-service/ .

ENV PORT=8000
EXPOSE ${PORT}

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
