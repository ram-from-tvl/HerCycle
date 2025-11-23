"""
Profile management routes
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.state import get_state, set_state, save_state_to_file

router = APIRouter(prefix="/profile", tags=["profile"])


class ProfileUpdate(BaseModel):
    age: Optional[int] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    diet_type: Optional[str] = None
    food_constraints: Optional[list[str]] = None
    budget_level: Optional[str] = None
    food_access: Optional[str] = None
    region: Optional[str] = None
    movement_space: Optional[str] = None
    activity_background: Optional[str] = None
    time_availability: Optional[str] = None
    emotional_comfort_level: Optional[str] = None
    preferred_product: Optional[str] = None


class LocationUpdate(BaseModel):
    lat: float
    lng: float
    allow_location: bool = True


@router.post("/")
async def update_profile(update: ProfileUpdate):
    """Update user profile"""
    state = get_state()
    
    # Update only provided fields
    for field, value in update.model_dump(exclude_none=True).items():
        state["profile"][field] = value
    
    set_state(state)
    save_state_to_file()
    
    return {
        "message": "Profile updated successfully",
        "profile": state["profile"]
    }


@router.post("/location")
async def update_location(location: LocationUpdate):
    """Update user location for nearby search"""
    state = get_state()
    
    state["profile"]["location_lat"] = location.lat
    state["profile"]["location_lng"] = location.lng
    state["profile"]["allow_location"] = location.allow_location
    
    set_state(state)
    save_state_to_file()
    
    return {
        "message": "Location updated successfully",
        "location": {
            "lat": location.lat,
            "lng": location.lng,
            "enabled": location.allow_location
        }
    }


@router.get("/")
async def get_profile():
    """Get current profile"""
    state = get_state()
    return {"profile": state["profile"]}


@router.delete("/reset")
async def reset_profile():
    """Reset all user data to start fresh"""
    from app.state import CURRENT_STATE
    
    # Reset to default state
    default_state = {
        "profile": {
            "age": None,
            "height_cm": None,
            "weight_kg": None,
            "diet_type": "balanced",
            "food_constraints": [],
            "budget_level": "medium",
            "food_access": "mess",
            "region": "india",
            "movement_space": "room",
            "activity_background": "beginner",
            "time_availability": "5-10min",
            "emotional_comfort_level": "medium",
            "preferred_product": "pads",
            "location_lat": None,
            "location_lng": None,
            "allow_location": False
        },
        "cycles": [],
        "patterns": {},
        "daily_log": None,
        "agent_outputs": {
            "cycle_pattern": None,
            "symptom_insight": None,
            "nutrition": None,
            "movement": None,
            "emotional": None,
            "sustainability": None,
            "knowledge_resources": None,
            "local_access": None,
            "coordinator": None,
            "safety": None
        },
        "final_plan": None,
        "local_search_type": None
    }
    
    set_state(default_state)
    save_state_to_file()
    
    return {
        "message": "All data reset successfully. You can start fresh!",
        "status": "success"
    }
