"""
Coordinator Agent
Synthesizes all agent outputs into a coherent daily plan with explicit cross-agent reasoning.
"""
from typing import Dict, Any

from app.state import HerCycleState
from app.llm_client import call_gemini_chat


def coordinator_node(state: HerCycleState) -> Dict[str, Any]:
    """
    Coordinator Agent Node
    
    Reads all agent outputs and creates a unified, coherent daily plan.
    MUST explicitly reference how agents influenced each other.
    """
    agent_outputs = state.get("agent_outputs", {})
    
    # Extract all agent messages
    cycle_msg = agent_outputs.get("cycle_pattern", {}).get("agent_message_for_others", "")
    symptom_msg = agent_outputs.get("symptom_insight", {}).get("agent_message_for_others", "")
    nutrition_msg = agent_outputs.get("nutrition", {}).get("agent_message_for_others", "")
    movement_msg = agent_outputs.get("movement", {}).get("agent_message_for_others", "")
    emotional_msg = agent_outputs.get("emotional", {}).get("agent_message_for_others", "")
    sustainability_msg = agent_outputs.get("sustainability", {}).get("agent_message_for_others", "")
    knowledge_msg = agent_outputs.get("knowledge_resources", {}).get("agent_message_for_others", "")
    
    # Use Gemini for coordination
    system_prompt = """You are the Coordinator Agent for HerCycle.
Your role is to synthesize all agent outputs into a coherent daily plan.

CRITICAL: You MUST explicitly narrate how agents collaborated. For example:
- "The Cycle Agent expects your period in 3-4 days, so..."
- "Because the Symptom Agent warned about cramps after poor sleep, I asked Movement Agent to..."
- "Based on Emotional Agent's observation of low mood, I prioritized..."

Rules:
1. Read ALL agent messages and outputs
2. Create a coherent story of collaboration
3. Organize plan into clear sections
4. Be warm and supportive
5. Explicitly credit agents in your reasoning
6. Return valid JSON only"""
    
    user_content = f"""Agent Messages:
- Cycle: {cycle_msg}
- Symptom: {symptom_msg}
- Nutrition: {nutrition_msg}
- Movement: {movement_msg}
- Emotional: {emotional_msg}
- Sustainability: {sustainability_msg}
- Knowledge: {knowledge_msg}

Full Agent Outputs:
{str(agent_outputs)[:2000]}  # Truncate for token limit

Generate JSON:
{{
  "focus_for_today": "One sentence main focus",
  "reasoning_summary": "2-3 sentences explicitly describing how agents collaborated and influenced each other",
  "plan_items": [
    {{
      "category": "nutrition" | "movement" | "emotional" | "other",
      "text": "specific actionable item",
      "source_agent": "which agent provided this"
    }}
  ],
  "encouraging_message": "Warm closing message"
}}"""
    
    response = call_gemini_chat(system_prompt, user_content, json_mode=True)
    
    return {
        "agent_outputs": {
            **state.get("agent_outputs", {}),
            "coordinator": response
        },
        "final_plan": response
    }
