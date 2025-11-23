"""
Emotional Support Agent
Provides mood support, coping strategies, and journaling prompts using RAG.
"""
from typing import Dict, Any

from app.state import HerCycleState
from app.llm_client import call_gemini_chat


def emotional_node(state: HerCycleState) -> Dict[str, Any]:
    """
    Emotional Support Agent Node
    
    Analyzes mood and provides emotional support using RAG.
    """
    daily_log = state.get("daily_log")
    cycle_output = state["agent_outputs"].get("cycle_pattern")
    symptom_output = state["agent_outputs"].get("symptom_insight")
    
    # Extract mood and journal
    mood = daily_log.get("mood", "neutral") if daily_log else "neutral"
    journal = daily_log.get("journal", "") if daily_log else ""
    stress = daily_log.get("stress", 3) if daily_log else 3
    
    # Query RAG for coping strategies
    from app.rag.vector_store import query_knowledge
    rag_query = f"emotional support coping strategies for {mood} mood during period stress level {stress}"
    
    try:
        rag_results = query_knowledge(rag_query, k=2)
        rag_context = "\n\n".join([doc["content"][:400] for doc in rag_results])
    except:
        rag_context = "No RAG context available"
    
    # Use Gemini for emotional support
    system_prompt = """You are the Emotional Support Agent for HerCycle.
Your role is to provide empathetic, safe emotional support.

Rules:
1. Be warm, validating, and non-judgmental
2. Use RAG context for evidence-based coping strategies
3. Reference cycle phase from Cycle Agent (hormones affect mood)
4. If mood is very low, gently suggest talking to trusted friend or counselor
5. Provide a thoughtful journaling prompt
6. Include agent_message_for_others
7. Return valid JSON only"""
    
    user_content = f"""Mood: {mood}
Stress: {stress}/5
Journal entry: "{journal}"
Cycle Agent: {cycle_output.get('agent_message_for_others') if cycle_output else 'N/A'}
Symptom Agent: {symptom_output.get('agent_message_for_others') if symptom_output else 'N/A'}

RAG Knowledge:
{rag_context}

Generate JSON:
{{
  "mood_summary": "1-2 sentences acknowledging how they feel",
  "support_suggestions": ["suggestion1", "suggestion2"],
  "journaling_prompt": "A thoughtful question or prompt for reflection",
  "safety_message": "If mood is concerning, gentle suggestion to reach out" or null,
  "agent_message_for_others": "Brief note for Coordinator"
}}"""
    
    response = call_gemini_chat(system_prompt, user_content, json_mode=True)
    
    return {
        "agent_outputs": {
            **state.get("agent_outputs", {}),
            "emotional": response
        }
    }
