# Recipe Library — interview pair-programming material

A small full-stack recipe library used as material for a 55-minute pair-programming interview. Browse recipes, ingredients, and tags; create and edit recipes. Two seeded bugs are documented in `tickets/`.

## Prerequisites

### Docker path
- Docker Desktop or Docker Engine with Compose v2 (`docker compose` command).

### Native path
- Python 3.12 — install via [uv](https://docs.astral.sh/uv/) or your platform's package manager.
- [`uv`](https://docs.astral.sh/uv/getting-started/installation/) (Python dependency manager).
- Node.js 20+ and npm.

## Quick start (Docker)

```bash
docker compose up --build
```

First run builds both images and seeds the database. On subsequent runs the seed is a no-op (idempotent). Once both services are healthy:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000 (API at `/api/...`)

To reset the database to its seeded state, drop the volumes:

```bash
docker compose down -v
docker compose up --build
```

## Quick start (native)

In two separate terminals:

**Backend:**
```bash
cd backend
uv sync
uv run python seed.py             # idempotent; safe to re-run
uv run uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies `/api/*` to `http://localhost:8000`, so no extra config is needed in native mode.

## How to run

| Service  | URL                       | Default port |
|----------|---------------------------|--------------|
| Frontend | http://localhost:5173     | 5173         |
| Backend  | http://localhost:8000     | 8000         |
| Health   | http://localhost:8000/api/health | — |

## File structure

```
/
├── README.md
├── docker-compose.yml
├── backend/
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── Dockerfile
│   ├── app/
│   │   ├── main.py            # FastAPI app
│   │   ├── db.py              # SQLAlchemy engine/session
│   │   ├── models.py          # Recipe / Ingredient / Tag + joins
│   │   ├── schemas.py         # Pydantic schemas
│   │   └── routers/           # endpoints split per resource
│   └── seed.py                # deterministic, idempotent seed
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── src/
│       ├── routes/            # one file per page
│       ├── components/        # nav, tag filter, pagination, shadcn ui
│       └── lib/               # api client, types, filter store
└── tickets/
    ├── TICKET-001.md
    └── TICKET-002.md
```

## Tickets

The interview material is in `tickets/`. Each ticket is written from a user's perspective; the candidate is expected to reproduce, diagnose, and propose a fix.

## Troubleshooting

- **Port conflicts (5173 / 8000):** stop any existing processes (`lsof -i:5173`, `lsof -i:8000`) or change the host port in `docker-compose.yml`.
- **Stale dependencies in Docker:** `docker compose down -v && docker compose up --build`. The named volumes for `node_modules` and the Python venv survive `down` without `-v`.
- **Database in a weird state:** `docker compose down -v` (Docker) or `rm backend/data/recipes.db && cd backend && uv run python seed.py` (native).
- **Frontend can't reach backend in Docker:** check that the `frontend` service has `VITE_API_URL=http://backend:8000` set; the `backend` service must be on the same Compose network (default).
- **`uv` not found:** install per https://docs.astral.sh/uv/getting-started/installation/ — `curl -LsSf https://astral.sh/uv/install.sh | sh` works on macOS/Linux.
