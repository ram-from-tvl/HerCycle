"""
State management for HerCycle application.
Defines the state model and provides persistence functions.
"""
import json
from typing import TypedDict, Optional, Any
from pathlib import Path

from app.config import DATA_FILE_PATH


class ProfileState(TypedDict, total=False):
    """User profile information"""
    age: Optional[int]
    height_cm: Optional[float]
    weight_kg: Optional[float]
    diet_type: str  # "vegetarian", "vegan", "non-veg", "balanced"
    food_constraints: list[str]  # ["lactose-free", "gluten-free", etc.]
    budget_level: str  # "low", "medium", "high"
    food_access: str  # "mess", "cook", "both"
    region: str  # "north-india", "south-india", etc.
    movement_space: str  # "room", "hostel-ground", "gym"
    activity_background: str  # "beginner", "moderate", "active"
    time_availability: str  # "5-10min", "15-20min", "30min+"
    emotional_comfort_level: str  # "low", "medium", "high"
    preferred_product: str  # "pads", "tampons", "menstrual-cup", "cloth"
    location_lat: Optional[float]
    location_lng: Optional[float]
    allow_location: bool


class HerCycleState(TypedDict, total=False):
    """Main application state"""
    profile: ProfileState
    cycles: list[dict[str, Any]]  # List of cycle records
    patterns: dict[str, Any]  # Computed cycle patterns
    daily_log: Optional[dict[str, Any]]  # Today's check-in data
    
    # Current cycle tracking
    current_cycle: Optional[dict[str, Any]]  # Current cycle info
    # current_cycle contains:
    # - is_on_period: bool
    # - period_start_date: str (if on period)
    # - estimated_cycle_start: str (from ML prediction)
    # - current_day: int (day of current cycle)
    # - estimated_phase: str ("menstrual", "follicular", "ovulatory", "luteal")
    
    agent_outputs: dict[str, Optional[dict[str, Any]]]
    # agent_outputs contains:
    # - cycle_pattern
    # - symptom_insight
    # - nutrition
    # - movement
    # - emotional
    # - sustainability
    # - knowledge_resources
    # - local_access
    # - coordinator
    # - safety
    
    final_plan: Optional[dict[str, Any]]
    local_search_type: Optional[str]  # "products" | "clinics"


# Global state instance (single-user application)
CURRENT_STATE: HerCycleState = {
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
    "current_cycle": None,
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


def get_state() -> HerCycleState:
    """Get the current application state"""
    return CURRENT_STATE


def set_state(state: HerCycleState) -> None:
    """Set the application state"""
    global CURRENT_STATE
    CURRENT_STATE = state


def save_state_to_file(path: str = DATA_FILE_PATH) -> None:
    """Save current state to JSON file"""
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(CURRENT_STATE, f, indent=2, ensure_ascii=False)


def load_state_from_file(path: str = DATA_FILE_PATH) -> None:
    """Load state from JSON file"""
    global CURRENT_STATE
    if Path(path).exists():
        with open(path, 'r', encoding='utf-8') as f:
            loaded_state = json.load(f)
            # Merge with default state to ensure all keys exist
            for key in CURRENT_STATE:
                if key in loaded_state:
                    CURRENT_STATE[key] = loaded_state[key]
