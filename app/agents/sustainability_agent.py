"""
Sustainability Agent
Provides period product recommendations based on budget and environmental impact.
"""
import json
from typing import Dict, Any
from pathlib import Path

from app.state import HerCycleState
from app.llm_client import call_gemini_chat
from app.config import KNOWLEDGE_DIR


def sustainability_node(state: HerCycleState) -> Dict[str, Any]:
    """
    Sustainability Agent Node
    
    Recommends sustainable period products based on budget and preferences.
    """
    profile = state["profile"]
    
    # Load sustainability database
    sustain_path = Path(KNOWLEDGE_DIR) / "sustainability.json"
    with open(sustain_path, 'r') as f:
        sustain_db = json.load(f)
    
    budget_level = profile.get("budget_level", "medium")
    preferred_product = profile.get("preferred_product", "pads")
    
    # Use Gemini for recommendations
    system_prompt = """You are the Sustainability Agent for HerCycle.
Your role is to provide eco-friendly and budget-conscious period product recommendations.

Rules:
1. Use sustainability database for accurate cost/environmental data
2. Be practical and respectful of budget constraints
3. Explain environmental impact clearly
4. Provide transition tips if suggesting a switch
5. Include agent_message_for_others
6. Return valid JSON only"""
    
    user_content = f"""Profile: budget={budget_level}, current_product={preferred_product}

Sustainability Database:
{json.dumps(sustain_db, indent=2)}

Generate JSON:
{{
  "current_product_analysis": {{
    "annual_cost": number,
    "environmental_impact": "description"
  }},
  "recommended_alternative": {{
    "product": "product name",
    "reasoning": "why this is recommended",
    "annual_cost": number,
    "savings": number,
    "environmental_benefit": "specific impact"
  }} or null,
  "transition_tips": ["tip1", "tip2"] or [],
  "agent_message_for_others": "Brief note (can mention no behavior changes needed from other agents)"
}}"""
    
    response = call_gemini_chat(system_prompt, user_content, json_mode=True)
    
    return {
        "agent_outputs": {
            **state.get("agent_outputs", {}),
            "sustainability": response
        }
    }
