import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    PROJECT_NAME: str = "MAPPLE API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "mapple-super-secret-production-grade-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database: SQLite fallback by default for instant zero-dependency running, or Postgres
    DATABASE_URL: str = os.getenv("DATABASE_URL") or f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'mapple.db'))}"
    
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_url(cls, v: Union[str, None]) -> str:
        if not v:
            return f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'mapple.db'))}"
        # Normalize postgres:// to postgresql:// for SQLAlchemy compatibility
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    # CORS
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://localhost:4173",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        cors_env = os.getenv("CORS_ORIGINS") or os.getenv("BACKEND_CORS_ORIGINS")
        if cors_env:
            if isinstance(cors_env, str):
                return [i.strip() for i in cors_env.split(",") if i.strip()]
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v
    
    # Payment Provider
    PAYMENT_PROVIDER: str = "mock"  # "mock" or "razorpay"
    RAZORPAY_KEY_ID: str = "rzp_test_mock_mapple_key"
    RAZORPAY_KEY_SECRET: str = "mock_secret_mapple"
    
    # Default Admin
    ADMIN_EMAIL: str = "admin@mapple.com"
    ADMIN_PASSWORD: str = "MappleAdmin2026!"


settings = Settings()
