"""
Symptom Insight Agent
Analyzes correlations between symptoms, lifestyle factors, and cycle phases.
"""
from typing import Dict, Any
from collections import defaultdict

from app.state import HerCycleState
from app.llm_client import call_gemini_chat


def symptom_insight_node(state: HerCycleState) -> Dict[str, Any]:
    """
    Symptom Insight Agent Node
    
    Analyzes patterns in symptoms vs lifestyle factors (sleep, stress, etc.)
    """
    cycles = state["cycles"]
    daily_log = state.get("daily_log")
    cycle_pattern_output = state["agent_outputs"].get("cycle_pattern")
    
    # Analyze symptom correlations
    correlations = {}
    
    if len(cycles) >= 3:
        # Track symptom intensity vs factors
        pain_by_sleep = defaultdict(list)
        mood_by_stress = defaultdict(list)
        
        for cycle in cycles:
            daily_logs = cycle.get("daily_logs", [])
            for log in daily_logs:
                sleep = log.get("sleep_hours", 0)
                pain = log.get("pain", 0)
                stress = log.get("stress", 0)
                mood = log.get("mood", "neutral")
                
                # Categorize sleep
                sleep_category = "poor" if sleep < 6 else "good" if sleep >= 7 else "moderate"
                pain_by_sleep[sleep_category].append(pain)
                
                # Categorize stress
                stress_category = "low" if stress <= 2 else "high" if stress >= 4 else "medium"
                mood_score = {"bad": 1, "neutral": 2, "good": 3}.get(mood, 2)
                mood_by_stress[stress_category].append(mood_score)
        
        # Calculate averages
        if pain_by_sleep:
            correlations["sleep_pain"] = {
                cat: sum(pains) / len(pains) if pains else 0
                for cat, pains in pain_by_sleep.items()
            }
        
        if mood_by_stress:
            correlations["stress_mood"] = {
                cat: sum(moods) / len(moods) if moods else 0
                for cat, moods in mood_by_stress.items()
            }
    
    # Use Gemini for insights
    system_prompt = """You are the Symptom Insight Agent for HerCycle.
Your role is to identify patterns in how symptoms correlate with lifestyle factors.

Rules:
1. Be specific about correlations you observe
2. Provide actionable early warnings
3. Be empathetic and non-judgmental
4. Reference the Cycle Pattern Agent's output when relevant
5. Include agent_message_for_others for coordination
6. Return valid JSON only"""
    
    user_content = f"""Correlations found: {correlations}
Today's log: {daily_log}
Cycle Pattern Agent says: {cycle_pattern_output.get('agent_message_for_others') if cycle_pattern_output else 'No data'}

Generate JSON:
{{
  "insights": ["insight1", "insight2", ...],
  "early_warnings": ["warning1", ...] or [],
  "correlations_summary": "2-3 sentences about key patterns",
  "agent_message_for_others": "One sentence about what other agents should know"
}}"""
    
    response = call_gemini_chat(system_prompt, user_content, json_mode=True)
    
    return {
        "agent_outputs": {
            **state.get("agent_outputs", {}),
            "symptom_insight": {
                **response,
                "raw_correlations": correlations
            }
        }
    }
