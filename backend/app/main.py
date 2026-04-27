from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.db import Base, engine
from app import models  # noqa: F401
from app.routers import ingredients, tags


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="Recipe API", lifespan=lifespan)
app.include_router(tags.router)
app.include_router(ingredients.router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
