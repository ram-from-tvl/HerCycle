# HerCycle - Your Gentle Wellness Companion

HerCycle is your holistic wellness companion for menstrual cycle tracking with AI-powered personalized plans for nutrition, movement, and emotional support.

<img width="1920" height="1080" alt="hercycle1" src="https://github.com/user-attachments/assets/7a126d1f-84bb-4af0-9e69-98ec5625b465" />

<img width="1920" height="1080" alt="hercycle2" src="https://github.com/user-attachments/assets/97617d9f-bc2d-4d99-a5d7-d023394690ca" />

<img width="1920" height="1080" alt="hercycle3" src="https://github.com/user-attachments/assets/9d5cb754-f089-4a49-bd10-59df77196cc2" />

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
