"""
ML Cycle Predictor - Wraps the trained Random Forest + SHAP model.
Predicts next cycle start and provides feature importance explanations.
"""
import joblib
import pandas as pd
import numpy as np
import shap
from typing import Dict, Any, List
from pathlib import Path

from app.config import ML_MODEL_PATH


# Cached model components
_model = None
_preprocess = None
_rf = None
_explainer = None


def _load_model():
    """Load the trained model (cached)"""
    global _model, _preprocess, _rf, _explainer
    
    if _model is None:
        model_path = Path(ML_MODEL_PATH)
        if not model_path.exists():
            raise FileNotFoundError(f"ML model not found at {ML_MODEL_PATH}")
        
        _model = joblib.load(str(model_path))
        _preprocess = _model.named_steps["preprocess"]
        _rf = _model.named_steps["rf"]
        _explainer = shap.TreeExplainer(_rf)
    
    return _model, _preprocess, _rf, _explainer


def run_cycle_prediction(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Run cycle prediction using the trained ML model.
    
    Args:
        features: Dictionary with keys:
            - Age: int
            - BMI: float
            - Stress Level: int (1-5)
            - Exercise Frequency: str ("Low", "Moderate", "High")
            - Sleep Hours: float
            - Diet: str ("Balanced", "Vegetarian", "Vegan", etc.)
            - Cycle Length: int
            - Period Length: int
            - Symptoms: str ("None", "Cramps", "Headache", etc.)
    
    Returns:
        Dictionary containing:
            - prediction_days_until_next_cycle: float
            - feature_contributions_ranked: list of dicts with feature, direction, impact_days
            - raw_shap_values: dict of feature_name: float
    """
    try:
        model, preprocess, rf, explainer = _load_model()
        
        # Create DataFrame from features
        sample_input = pd.DataFrame([features])
        
        # Make prediction
        pred_days = model.predict(sample_input)[0]
        
        # Transform input for SHAP
        transformed_row = preprocess.transform(sample_input)
        
        # Calculate SHAP values
        shap_values = explainer.shap_values(transformed_row)[0]
        
        # Build feature names
        cat_cols = ["Exercise Frequency", "Diet", "Symptoms"]
        num_cols = ["Age", "BMI", "Stress Level", "Sleep Hours", "Cycle Length", "Period Length"]
        
        ohe_feature_names = preprocess.named_transformers_["cat"].get_feature_names_out(cat_cols)
        full_feature_names = np.concatenate([num_cols, ohe_feature_names])
        
        # Sort by importance
        importance = sorted(
            zip(full_feature_names, shap_values),
            key=lambda x: abs(x[1]),
            reverse=True
        )
        
        # Build result
        result = {
            "prediction_days_until_next_cycle": float(pred_days),
            "feature_contributions_ranked": [
                {
                    "feature": feat,
                    "direction": "increase" if val > 0 else "decrease",
                    "impact_days": float(abs(val))
                }
                for feat, val in importance[:10]  # Top 10 features
            ],
            "raw_shap_values": {
                feat: float(val) 
                for feat, val in zip(full_feature_names, shap_values)
            }
        }
        
        return result
        
    except Exception as e:
        print(f"Error in cycle prediction: {e}")
        raise
