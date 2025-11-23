# HerCycle - Your Gentle Wellness Companion

HerCycle is your holistic wellness companion for menstrual cycle tracking with AI-powered personalized plans for nutrition, movement, and emotional support.

## Setup & Run

### Backend Setup
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m app.main
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Quick Start
```bash
# Run both backend and frontend
./start.sh
```

The backend will run on `http://localhost:8000` and frontend on `http://localhost:8080`.

## Features

- **Cycle Tracking**: ML-powered cycle prediction and phase detection
- **AI Agents**: 8 specialized agents for nutrition, movement, emotional support, and more
- **Personalized Plans**: Daily wellness plans adapted to your cycle phase
- **Safety & Sustainability**: Context-aware recommendations for your lifestyle

## Tech Stack

- **Backend**: FastAPI, Python, Scikit-learn, LangChain
- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **AI**: Google Gemini API, SHAP explanations