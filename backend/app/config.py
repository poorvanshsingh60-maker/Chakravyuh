from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Chakravyuh - Interview Scheduling Engine"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    MONGODB_URI: str = "mongodb://localhost:27017/chakravyuh"
    DB_NAME: str = "chakravyuh"
    
    # Security
    JWT_SECRET: str = "chakravyuh-super-secure-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Solver Defaults
    SOLVER_TIMEOUT_SECONDS: int = 30
    WORKLOAD_BALANCE_WEIGHT: int = 10
    MINIMIZE_IDLE_GAP_WEIGHT: int = 5
    PREFERRED_SLOT_WEIGHT: int = 2
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
