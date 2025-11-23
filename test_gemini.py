#!/usr/bin/env python3
"""Test script to verify Gemini API connection"""
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

# Load env
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key: {api_key[:10]}...")

try:
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=api_key,
        temperature=0.7
    )
    
    response = llm.invoke([HumanMessage(content="Hello, can you respond with just 'success'?")])
    print(f"Success: {response.content}")
    
except Exception as e:
    print(f"Error: {e}")