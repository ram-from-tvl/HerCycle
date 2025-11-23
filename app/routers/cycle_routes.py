"""
Cycle tracking routes
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import date, datetime, timedelta
from typing import Optional

from app.state import get_state, set_state, save_state_to_file

router = APIRouter(prefix="/cycles", tags=["cycles"])


class CycleTracking(BaseModel):
    is_on_period: bool
    period_start_date: Optional[str] = None  # ISO format if on period
    days_since_last_period: Optional[int] = None  # If not on period


class CycleLog(BaseModel):
    start_date: str  # ISO format: "YYYY-MM-DD"
    period_length: int  # days
    flow_intensity: Optional[str] = "medium"  # light, medium, heavy
    notes: Optional[str] = ""


@router.post("/set-current")
async def set_current_cycle(tracking: CycleTracking):
    """Set current cycle tracking information"""
    state = get_state()
    
    current_cycle = {
        "is_on_period": tracking.is_on_period,
        "last_updated": datetime.now().isoformat()
    }
    
    if tracking.is_on_period and tracking.period_start_date:
        # User is currently on period
        try:
            period_start = datetime.fromisoformat(tracking.period_start_date)
            # Calculate days since provided start date
            days_diff = (datetime.now() - period_start).days + 1

            # If the provided date is very old (e.g. > 60 days), map it into the current
            # 28-day cycle using modulo arithmetic rather than returning a huge day count
            if days_diff > 60:
                # Map into 1..28 range
                wrapped_day = ((days_diff - 1) % 28) + 1
                current_cycle["period_start_date"] = tracking.period_start_date
                current_cycle["current_day"] = wrapped_day
                current_cycle["note"] = (
                    "Provided period_start_date is more than 60 days ago; "
                    "estimating current day using a 28-day cycle."
                )
            else:
                current_cycle["period_start_date"] = tracking.period_start_date
                current_cycle["current_day"] = days_diff

            current_cycle["estimated_phase"] = "menstrual"
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format")
    
    elif tracking.days_since_last_period is not None:
        # User is not on period but knows when last period was
        last_period_date = datetime.now() - timedelta(days=tracking.days_since_last_period)
        current_cycle["last_period_start"] = last_period_date.isoformat()
        current_cycle["current_day"] = tracking.days_since_last_period
        
        # Estimate phase (rough calculation)
        if tracking.days_since_last_period <= 7:
            current_cycle["estimated_phase"] = "follicular"
        elif tracking.days_since_last_period <= 14:
            current_cycle["estimated_phase"] = "ovulatory"
        elif tracking.days_since_last_period <= 28:
            current_cycle["estimated_phase"] = "luteal"
        else:
            current_cycle["estimated_phase"] = "late_luteal"
    
    state["current_cycle"] = current_cycle
    set_state(state)
    save_state_to_file()
    
    return {
        "message": "Cycle tracking updated successfully",
        "current_cycle": current_cycle
    }


@router.post("/log")
async def log_cycle(cycle: CycleLog):
    """Log a new menstrual cycle"""
    state = get_state()
    
    # Validate date format
    try:
        date.fromisoformat(cycle.start_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Add cycle to history
    cycle_data = cycle.model_dump()
    state["cycles"].append(cycle_data)
    
    # Keep only last 12 cycles
    if len(state["cycles"]) > 12:
        state["cycles"] = state["cycles"][-12:]
    
    set_state(state)
    save_state_to_file()
    
    return {
        "message": "Cycle logged successfully",
        "cycle": cycle_data,
        "total_cycles": len(state["cycles"])
    }


@router.get("/")
async def get_cycles():
    """Get cycle history"""
    state = get_state()
    return {
        "cycles": state["cycles"],
        "count": len(state["cycles"])
    }


@router.get("/patterns")
async def get_patterns():
    """Get computed cycle patterns"""
    state = get_state()
    return {
        "patterns": state.get("patterns", {}),
        "last_updated": "computed on last plan generation"
    }


@router.get("/current")
async def get_current_cycle():
    """Get current cycle status for dashboard display"""
    state = get_state()
    current_cycle = state.get("current_cycle", {})
    
    if not current_cycle:
        return {
            "current_day": None,
            "phase": "Unknown - Please update your cycle info",
            "days_until_period": None,
            "is_on_period": False
        }
    
    # Format the response for the frontend
    cycle_day = current_cycle.get("current_day", 1)
    estimated_phase = current_cycle.get("estimated_phase", "unknown")
    is_on_period = current_cycle.get("is_on_period", False)
    
    # Calculate days until next period (rough estimate assuming 28-day cycle)
    days_until_period = None
    if not is_on_period and cycle_day:
        # Estimate next period in about 28 days from last period start
        days_until_period = max(0, 28 - cycle_day)
    elif is_on_period:
        days_until_period = 28  # Next cycle
    
    # Format phase name for display
    phase_names = {
        "menstrual": "Menstrual Phase",
        "follicular": "Follicular Phase", 
        "ovulatory": "Ovulation Phase",
        "luteal": "Luteal Phase",
        "late_luteal": "Late Luteal Phase"
    }
    
    return {
        "current_day": cycle_day,
        "phase": phase_names.get(estimated_phase, "Unknown Phase"),
        "days_until_period": days_until_period,
        "is_on_period": is_on_period,
        "last_updated": current_cycle.get("last_updated")
    }
