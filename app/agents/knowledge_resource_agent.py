"""
Knowledge & Resource Agent
Provides educational resources using RAG and scraped content.
"""
import json
from typing import Dict, Any
from pathlib import Path

from app.state import HerCycleState
from app.llm_client import call_gemini_chat
from app.config import SCRAPED_RESOURCES_PATH


def knowledge_resource_node(state: HerCycleState) -> Dict[str, Any]:
    """
    Knowledge & Resource Agent Node
    
    Uses RAG to find relevant educational resources.
    """
    daily_log = state.get("daily_log")
    cycle_output = state["agent_outputs"].get("cycle_pattern")
    
    # Build query based on symptoms and phase
    query_topics = []
    if daily_log:
        if daily_log.get("pain", 0) > 5:
            query_topics.append("pain relief")
        if daily_log.get("mood") == "bad":
            query_topics.append("mood management")
    
    if not query_topics:
        query_topics = ["menstrual health general"]
    
    # Query RAG
    from app.rag.vector_store import query_knowledge
    rag_query = " ".join(query_topics)
    
    try:
        rag_results = query_knowledge(rag_query, k=3)
    except:
        rag_results = []
    
    # Load scraped resources for URL mapping
    scraped_path = Path(SCRAPED_RESOURCES_PATH)
    scraped_metadata = []
    if scraped_path.exists():
        with open(scraped_path, 'r') as f:
            scraped_metadata = json.load(f)
    
    # Use Gemini to select and explain resources
    system_prompt = """You are the Knowledge & Resource Agent for HerCycle.
Your role is to provide 2-3 relevant educational resources.

Rules:
1. Match resources to today's specific needs
2. Explain WHY each resource is relevant
3. Use RAG results and scraped metadata
4. Provide article URLs when available
5. Include agent_message_for_others
6. Return valid JSON only"""
    
    user_content = f"""Today's focus: {query_topics}
Cycle context: {cycle_output.get('summary_text') if cycle_output else 'N/A'}

RAG Results:
{json.dumps([{'topic': r['metadata'].get('topic'), 'source': r['metadata'].get('source'), 'snippet': r['content'][:200]} for r in rag_results], indent=2)}

Available Resources:
{json.dumps([{'url': r['url'], 'title': r['title'], 'topic': r['topic']} for r in scraped_metadata[:10]], indent=2)}

Generate JSON:
{{
  "resources": [
    {{
      "title": "article title",
      "url": "URL if available from scraped metadata" or null,
      "topic": "topic category",
      "why_relevant": "specific reason for today"
    }}
  ],
  "agent_message_for_others": "Brief note"
}}"""
    
    response = call_gemini_chat(system_prompt, user_content, json_mode=True)
    
    return {
        "agent_outputs": {
            **state.get("agent_outputs", {}),
            "knowledge_resources": response
        }
    }
