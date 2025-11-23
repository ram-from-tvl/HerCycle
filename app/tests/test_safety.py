"""
Test Safety Agent
"""
import pytest
from app.state import HerCycleState
from app.agents.safety_agent import safety_node


def test_safety_downgrade_movement_high_pain():
    """Test that Safety Agent downgrades movement when pain is too high"""
    state: HerCycleState = {
        "profile": {},
        "cycles": [],
        "patterns": {},
        "daily_log": {
            "pain": 8,  # High pain
            "energy": 5,
            "mood": "neutral",
            "stress": 3,
            "sleep_hours": 7.0
        },
        "agent_outputs": {
            "movement": {
                "intensity_chosen": "moderate_intensity",  # Should be downgraded
                "routine": {"name": "Test", "duration": "15 min"}
            }
        },
        "final_plan": {},
        "local_search_type": None
    }
    
    result = safety_node(state)
    safety_output = result["agent_outputs"]["safety"]
    
    # Should detect the issue
    assert not safety_output["passed"]
    assert len(safety_output["issues_found"]) > 0
    assert any("Pain level" in issue for issue in safety_output["issues_found"])
    assert any("Downgraded" in mod for mod in safety_output["modifications_made"])


def test_safety_detects_medication_advice():
    """Test that Safety Agent detects and flags medication advice"""
    state: HerCycleState = {
        "profile": {},
        "cycles": [],
        "patterns": {},
        "daily_log": {},
        "agent_outputs": {
            "emotional": {
                "support_suggestions": ["take ibuprofen for pain"]  # Medical advice - forbidden
            }
        },
        "final_plan": {},
        "local_search_type": None
    }
    
    result = safety_node(state)
    safety_output = result["agent_outputs"]["safety"]
    
    # Should detect medical advice
    assert not safety_output["passed"]
    assert any("Medical advice" in issue for issue in safety_output["issues_found"])


def test_safety_passes_clean_output():
    """Test that Safety Agent passes when all checks are good"""
    state: HerCycleState = {
        "profile": {},
        "cycles": [],
        "patterns": {},
        "daily_log": {
            "pain": 3,  # Low pain
            "energy": 7,
            "mood": "good",
            "stress": 2,
            "sleep_hours": 8.0
        },
        "agent_outputs": {
            "cycle_pattern": {
                "summary_text": "I estimate your period might start in 3-4 days"  # Good phrasing
            },
            "movement": {
                "intensity_chosen": "moderate_intensity",
                "routine": {"name": "Test"}
            },
            "emotional": {
                "support_suggestions": ["Practice deep breathing"]  # Safe advice
            }
        },
        "final_plan": {},
        "local_search_type": None
    }
    
    result = safety_node(state)
    safety_output = result["agent_outputs"]["safety"]
    
    # Should pass all checks
    assert safety_output["passed"]
    assert len(safety_output["issues_found"]) == 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
