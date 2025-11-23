"""
Gemini LLM client wrapper for HerCycle.
Provides chat completion functionality using Google's Gemini API.
"""
import json
from typing import Union, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

from app.config import GEMINI_API_KEY, GEMINI_MODEL_NAME


# Initialize Gemini chat model
_llm = None


def get_llm():
    """Get or initialize the Gemini LLM instance"""
    global _llm
    if _llm is None:
        _llm = ChatGoogleGenerativeAI(
            model=GEMINI_MODEL_NAME,
            google_api_key=GEMINI_API_KEY,
            temperature=0.7
        )
    return _llm


def call_gemini_chat(
    system_prompt: str,
    user_content: str,
    json_mode: bool = False
) -> Union[str, dict]:
    """
    Call Gemini chat API with system and user prompts.
    
    Args:
        system_prompt: System instruction for the model
        user_content: User message content
        json_mode: If True, instructs model to return JSON and parses response
        
    Returns:
        String response or parsed JSON dict if json_mode=True
    """
    llm = get_llm()
    
    # Build messages
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]
    
    # Add JSON instruction if needed
    if json_mode:
        messages[-1].content += "\n\nPlease respond with valid JSON only, no markdown formatting."
    
    try:
        # Invoke the model synchronously
        response = llm.invoke(messages)
        
        # Extract content
        content = response.content
        
        # Parse JSON if requested
        if json_mode:
            try:
                # Remove markdown code blocks if present
                if isinstance(content, str):
                    content = content.strip()
                    if content.startswith("```json"):
                        content = content[7:]
                    elif content.startswith("```"):
                        content = content[3:]
                    if content.endswith("```"):
                        content = content[:-3]
                    content = content.strip()
                    
                    return json.loads(content)
                return content
            except json.JSONDecodeError as e:
                # If JSON parsing fails, return raw content
                print(f"Warning: Failed to parse JSON response: {e}")
                return {"raw_response": content, "error": "Failed to parse JSON"}
        
        return content
        
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        # Provide mock responses for development/testing
        if json_mode:
            return {
                "summary": f"Mock AI response for development mode. System: {system_prompt[:100]}...",
                "recommendations": ["Stay hydrated", "Get adequate rest", "Monitor symptoms"],
                "agent_message_for_others": "AI is currently in development mode - please update API key"
            }
        else:
            return f"Mock AI response: {system_prompt[:50]}... (API temporarily unavailable)"
