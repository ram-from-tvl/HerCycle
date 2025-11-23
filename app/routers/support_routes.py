"""
Support and resource routes (local search, knowledge resources)
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from app.state import get_state
from app.agents.local_access_agent import search_nearby_places

router = APIRouter(prefix="/support", tags=["support"])


class NearbySearchRequest(BaseModel):
    search_type: str  # "products" or "clinics"
    radius: Optional[int] = 5000  # meters


@router.post("/nearby")
async def search_nearby(request: NearbySearchRequest):
    """
    Search for nearby shops or clinics using Google Places API.
    Requires location to be set in profile.
    """
    state = get_state()
    profile = state["profile"]
    
    if not profile.get("allow_location"):
        raise HTTPException(
            status_code=400,
            detail="Location access not enabled. Please enable location sharing in profile."
        )
    
    lat = profile.get("location_lat")
    lng = profile.get("location_lng")
    
    if not lat or not lng:
        raise HTTPException(
            status_code=400,
            detail="Location coordinates not set. Please update your location in profile."
        )
    
    if request.search_type not in ["products", "clinics"]:
        raise HTTPException(
            status_code=400,
            detail="search_type must be 'products' or 'clinics'"
        )
    
    try:
        results = await search_nearby_places(
            lat=lat,
            lng=lng,
            search_type=request.search_type,
            radius=request.radius
        )
        
        if "error" in results:
            raise HTTPException(status_code=500, detail=results["error"])
        
        return results
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error searching nearby places: {str(e)}"
        )


@router.get("/resources")
async def get_knowledge_resources():
    """
    Get educational resources from latest plan.
    """
    state = get_state()
    
    knowledge_output = state.get("agent_outputs", {}).get("knowledge_resources")
    
    if not knowledge_output:
        return {
            "message": "No resources available yet. Generate a plan first.",
            "resources": []
        }
    
    return {
        "resources": knowledge_output.get("resources", []),
        "context": "Resources selected based on your current needs"
    }
