from pydantic import BaseSettings

class Settings(BaseSettings):
    JWT_SECRET: str
    JWT_ALGORITHM: str
    MONGO_URI: str

    class Config:
        env_file = ".env"

settings = Settings()
