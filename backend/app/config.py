from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Google Gemini (FREE!)
    gemini_api_key: str = ""
    
    # Firebase
    firebase_project_id: str = ""
    firebase_private_key: str = ""
    firebase_client_email: str = ""
    
    # App settings
    cors_origins: List[str] = ["http://localhost:8081", "exp://localhost:8081", "*"]
    
    # Rate limiting
    free_daily_limit: int = 20
    premium_daily_limit: int = 1000
    
    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
