# 🌸 HerCycle - AI-Powered Menstrual Wellness Assistant

**Your personal wellness clinic powered by 9 AI specialists** 🤖

A full-stack application providing personalized menstrual wellness guidance through intelligent multi-agent orchestration, machine learning predictions, and research-grounded recommendations.

**🚀 One-Command Startup:** `./start.sh`

---

## ✨ **What Makes HerCycle Special**

### **🤖 9 AI Specialists Working as a Team**
Not just one generic AI - you get a team of specialized agents:
- 🔮 **Cycle Forecaster** - ML predictions with SHAP explanations
- 🔍 **Pattern Detective** - Discovers symptom correlations
- 🥗 **Nutrition Expert** - Personalized meal plans (150+ foods)
- 🧘‍♀️ **Movement Coach** - Safe, tailored exercises (50+ workouts)
- 💙 **Emotional Support** - Evidence-based coping strategies
- ♻️ **Sustainability Advisor** - Product cost & environmental analysis
- 📚 **Research Librarian** - Curates relevant health articles
- 🎯 **Care Coordinator** - Synthesizes all insights
- 🛡️ **Safety Guardian** - Validates medical safety

### **🔬 Advanced AI Technologies**
- **LangGraph Orchestration** - Sequential agent workflow
- **RAG (Retrieval-Augmented Generation)** - Grounded in 100+ medical articles
- **Machine Learning** - Random Forest cycle predictions
- **SHAP Explainability** - Shows WHY predictions work
- **Semantic Search** - Chroma vector database for knowledge retrieval
- **Google Gemini 2.5 Flash** - Powers conversational AI

### **🎯 Truly Personalized**
Every recommendation considers:
- Your dietary preferences (vegetarian/vegan/etc.)
- Food constraints (allergies, intolerances)
- Available space (room/gym/outdoors)
- Fitness level (beginner/advanced)
- Budget (low/medium/high)
- Regional preferences (South Indian, North Indian, etc.)
- Time availability (5-10min / 30min+)
- Current cycle phase & symptoms

---

## 🚀 **Super Quick Start**

### **Option 1: Automatic (Recommended)**

```bash
# Clone or navigate to project
cd HerCycle

# Run the startup script (Linux/Mac)
./start.sh

# Or for Windows
start.bat
```

**That's it!** Both frontend and backend start automatically. 🎉

### **Option 2: Manual**

**Terminal 1 (Backend):**
```bash
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### **Access the Application:**
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🏗️ **Architecture**

### **Tech Stack**
```
Frontend:  React + TypeScript + Vite + Shadcn/UI
Backend:   FastAPI + Python 3.12
AI:        LangGraph + Google Gemini 2.5 Flash
ML:        Scikit-learn (Random Forest) + SHAP
RAG:       LangChain + Chroma Vector Store
APIs:      Google Places API (nearby search)
```

### **Agent Workflow**
```
User Requests Daily Plan
         ↓
┌─────────────────────────────────────┐
│   LangGraph Sequential Workflow    │
├─────────────────────────────────────┤
│ 1. Cycle Pattern Agent (ML+SHAP)   │
│ 2. Symptom Insight Agent            │
│ 3. Nutrition Agent (RAG)            │
│ 4. Movement Agent                   │
│ 5. Emotional Agent (RAG)            │
│ 6. Sustainability Agent             │
│ 7. Knowledge Resource Agent (RAG)   │
│ 8. Coordinator Agent                │
│ 9. Safety Agent (Validation)        │
└─────────────────────────────────────┘
         ↓
  Personalized Plan (JSON)
         ↓
  Frontend Displays Results
```

**Processing Time:** 30-60 seconds for complete analysis

---

## � **Project Structure**

```
HerCycle/
├── app/                        # Backend (FastAPI)
│   ├── main.py                # Main app + CORS + routes
│   ├── config.py              # Environment variables
│   ├── state.py               # User state management
│   ├── llm_client.py          # Gemini API wrapper
│   ├── ml_cycle_predictor.py # ML model wrapper
│   ├── agents/                # 9 AI agents + LangGraph
│   │   ├── cycle_pattern_agent.py
│   │   ├── symptom_insight_agent.py
│   │   ├── nutrition_agent.py
│   │   ├── movement_agent.py
│   │   ├── emotional_agent.py
│   │   ├── sustainability_agent.py
│   │   ├── knowledge_resource_agent.py
│   │   ├── coordinator_agent.py
│   │   ├── safety_agent.py
│   │   └── graph.py           # LangGraph orchestration
│   ├── routers/               # API endpoints
│   │   ├── profile_routes.py
│   │   ├── cycle_routes.py
│   │   ├── checkin_routes.py
│   │   ├── plan_routes.py
│   │   └── support_routes.py
│   ├── rag/                   # Vector store & RAG
│   │   ├── vector_store.py
│   │   └── corpus_loader.py
│   ├── knowledge/             # Knowledge base
│   │   ├── foods.json         # 150+ food database
│   │   ├── movement_blocks.json # 50+ exercises
│   │   ├── sustainability.json
│   │   ├── resources_seed.json
│   │   └── rag_corpus/        # Medical articles
│   └── scraper/               # Web scraping
│       └── scrape_sources.py
├── frontend/                  # React + TypeScript
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # UI components
│   │   ├── lib/
│   │   │   └── api.ts        # API client
│   │   └── hooks/
│   ├── package.json
│   └── vite.config.ts
├── data/                      # User data & vector store
│   ├── user_state.json
│   └── vector_store/          # Chroma DB
├── .env                       # API keys (CREATE THIS!)
├── requirements.txt           # Python dependencies
├── start.sh                   # Startup script (Linux/Mac)
├── start.bat                  # Startup script (Windows)
├── test_connections.sh        # Connection test script
├── API_DOCUMENTATION.md       # Complete API reference
├── AGENTS_EXPLAINED.md        # AI agents deep dive
├── AGENTS_FOR_FRONTEND.md     # User-facing agent info
├── AGENT_UI_COMPONENTS.md     # UI component templates
├── QUICK_START.md             # Quick start guide
├── SETUP.md                   # Detailed setup
└── TEST_COMMANDS.md           # API test commands
```

Visit http://localhost:8000/docs for interactive API documentation.

## 📚 Tech Stack

- **Framework**: FastAPI
- **Orchestration**: LangGraph (StateGraph)
- **LLM**: Google Gemini (via langchain-google-genai)
- **Embeddings**: Gemini text-embedding-004
- **Vector DB**: Chroma (local, persistent)
- **Web Scraping**: Trafilatura
- **ML**: scikit-learn, SHAP
- **Local Search**: Google Places API

## 🎯 Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/profile/` | POST | Update user profile |
| `/cycles/log` | POST | Log menstrual cycle |
| `/checkin/` | POST | Daily check-in |
| `/plan/today` | POST | Generate AI plan |
| `/support/nearby` | POST | Find local resources |

## 🧪 Testing

```bash
pytest app/tests/ -v
```

## 📖 Documentation

- [Setup Guide](SETUP.md) - Complete installation and API key setup
- [API Docs](http://localhost:8000/docs) - Interactive Swagger UI (when running)

## 🔒 Privacy & Safety

- **Single-user**: All data stored locally in JSON files
- **No cloud storage**: Vector store persists to local disk
- **Safety Agent**: Validates all outputs, removes medical advice
- **Predictions as estimates**: Never guarantees, always probabilities

## 🤝 Agent Collaboration

Agents communicate via `agent_message_for_others` fields:

```
Cycle Agent: "I estimate period in 3-4 days"
    ↓
Symptom Agent: "Poor sleep worsens cramps"
    ↓
Movement Agent: "Given poor sleep warning, keeping intensity low"
    ↓
Coordinator: "Because Symptom Agent warned... I chose..."
```

## 📁 Project Structure

```
HerCycle/
├── app/
│   ├── agents/          # 10 LangGraph agent nodes
│   ├── rag/             # Gemini + Chroma RAG system
│   ├── routers/         # FastAPI route handlers
│   ├── knowledge/       # JSON DBs + scraped articles
│   └── scraper/         # Trafilatura web scraper
├── data/                # User state + vector store
├── requirements.txt
└── SETUP.md
```

## 🌍 Environment Variables

Create `.env` file:
```env
GEMINI_API_KEY=your_key_here
GOOGLE_PLACES_API_KEY=your_key_here
```

## 🎓 Knowledge Base

- **RAG Corpus**: Markdown files in `app/knowledge/rag_corpus/`
- **Scraped Articles**: URLs from `resources_seed.json` → cleaned content
- **Structured Data**: foods.json, movement_blocks.json, sustainability.json

## 💡 Future Enhancements

- [ ] Multi-user support with authentication
- [ ] Frontend React/Vue app
- [ ] More ML models (symptom prediction)
- [ ] Export data to PDF reports
- [ ] Integration with health devices

## 📄 License

Private project - All rights reserved.

## 👤 Author

Ramkumar - HerCycle Backend

---

**Note**: This is a single-user prototype. For production use, add authentication, database, and deploy with proper security measures.

---

## 🔑 **Setup Requirements**

### **1. API Keys (Required)**

Create a `.env` file in the root directory:

```bash
# Google Gemini API (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL_NAME=gemini-2.5-flash

# Google Places API (Optional - for nearby search)
GOOGLE_PLACES_API_KEY=your_places_api_key_here
```

**Get API Keys:**
- **Gemini API:** https://aistudio.google.com/apikey
- **Places API:** https://console.cloud.google.com/apis/credentials

---

## ✅ **Test Everything Works**

```bash
# Run automated connection tests
./test_connections.sh
```

See **QUICK_START.md** and **TEST_COMMANDS.md** for more details.

---

## 📚 **Documentation**

| File | Purpose |
|------|---------|
| **QUICK_START.md** | Fast setup guide |
| **API_DOCUMENTATION.md** | Complete API reference |
| **AGENTS_EXPLAINED.md** | Deep dive into AI agents |
| **AGENTS_FOR_FRONTEND.md** | User-facing agent info |
| **AGENT_UI_COMPONENTS.md** | UI component templates |
| **TEST_COMMANDS.md** | API test examples |

---

## 🚀 **Main Feature: AI Plan Generation**

**Endpoint:** `POST /plan/today`

**Processing Time:** 30-60 seconds

**What It Does:** Runs 9 specialized AI agents to generate a comprehensive personalized wellness plan including:
- 🔮 Cycle predictions (ML + SHAP)
- 🥗 Nutrition recommendations (RAG + filters)
- 🧘‍♀️ Movement plans (safety-validated)
- 💙 Emotional support (evidence-based)
- ♻️ Sustainability insights
- 📚 Curated resources

See **AGENTS_EXPLAINED.md** for technical details.

---

## 🎯 **Tech Stack Summary**

- **Backend:** FastAPI + Python 3.12 + LangGraph
- **Frontend:** React + TypeScript + Vite + Shadcn/UI
- **AI:** Google Gemini 2.5 Flash + LangChain
- **ML:** Scikit-learn + SHAP
- **RAG:** Chroma Vector Store + Embeddings
- **APIs:** Google Places API

---

## 🐛 **Troubleshooting**

See **QUICK_START.md** for comprehensive troubleshooting guide.

**Quick fixes:**
```bash
# Port issues
lsof -i :8000 && kill -9 <PID>

# Dependencies
pip install -r requirements.txt
cd frontend && npm install

# API keys
cat .env  # Verify they exist
```

---

## �� **Support & Contributing**

- **Issues:** Open a GitHub issue
- **Documentation:** See markdown files in root
- **API Reference:** `/docs` endpoint
- **Contributing:** Fork, branch, PR welcome!

---

**Built with ❤️ for menstrual wellness** 🌸

*Powered by 9 AI Specialists working as a team* 🤖✨

