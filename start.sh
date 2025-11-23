#!/bin/bash

# HerCycle - Start Both Frontend and Backend
# This script starts the FastAPI backend and Vite frontend concurrently

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🌸 HerCycle Startup Script 🌸      ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${RED}❌ Virtual environment not found!${NC}"
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
    source venv/bin/activate
    echo -e "${YELLOW}Installing Python dependencies...${NC}"
    pip install -r requirements.txt
else
    echo -e "${GREEN}✓ Virtual environment found${NC}"
    source venv/bin/activate
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env with your API keys${NC}"
    exit 1
else
    echo -e "${GREEN}✓ .env file found${NC}"
fi

# Check if frontend node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
else
    echo -e "${GREEN}✓ Frontend dependencies found${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 Starting HerCycle Application...${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Backend:${NC}  http://localhost:8000"
echo -e "${GREEN}Frontend:${NC} http://localhost:8080"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Cleanup function to kill all child processes
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $(jobs -p) 2>/dev/null
    echo -e "${GREEN}✓ Servers stopped${NC}"
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${BLUE}[Backend]${NC} Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend
echo -e "${BLUE}[Frontend]${NC} Starting Vite dev server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for both processes
wait
