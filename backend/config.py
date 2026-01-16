import os
from dotenv import load_dotenv


load_dotenv()

class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    MONGO_URL = os.getenv("MONGO_URL")   
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    API_TIMEOUT = int(os.getenv("API_TIMEOUT", "30"))

