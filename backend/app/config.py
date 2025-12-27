from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Google Gemini (FREE!)
    gemini_api_key: str = os.getenv("GEMINI_API_KEY")
    
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
        env_file_encoding = "utf-8"
        case_sensitive = False


settings = Settings()
