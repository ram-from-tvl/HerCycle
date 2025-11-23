"""
Configuration settings for HerCycle application.
All settings are read from environment variables.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "data"
KNOWLEDGE_DIR = BASE_DIR / "app" / "knowledge"
VECTOR_STORE_DIR = DATA_DIR / "vector_store"

# Gemini API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash")
GEMINI_EMBED_MODEL_NAME = os.getenv("GEMINI_EMBED_MODEL_NAME", "models/text-embedding-004")

# Google Places API
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY", "")

# Data file paths
DATA_FILE_PATH = str(DATA_DIR / "user_state.json")
VECTOR_STORE_PATH = str(VECTOR_STORE_DIR)
RAG_CORPUS_PATH = str(KNOWLEDGE_DIR / "rag_corpus")
SCRAPED_RESOURCES_PATH = str(KNOWLEDGE_DIR / "scraped_resources.json")
RESOURCES_SEED_PATH = str(KNOWLEDGE_DIR / "resources_seed.json")

# ML Model path
ML_MODEL_PATH = str(BASE_DIR / "final_trained_cycle_model.pkl")

# Ensure directories exist
DATA_DIR.mkdir(exist_ok=True)
VECTOR_STORE_DIR.mkdir(parents=True, exist_ok=True)
(KNOWLEDGE_DIR / "rag_corpus").mkdir(parents=True, exist_ok=True)
