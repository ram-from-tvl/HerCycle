"""
Nutrition Agent
Provides personalized nutrition recommendations using RAG and food database.
"""
import json
from typing import Dict, Any
from pathlib import Path

from app.state import HerCycleState
from app.llm_client import call_gemini_chat
from app.config import KNOWLEDGE_DIR


def nutrition_node(state: HerCycleState) -> Dict[str, Any]:
    """
    Nutrition Agent Node
    
    Uses RAG + foods.json to provide personalized nutrition suggestions.
    """
    profile = state["profile"]
    daily_log = state.get("daily_log")
    cycle_output = state["agent_outputs"].get("cycle_pattern")
    symptom_output = state["agent_outputs"].get("symptom_insight")
    
    # Load foods database
    foods_path = Path(KNOWLEDGE_DIR) / "foods.json"
    with open(foods_path, 'r') as f:
        foods_db = json.load(f)
    
    # Determine tags for RAG query
    tags = []
    if daily_log:
        if daily_log.get("pain", 0) > 5:
            tags.append("cramps")
        if daily_log.get("energy", 5) < 3:
            tags.append("low_energy")
        if daily_log.get("stress", 3) > 3:
            tags.append("stress")
    
    # Query RAG for nutrition knowledge
    from app.rag.vector_store import query_knowledge
    rag_query = f"nutrition recommendations for {', '.join(tags)} during menstrual cycle"
    
    try:
        rag_results = query_knowledge(rag_query, k=2)
        rag_context = "\n\n".join([doc["content"][:500] for doc in rag_results])
    except:
        rag_context = "No RAG context available"
    
    # Use Gemini to synthesize recommendations
    system_prompt = """You are the Nutrition Agent for HerCycle.
Your role is to provide personalized, grounded nutrition recommendations.

Rules:
1. Use RAG context and foods database to ground suggestions
2. Respect diet type, constraints, budget, and region
3. Reference other agents' insights explicitly
4. Be practical and specific (e.g., "have dal with spinach for lunch")
5. Include agent_message_for_others
6. Return valid JSON only"""
    
    user_content = f"""Profile: {profile}
Today's symptoms: {daily_log}
Cycle Agent: {cycle_output.get('agent_message_for_others') if cycle_output else 'N/A'}
Symptom Agent: {symptom_output.get('agent_message_for_others') if symptom_output else 'N/A'}

RAG Knowledge:
{rag_context}

Foods Database:
{json.dumps(foods_db, indent=2)}

Generate JSON:
{{
  "focus": "What to focus on today (e.g., 'iron-rich foods for energy')",
  "meals": {{
    "breakfast": "specific suggestion",
    "lunch": "specific suggestion",
    "snacks": "specific suggestion"
  }},
  "hydration": "hydration tips",
  "avoid": ["foods to avoid today"],
  "agent_message_for_others": "What other agents should know about nutrition plan"
}}"""
    
    response = call_gemini_chat(system_prompt, user_content, json_mode=True)
    
    return {
        "agent_outputs": {
            **state.get("agent_outputs", {}),
            "nutrition": response
        }
    }
