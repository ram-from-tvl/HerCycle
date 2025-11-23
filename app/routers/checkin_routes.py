"""
Daily check-in routes
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.state import get_state, set_state, save_state_to_file

router = APIRouter(prefix="/checkin", tags=["checkin"])


class CheckIn(BaseModel):
    pain: int  # 0-10
    energy: int  # 0-10
    mood: str  # "good", "neutral", "bad"
    stress: int  # 1-5
    sleep_hours: float
    notes: Optional[str] = ""  # Changed from journal to notes
    symptoms: Optional[list[str]] = []  # ["cramps", "headache", "bloating", etc.]


@router.post("/")
async def daily_checkin(checkin: CheckIn):
    """Submit daily check-in"""
    state = get_state()
    
    # Store today's log
    state["daily_log"] = checkin.model_dump()
    
    set_state(state)
    save_state_to_file()
    
    return {
        "message": "Check-in recorded successfully",
        "checkin": state["daily_log"]
    }


@router.get("/")
async def get_today_checkin():
    """Get today's check-in"""
    state = get_state()
    return {
        "checkin": state.get("daily_log"),
        "exists": state.get("daily_log") is not None
    }
