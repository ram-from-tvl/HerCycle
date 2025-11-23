"""
Movement Agent
Provides safe, personalized movement recommendations based on current state.
"""
import json
from typing import Dict, Any
from pathlib import Path

from app.state import HerCycleState
from app.llm_client import call_gemini_chat
from app.config import KNOWLEDGE_DIR


def movement_node(state: HerCycleState) -> Dict[str, Any]:
    """
    Movement Agent Node
    
    Uses movement_blocks.json to provide safe exercise recommendations.
    """
    profile = state["profile"]
    daily_log = state.get("daily_log")
    cycle_output = state["agent_outputs"].get("cycle_pattern")
    symptom_output = state["agent_outputs"].get("symptom_insight")
    
    # Load movement blocks
    movement_path = Path(KNOWLEDGE_DIR) / "movement_blocks.json"
    with open(movement_path, 'r') as f:
        movement_db = json.load(f)
    
    # Determine intensity based on pain and energy
    pain = daily_log.get("pain", 0) if daily_log else 0
    energy = daily_log.get("energy", 5) if daily_log else 5
    
    if pain > 6 or energy < 3:
        intensity = "low_intensity"
    elif pain > 3 or energy < 5:
        intensity = "moderate_intensity"
    else:
        intensity = profile.get("activity_background", "moderate_intensity")
        if intensity == "beginner":
            intensity = "low_intensity"
        elif intensity == "active":
            intensity = "high_intensity"
        else:
            intensity = "moderate_intensity"
    
    # Get available space
    space = profile.get("movement_space", "room")
    time_avail = profile.get("time_availability", "5-10min")
    
    # Use Gemini to create personalized routine
    system_prompt = """You are the Movement Agent for HerCycle.
Your role is to provide safe, personalized movement recommendations.

Rules:
1. Prioritize safety - respect pain levels
2. Use movement blocks database for concrete exercises
3. Reference Symptom Agent's warnings explicitly
4. Provide a specific 5-15 min routine
5. Include agent_message_for_others
6. Return valid JSON only"""
    
    user_content = f"""Profile: movement_space={space}, time={time_avail}, background={profile.get('activity_background')}
Today: pain={pain}/10, energy={energy}/10
Cycle Agent: {cycle_output.get('agent_message_for_others') if cycle_output else 'N/A'}
Symptom Agent: {symptom_output.get('agent_message_for_others') if symptom_output else 'N/A'}

Movement Database (intensity={intensity}, space={space}):
{json.dumps(movement_db.get('movement_blocks', {}).get(intensity, {}).get(space, []), indent=2)}

Contraindications:
{json.dumps(movement_db.get('contraindications', {}), indent=2)}

Generate JSON:
{{
  "intensity_chosen": "{intensity}",
  "routine": {{
    "name": "routine name",
    "duration": "X min",
    "exercises": ["exercise1", "exercise2", ...],
    "instructions": "step-by-step guidance"
  }},
  "safety_notes": "important safety considerations",
  "agent_message_for_others": "What Coordinator should know about movement plan"
}}"""
    
    response = call_gemini_chat(system_prompt, user_content, json_mode=True)
    
    return {
        "agent_outputs": {
            **state.get("agent_outputs", {}),
            "movement": response
        }
    }
