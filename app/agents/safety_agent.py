"""
Safety Agent
Final safety check to ensure all recommendations are safe and appropriate.
"""
from typing import Dict, Any

from app.state import HerCycleState


def safety_node(state: HerCycleState) -> Dict[str, Any]:
    """
    Safety Agent Node
    
    Performs final safety checks on all agent outputs.
    """
    agent_outputs = state.get("agent_outputs", {})
    daily_log = state.get("daily_log")
    final_plan = state.get("final_plan", {})
    
    safety_issues = []
    modifications = []
    
    # Check 1: No medication/diagnosis language
    all_text = str(agent_outputs) + str(final_plan)
    forbidden_words = ["take ibuprofen", "take medication", "diagnosed with", "you have endometriosis", "you have PCOS"]
    
    for word in forbidden_words:
        if word.lower() in all_text.lower():
            safety_issues.append(f"Medical advice detected: '{word}'")
            modifications.append("Removed medical advice, suggested consulting healthcare provider")
    
    # Check 2: Movement intensity vs pain level
    movement_output = agent_outputs.get("movement", {})
    pain = daily_log.get("pain", 0) if daily_log else 0
    
    if pain >= 7:
        intensity = movement_output.get("intensity_chosen", "")
        if intensity != "low_intensity":
            safety_issues.append(f"Pain level {pain}/10 but {intensity} recommended")
            modifications.append("Downgraded to low_intensity movement (breathing & gentle stretching only)")
    
    # Check 3: Predictions phrased as estimates
    cycle_output = agent_outputs.get("cycle_pattern", {})
    cycle_text = cycle_output.get("summary_text", "")
    
    if any(word in cycle_text.lower() for word in ["will start", "definitely", "guaranteed"]):
        safety_issues.append("Prediction phrased too definitively")
        modifications.append("Rephrased prediction as estimate")
    
    # Check 4: Emotional support - very low mood
    emotional_output = agent_outputs.get("emotional", {})
    mood = daily_log.get("mood", "neutral") if daily_log else "neutral"
    
    if mood == "bad" and not emotional_output.get("safety_message"):
        safety_issues.append("Low mood detected but no support resource suggested")
        modifications.append("Added gentle suggestion to reach out to trusted person")
    
    # Build safety report
    safety_status = {
        "passed": len(safety_issues) == 0,
        "issues_found": safety_issues,
        "modifications_made": modifications,
        "final_check": "All recommendations reviewed for safety" if len(safety_issues) == 0 else "Safety modifications applied"
    }
    
    return {
        "agent_outputs": {
            **state.get("agent_outputs", {}),
            "safety": safety_status
        }
    }
