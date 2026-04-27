from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.db import Base, engine
from app import models  # noqa: F401  ensure models register on Base


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="Recipe API", lifespan=lifespan)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
