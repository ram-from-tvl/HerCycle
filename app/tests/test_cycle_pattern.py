"""
Test Cycle Pattern Agent
"""
import pytest
from datetime import datetime, timedelta
from app.agents.cycle_pattern_agent import cycle_pattern_node, calculate_bmi
from app.state import HerCycleState


def test_calculate_bmi():
    """Test BMI calculation"""
    # Normal weight: 22.5 BMI
    bmi = calculate_bmi(height_cm=165, weight_kg=61.3)
    assert 22.0 <= bmi <= 23.0


def test_cycle_pattern_with_history():
    """Test cycle pattern analysis with cycle history"""
    # Create test state with cycle history
    today = datetime.now()
    cycles = []
    for i in range(3):
        start_date = (today - timedelta(days=28 * (3 - i))).isoformat()
        cycles.append({
            "start_date": start_date,
            "period_length": 5,
            "flow_intensity": "medium"
        })
    
    state: HerCycleState = {
        "profile": {
            "age": 25,
            "height_cm": 165.0,
            "weight_kg": 60.0,
            "diet_type": "balanced",
            "activity_background": "moderate",
            "food_constraints": [],
            "budget_level": "medium",
            "food_access": "mess",
            "region": "india",
            "movement_space": "room",
            "time_availability": "10min",
            "emotional_comfort_level": "medium",
            "preferred_product": "pads",
            "location_lat": None,
            "location_lng": None,
            "allow_location": False
        },
        "cycles": cycles,
        "patterns": {},
        "daily_log": {
            "pain": 3,
            "energy": 6,
            "mood": "neutral",
            "stress": 3,
            "sleep_hours": 7.0
        },
        "agent_outputs": {},
        "final_plan": None,
        "local_search_type": None
    }
    
    result = cycle_pattern_node(state)
    
    # Check that patterns were computed
    assert "patterns" in result
    patterns = result["patterns"]
    assert "avg_cycle_length" in patterns
    assert 26 <= patterns["avg_cycle_length"] <= 30  # Should be around 28
    assert "is_regular" in patterns
    
    # Check that agent output was created
    assert "agent_outputs" in result
    assert "cycle_pattern" in result["agent_outputs"]


def test_cycle_pattern_without_sufficient_data():
    """Test cycle pattern when there's insufficient data"""
    state: HerCycleState = {
        "profile": {},
        "cycles": [],  # No cycle history
        "patterns": {},
        "daily_log": None,
        "agent_outputs": {},
        "final_plan": None,
        "local_search_type": None
    }
    
    # Should still run without crashing
    result = cycle_pattern_node(state)
    assert "agent_outputs" in result


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
