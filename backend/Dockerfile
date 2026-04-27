FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_PROJECT_ENVIRONMENT=/opt/venv

# Install uv
COPY --from=ghcr.io/astral-sh/uv:0.5.4 /uv /usr/local/bin/uv

WORKDIR /app

# Install deps separately for caching
COPY pyproject.toml uv.lock /app/
RUN uv sync --frozen --no-install-project

COPY . /app

EXPOSE 8000

CMD ["sh", "-c", "uv run python seed.py && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
