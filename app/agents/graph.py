"""
LangGraph orchestration - defines the agent workflow graph.
"""
from langgraph.graph import StateGraph, START, END

from app.state import HerCycleState
from app.agents.cycle_pattern_agent import cycle_pattern_node
from app.agents.symptom_insight_agent import symptom_insight_node
from app.agents.nutrition_agent import nutrition_node
from app.agents.movement_agent import movement_node
from app.agents.emotional_agent import emotional_node
from app.agents.sustainability_agent import sustainability_node
from app.agents.knowledge_resource_agent import knowledge_resource_node
from app.agents.coordinator_agent import coordinator_node
from app.agents.safety_agent import safety_node


# Build the state graph
graph_builder = StateGraph(HerCycleState)

# Add nodes
graph_builder.add_node("cycle_pattern", cycle_pattern_node)
graph_builder.add_node("symptom_insight", symptom_insight_node)
graph_builder.add_node("nutrition", nutrition_node)
graph_builder.add_node("movement", movement_node)
graph_builder.add_node("emotional", emotional_node)
graph_builder.add_node("sustainability", sustainability_node)
graph_builder.add_node("knowledge_resources", knowledge_resource_node)
graph_builder.add_node("coordinator", coordinator_node)
graph_builder.add_node("safety", safety_node)

# Define sequential edges
graph_builder.add_edge(START, "cycle_pattern")
graph_builder.add_edge("cycle_pattern", "symptom_insight")
graph_builder.add_edge("symptom_insight", "nutrition")
graph_builder.add_edge("nutrition", "movement")
graph_builder.add_edge("movement", "emotional")
graph_builder.add_edge("emotional", "sustainability")
graph_builder.add_edge("sustainability", "knowledge_resources")
graph_builder.add_edge("knowledge_resources", "coordinator")
graph_builder.add_edge("coordinator", "safety")
graph_builder.add_edge("safety", END)

# Compile the graph
COMPILED_GRAPH = graph_builder.compile()


def run_full_plan(state: HerCycleState) -> HerCycleState:
    """
    Run the full agent workflow.
    
    Args:
        state: Current HerCycle state
        
    Returns:
        Updated state after all agents have run
    """
    result = COMPILED_GRAPH.invoke(state)
    return result
