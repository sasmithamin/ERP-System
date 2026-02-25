from typing import List
from pydantic import BaseSettings


class Settings(BaseSettings):
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    MONGO_URI: str = "mongodb://localhost:27017"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"]

    class Config:
        env_file = ".env"


settings = Settings()
