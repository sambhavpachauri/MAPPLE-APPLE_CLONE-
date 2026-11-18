from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.session import engine, Base
import app.models  # ensure all models registered
from app.api.v1.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist (SQLite or Postgres)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware with production origins and Vercel domains support
cors_origins = [str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "brand": "MAPPLE",
        "tagline": "Technology. Beautifully Simplified.",
        "version": settings.VERSION,
        "docs": "/docs",
        "api": settings.API_V1_STR,
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "MAPPLE Core API"}
