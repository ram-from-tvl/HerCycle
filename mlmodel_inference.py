# ======================= FINAL INFERENCE + EXPLAINABILITY ENGINE =======================
# This cell:
# 1. Loads the trained model (trained_model.pkl)
# 2. Accepts a sample user input (modify as needed)
# 3. Predicts next cycle start (in days)
# 4. Computes SHAP-based feature contributions for THIS input only
# 5. Produces BOTH:
#       - Human-readable explanation
#       - LLM-friendly JSON explanation dictionary
#
# Designed for direct integration in LLM pipelines and agentic systems.
# =======================================================================================

import joblib
import pandas as pd
import numpy as np
import shap
import json
import matplotlib.pyplot as plt

# ---------------------- LOAD TRAINED MODEL ----------------------
model = joblib.load("trained_model.pkl")
preprocess = model.named_steps["preprocess"]
rf = model.named_steps["rf"]

# ---------------------- DEFINE INPUT SAMPLE ----------------------
# You can replace this with dynamic values from your app.
sample_input = pd.DataFrame([{
    "Age": 26,
    "BMI": 22.5,
    "Stress Level": 3,
    "Exercise Frequency": "Moderate",
    "Sleep Hours": 7.2,
    "Diet": "Balanced",
    "Cycle Length": 29,
    "Period Length": 5,
    "Symptoms": "Cramps"
}])

print("\n============= USER INPUT =============")
print(sample_input)

# ---------------------- MAKE PREDICTION ----------------------
pred_days = model.predict(sample_input)[0]
print("\nPredicted Next Cycle Start (Days from last cycle):", pred_days)

# ---------------------- SHAP EXPLAINABILITY ----------------------
# Compute SHAP values for THIS sample only
explainer = shap.TreeExplainer(rf)

# Preprocess input row into numeric + one-hot
transformed_row = preprocess.transform(sample_input)

# SHAP values (single sample => array of shape [1, n_features])
shap_values = explainer.shap_values(transformed_row)[0]

# Build feature name list
cat_cols = ["Exercise Frequency", "Diet", "Symptoms"]
num_cols = ["Age", "BMI", "Stress Level", "Sleep Hours", "Cycle Length", "Period Length"]

ohe_feature_names = preprocess.named_transformers_["cat"].get_feature_names_out(cat_cols)
full_feature_names = np.concatenate([num_cols, ohe_feature_names])

# Top contributors (sorted)
importance = sorted(
    zip(full_feature_names, shap_values),
    key=lambda x: abs(x[1]),
    reverse=True
)

# ---------------------- HUMAN READABLE EXPLANATION ----------------------
human_explanation = "\nTop contributing factors:\n"
for feat, val in importance[:8]:
    direction = "increases" if val > 0 else "decreases"
    human_explanation += f"- {feat}: {direction} predicted cycle start timing by {abs(val):.2f} days\n"

print("\n============= HUMAN EXPLANATION =============")
print(human_explanation)

# ---------------------- LLM-FRIENDLY STRUCTURED OUTPUT ----------------------
llm_friendly = {
    "prediction_days_until_next_cycle": float(pred_days),
    "top_feature_contributions": [
        {
            "feature": feat,
            "effect_days": float(val),
            "direction": "increase" if val > 0 else "decrease"
        }
        for feat, val in importance[:10]
    ],
    "raw_shap_vector": {feat: float(val) for feat, val in zip(full_feature_names, shap_values)}
}

print("\n============= LLM OUTPUT JSON =============")
print(json.dumps(llm_friendly, indent=4))

# Save JSON for your agentic pipeline
with open("explanation_output.json", "w") as f:
    json.dump(llm_friendly, f, indent=4)

print("\nSaved explanation_output.json for LLM pipelines.")

# ---------------------- OPTIONAL: SAVE FORCE PLOT ----------------------
plt.figure()
shap.force_plot(
    explainer.expected_value,
    shap_values,
    feature_names=full_feature_names,
    matplotlib=True
)
plt.savefig("force_plot.png", bbox_inches='tight')
plt.close()

print("Force plot saved as force_plot.png")
