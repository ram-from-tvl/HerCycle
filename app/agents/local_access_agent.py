"""
Local Access & Navigation Agent
Uses Google Places API to find nearby shops and clinics.
NOTE: This agent is called separately via dedicated endpoint, NOT in main graph.
"""
from typing import Dict, Any, Optional
import httpx

from app.state import HerCycleState
from app.config import GOOGLE_PLACES_API_KEY


async def search_nearby_places(
    lat: float,
    lng: float,
    search_type: str,  # "products" or "clinics"
    radius: int = 5000  # meters
) -> Dict[str, Any]:
    """
    Search for nearby places using Google Places API.
    
    Args:
        lat: Latitude
        lng: Longitude
        search_type: "products" (pharmacies/stores) or "clinics" (healthcare)
        radius: Search radius in meters
        
    Returns:
        Dict with results and status
    """
    if not GOOGLE_PLACES_API_KEY:
        return {
            "error": "Google Places API key not configured",
            "results": []
        }
    
    # Map search type to Google Places query
    queries = {
        "products": "pharmacy OR medical store OR feminine hygiene store",
        "clinics": "gynecologist OR women's clinic OR healthcare clinic"
    }
    
    query = queries.get(search_type, queries["products"])
    
    # Google Places Nearby Search endpoint
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "keyword": query,
        "key": GOOGLE_PLACES_API_KEY
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        
        if data.get("status") != "OK":
            return {
                "error": f"Google Places API error: {data.get('status')}",
                "results": []
            }
        
        # Parse results
        places = []
        for place in data.get("results", [])[:5]:  # Top 5 results
            places.append({
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "rating": place.get("rating"),
                "open_now": place.get("opening_hours", {}).get("open_now"),
                "location": place.get("geometry", {}).get("location")
            })
        
        return {
            "results": places,
            "search_type": search_type,
            "center": {"lat": lat, "lng": lng}
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "results": []
        }


def local_access_node(state: HerCycleState) -> Dict[str, Any]:
    """
    Local Access Agent Node (for graph, minimal implementation)
    
    NOTE: This agent is typically called via dedicated endpoint.
    In the graph, it just acknowledges location status.
    """
    profile = state["profile"]
    
    has_location = profile.get("allow_location", False) and profile.get("location_lat") and profile.get("location_lng")
    
    return {
        "agent_outputs": {
            **state.get("agent_outputs", {}),
            "local_access": {
                "status": "available" if has_location else "location_not_enabled",
                "message": "Use /nearby-support endpoint for location-based search" if has_location else "Enable location sharing to find nearby resources",
                "agent_message_for_others": "Location services ready" if has_location else "No location data"
            }
        }
    }
