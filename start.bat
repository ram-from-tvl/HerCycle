@echo off
REM HerCycle - Start Both Frontend and Backend (Windows)
REM This script starts the FastAPI backend and Vite frontend concurrently

echo ╔════════════════════════════════════════════╗
echo ║        🌸 HerCycle Startup Script 🌸      ║
echo ╔════════════════════════════════════════════╗
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo ❌ Virtual environment not found!
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installing Python dependencies...
    pip install -r requirements.txt
) else (
    echo ✓ Virtual environment found
    call venv\Scripts\activate.bat
)

REM Check if .env exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo Please create .env with your API keys
    exit /b 1
) else (
    echo ✓ .env file found
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules\" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
) else (
    echo ✓ Frontend dependencies found
)

echo.
echo ════════════════════════════════════════════
echo 🚀 Starting HerCycle Application...
echo ════════════════════════════════════════════
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:8080
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend in a new window
start "HerCycle Backend" cmd /k "venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
start "HerCycle Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✓ Both servers started in separate windows
echo Close the terminal windows to stop the servers
echo.
pause
