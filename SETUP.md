# HerCycle Backend Setup Guide

## Project Overview

HerCycle is a menstrual wellness assistant powered by:
- **FastAPI** for HTTP API
- **LangGraph** for multi-agent orchestration
- **Gemini API** for LLM and embeddings
- **Chroma** for local vector store (RAG)
- **Trafilatura** for web scraping
- **Google Places API** for local search

## Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- Google Cloud account (for Gemini and Places APIs)

## Installation Steps

### 1. Clone/Navigate to Project
```bash
cd /home/ramkumar/Desktop/HerCycle
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Linux/Mac
# OR
venv\Scripts\activate  # On Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up API Keys

Create a `.env` file in the project root:
```bash
touch .env
```

Add your API keys to `.env`:
```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL_NAME=gemini-1.5-pro
GEMINI_EMBED_MODEL_NAME=models/text-embedding-004

# Google Places API
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

### 5. How to Get API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API key"
3. Create a new API key or use an existing one
4. Copy the key and paste it in `.env` as `GEMINI_API_KEY`

#### Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Places API** (new):
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API (New)"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the key and paste it in `.env` as `GOOGLE_PLACES_API_KEY`
5. (Optional) Restrict the key:
   - Click on the key you just created
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API (New)"

### 6. Run Web Scraper (First Time Setup)

Run the scraper to populate the knowledge base:
```bash
python -m app.scraper.scrape_sources
```

This will fetch articles from URLs in `app/knowledge/resources_seed.json` and save cleaned content to `app/knowledge/scraped_resources.json`.

### 7. Start the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# OR run directly
python app/main.py
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Profile
- `POST /profile/` - Update user profile
- `POST /profile/location` - Update location
- `GET /profile/` - Get current profile

### Cycles
- `POST /cycles/log` - Log a menstrual cycle
- `GET /cycles/` - Get cycle history
- `GET /cycles/patterns` - Get computed patterns

### Check-in
- `POST /checkin/` - Submit daily check-in
- `GET /checkin/` - Get today's check-in

### Plan
- `POST /plan/today` - Generate today's personalized plan (runs full agent workflow)
- `GET /plan/latest` - Get most recent plan

### Support
- `POST /support/nearby` - Search nearby shops/clinics
- `GET /support/resources` - Get educational resources

## Testing

Run tests:
```bash
# Install pytest if not already installed
pip install pytest

# Run all tests
pytest app/tests/ -v

# Run specific test file
pytest app/tests/test_safety.py -v
```

## Troubleshooting

### Import Errors
Make sure you're in the virtual environment:
```bash
source venv/bin/activate  # Linux/Mac
```

### ML Model Not Found
The ML model file `final_trained_cycle_model.pkl` should be in the project root. It's already there in your project.

### Vector Store Issues
Delete and reinitialize:
```bash
rm -rf data/vector_store
# Restart the server - it will reinitialize
```

### API Key Errors
Check that your `.env` file is in the project root and keys are correct:
```bash
cat .env
```

## Project Structure
```
HerCycle/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Configuration
│   ├── state.py             # State management
│   ├── llm_client.py        # Gemini client
│   ├── ml_cycle_predictor.py  # ML model wrapper
│   ├── agents/              # LangGraph agents
│   │   ├── graph.py         # Graph orchestration
│   │   ├── cycle_pattern_agent.py
│   │   ├── symptom_insight_agent.py
│   │   ├── nutrition_agent.py
│   │   ├── movement_agent.py
│   │   ├── emotional_agent.py
│   │   ├── sustainability_agent.py
│   │   ├── knowledge_resource_agent.py
│   │   ├── local_access_agent.py
│   │   ├── coordinator_agent.py
│   │   └── safety_agent.py
│   ├── rag/                 # RAG system
│   │   ├── vector_store.py
│   │   └── corpus_loader.py
│   ├── scraper/             # Web scraper
│   │   └── scrape_sources.py
│   ├── routers/             # FastAPI routes
│   │   ├── profile_routes.py
│   │   ├── cycle_routes.py
│   │   ├── checkin_routes.py
│   │   ├── plan_routes.py
│   │   └── support_routes.py
│   ├── knowledge/           # Knowledge base
│   │   ├── rag_corpus/      # Markdown files
│   │   ├── foods.json
│   │   ├── movement_blocks.json
│   │   ├── sustainability.json
│   │   ├── resources_seed.json
│   │   └── scraped_resources.json
│   └── tests/               # Test files
│       ├── test_safety.py
│       └── test_cycle_pattern.py
├── data/                    # Runtime data
│   ├── user_state.json      # User state persistence
│   └── vector_store/        # Chroma database
├── final_trained_cycle_model.pkl  # ML model
├── requirements.txt
└── README.md
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up API keys in `.env`
3. ✅ Run the scraper once
4. ✅ Start the server
5. ✅ Test endpoints using http://localhost:8000/docs
6. ✅ Create a profile via `POST /profile/`
7. ✅ Log some cycles via `POST /cycles/log`
8. ✅ Do a daily check-in via `POST /checkin/`
9. ✅ Generate a plan via `POST /plan/today`

## Notes

- This is a **single-user** application - all data is stored locally in JSON files
- The RAG vector store is initialized on startup
- All agents run in a fixed sequence (defined in `graph.py`)
- The Safety Agent runs last to validate all outputs
- Gemini is used for all LLM operations (chat and embeddings)

## Support

If you encounter issues:
1. Check the terminal output for errors
2. Verify API keys are correct in `.env`
3. Check that all dependencies installed correctly
4. Make sure Python 3.10+ is being used
5. Review the logs in the terminal

Good luck with your project, Ram! 🚀
