"""
HerCycle FastAPI Application
Main entry point for the backend API.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.state import load_state_from_file, save_state_to_file
from app.rag.vector_store import init_vector_store
from app.config import RAG_CORPUS_PATH, SCRAPED_RESOURCES_PATH, VECTOR_STORE_PATH

# Import routers
from app.routers import profile_routes, cycle_routes, checkin_routes, plan_routes, support_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager - handles startup and shutdown.
    """
    # Startup
    print("Starting HerCycle backend...")
    
    # Load user state from file
    try:
        load_state_from_file()
        print("✓ User state loaded")
    except Exception as e:
        print(f"Warning: Could not load state: {e}")
    
    # Initialize vector store
    try:
        init_vector_store(
            corpus_dir=RAG_CORPUS_PATH,
            scraped_json=SCRAPED_RESOURCES_PATH,
            persist_dir=VECTOR_STORE_PATH
        )
        print("✓ Vector store initialized")
    except Exception as e:
        print(f"Warning: Vector store initialization failed: {e}")
    
    print("✓ HerCycle backend ready!")
    
    yield
    
    # Shutdown
    print("Shutting down HerCycle backend...")
    try:
        save_state_to_file()
        print("✓ User state saved")
    except Exception as e:
        print(f"Warning: Could not save state: {e}")


# Create FastAPI app
app = FastAPI(
    title="HerCycle API",
    description="Backend API for HerCycle - Menstrual Wellness Assistant",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(profile_routes.router)
app.include_router(cycle_routes.router)
app.include_router(checkin_routes.router)
app.include_router(plan_routes.router)
app.include_router(support_routes.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "HerCycle API is running",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    from app.config import GEMINI_API_KEY, GOOGLE_PLACES_API_KEY
    
    return {
        "status": "healthy",
        "services": {
            "gemini_api": "configured" if GEMINI_API_KEY else "not_configured",
            "places_api": "configured" if GOOGLE_PLACES_API_KEY else "not_configured",
            "vector_store": "initialized",
            "state_persistence": "enabled"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
