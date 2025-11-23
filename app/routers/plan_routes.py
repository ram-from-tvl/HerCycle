"""
Plan generation routes
"""
from fastapi import APIRouter, HTTPException

from app.state import get_state, set_state, save_state_to_file
from app.agents.graph import run_full_plan

router = APIRouter(prefix="/plan", tags=["plan"])


@router.post("/today")
async def generate_today_plan():
    """
    Generate today's personalized plan by running the full agent workflow.
    """
    state = get_state()
    
    # Check if we have minimum required data (profile should exist)
    if not state.get("profile"):
        raise HTTPException(
            status_code=400,
            detail="Please complete your profile setup first"
        )
    
    # If no daily check-in, use defaults
    if not state.get("daily_log"):
        from datetime import datetime
        state["daily_log"] = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "pain": 3,
            "energy": 6,
            "mood": "okay", 
            "stress": 3,
            "sleep_hours": 7,
            "symptoms": [],
            "notes": "No daily check-in provided - using defaults"
        }
    
    try:
        # Run the full agent graph
        updated_state = run_full_plan(state)
        
        # Update global state
        set_state(updated_state)
        save_state_to_file()
        
        return {
            "message": "Plan generated successfully",
            "final_plan": updated_state.get("final_plan"),
            "agent_outputs": {
                "cycle_pattern": updated_state["agent_outputs"].get("cycle_pattern"),
                "symptom_insight": updated_state["agent_outputs"].get("symptom_insight"),
                "nutrition": updated_state["agent_outputs"].get("nutrition"),
                "movement": updated_state["agent_outputs"].get("movement"),
                "emotional": updated_state["agent_outputs"].get("emotional"),
                "sustainability": updated_state["agent_outputs"].get("sustainability"),
                "knowledge_resources": updated_state["agent_outputs"].get("knowledge_resources"),
                "safety": updated_state["agent_outputs"].get("safety")
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating plan: {str(e)}"
        )


@router.get("/latest")
async def get_latest_plan():
    """Get the most recently generated plan"""
    state = get_state()
    
    if not state.get("final_plan"):
        return {
            "message": "No plan generated yet",
            "final_plan": None
        }
    
    return {
        "final_plan": state["final_plan"],
        "agent_outputs": state.get("agent_outputs", {})
    }
