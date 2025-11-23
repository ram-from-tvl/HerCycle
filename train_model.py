#!/usr/bin/env python3
"""
HerCycle ML Model Training Script
Trains a Random Forest model to predict next cycle start date with SHAP explainability.
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor
import shap
import joblib
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

print("🚀 Starting HerCycle ML Model Training...")
print("=" * 50)

# ================= LOAD REALISTIC DATASET =======================
print("📊 Loading dataset...")
df = pd.read_csv("realistic_menstrual_cycle_dataset.csv")

print(f"Dataset shape: {df.shape}")
print(f"Columns: {list(df.columns)}")

# ================= DATA PREPROCESSING =======================
print("\n🔧 Preprocessing data...")

# Convert dates
df["Cycle Start Date"] = pd.to_datetime(df["Cycle Start Date"])
df["Next Cycle Start Date"] = pd.to_datetime(df["Next Cycle Start Date"])

# Create target: days until next cycle
df["Target_NextCycleDays"] = (df["Next Cycle Start Date"] - df["Cycle Start Date"]).dt.days

# Remove invalid targets
df = df.dropna(subset=["Target_NextCycleDays"])
df = df[(df["Target_NextCycleDays"] > 15) & (df["Target_NextCycleDays"] < 45)]  # Reasonable cycle lengths

print(f"After preprocessing: {df.shape[0]} samples")
print(f"Target range: {df['Target_NextCycleDays'].min():.1f} - {df['Target_NextCycleDays'].max():.1f} days")

# ================= FEATURE ENGINEERING =======================
features = [
    "Age", "BMI", "Stress Level", "Exercise Frequency",
    "Sleep Hours", "Diet", "Cycle Length", "Period Length", "Symptoms"
]

X = df[features].copy()
y = df["Target_NextCycleDays"].copy()

# Check for missing values
print(f"\nMissing values per feature:")
for col in features:
    missing = X[col].isna().sum()
    if missing > 0:
        print(f"  {col}: {missing}")

# Fill missing values if any
X = X.fillna({
    "Age": X["Age"].median(),
    "BMI": X["BMI"].median(),
    "Stress Level": X["Stress Level"].median(),
    "Sleep Hours": X["Sleep Hours"].median(),
    "Cycle Length": X["Cycle Length"].median(),
    "Period Length": X["Period Length"].median(),
    "Exercise Frequency": "Moderate",
    "Diet": "Balanced",
    "Symptoms": "None"
})

# Separate categorical and numerical features
categorical_cols = ["Exercise Frequency", "Diet", "Symptoms"]
numeric_cols = [f for f in features if f not in categorical_cols]

print(f"\nCategorical features: {categorical_cols}")
print(f"Numeric features: {numeric_cols}")

# ================= PREPROCESSING PIPELINE =======================
preprocess = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore", drop="first"), categorical_cols),
    ("num", StandardScaler(), numeric_cols)
], remainder="drop")

# ================= MODEL PIPELINE =======================
model = Pipeline([
    ("preprocess", preprocess),
    ("rf", RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    ))
])

# ================= TRAIN/TEST SPLIT =======================
print("\n🎯 Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=pd.cut(y, bins=5)
)

print(f"Training set: {X_train.shape[0]} samples")
print(f"Test set: {X_test.shape[0]} samples")

# ================= TRAIN MODEL =======================
print("\n🤖 Training Random Forest model...")
model.fit(X_train, y_train)

# ================= EVALUATE MODEL =======================
print("\n📈 Evaluating model...")

# Predictions
train_preds = model.predict(X_train)
test_preds = model.predict(X_test)

# Metrics
train_mae = mean_absolute_error(y_train, train_preds)
test_mae = mean_absolute_error(y_test, test_preds)
train_r2 = r2_score(y_train, train_preds)
test_r2 = r2_score(y_test, test_preds)

print(f"Training MAE: {train_mae:.2f} days")
print(f"Test MAE: {test_mae:.2f} days")
print(f"Training R²: {train_r2:.3f}")
print(f"Test R²: {test_r2:.3f}")

# ================= FEATURE IMPORTANCE =======================
rf_model = model.named_steps["rf"]
preprocess_fitted = model.named_steps["preprocess"]

# Get feature names after preprocessing
cat_feature_names = preprocess_fitted.named_transformers_["cat"].get_feature_names_out(categorical_cols)
all_feature_names = np.concatenate([numeric_cols, cat_feature_names])

# Feature importance from Random Forest
importances = rf_model.feature_importances_
feature_importance = pd.DataFrame({
    'feature': all_feature_names,
    'importance': importances
}).sort_values('importance', ascending=False)

print(f"\n📊 Top 10 Feature Importances:")
for idx, row in feature_importance.head(10).iterrows():
    print(f"  {row['feature']}: {row['importance']:.4f}")

# ================= SAVE MODEL =======================
print("\n💾 Saving trained model...")
model_path = "final_trained_cycle_model.pkl"
joblib.dump(model, model_path)
print(f"✅ Model saved to: {model_path}")

# ================= SHAP EXPLAINABILITY =======================
print("\n🔍 Computing SHAP explanations...")

# Sample for SHAP (to avoid memory issues)
sample_size = min(500, X_test.shape[0])
X_sample = X_test.sample(n=sample_size, random_state=42)
y_sample = y_test.loc[X_sample.index]

# Transform sample
X_sample_transformed = preprocess_fitted.transform(X_sample)

# Create SHAP explainer
explainer = shap.TreeExplainer(rf_model)
shap_values = explainer.shap_values(X_sample_transformed)

print(f"SHAP values computed for {sample_size} samples")
print(f"SHAP values shape: {shap_values.shape}")

# Save SHAP summary plot
plt.figure(figsize=(12, 8))
shap.summary_plot(shap_values, X_sample_transformed, feature_names=all_feature_names, show=False)
plt.title("SHAP Feature Importance - HerCycle Model")
plt.tight_layout()
plt.savefig("shap_summary.png", dpi=300, bbox_inches='tight')
plt.close()
print("✅ SHAP summary plot saved: shap_summary.png")

# ================= TEST INFERENCE =======================
print("\n🧪 Testing inference...")

# Create test sample
test_features = {
    "Age": 25,
    "BMI": 22.5,
    "Stress Level": 3,
    "Exercise Frequency": "Moderate",
    "Sleep Hours": 7.0,
    "Diet": "Balanced",
    "Cycle Length": 28,
    "Period Length": 5,
    "Symptoms": "Cramps"
}

# Create DataFrame and predict
test_df = pd.DataFrame([test_features])
prediction = model.predict(test_df)[0]

# Get SHAP values for this prediction
test_transformed = preprocess_fitted.transform(test_df)
test_shap = explainer.shap_values(test_transformed)[0]

# Top contributing features
feature_contributions = list(zip(all_feature_names, test_shap))
feature_contributions.sort(key=lambda x: abs(x[1]), reverse=True)

print(f"\nSample prediction: {prediction:.1f} days until next cycle")
print("Top 5 contributing features:")
for feat, contrib in feature_contributions[:5]:
    direction = "↑" if contrib > 0 else "↓"
    print(f"  {feat}: {direction} {abs(contrib):.3f}")

# ================= SUMMARY =======================
print("\n" + "=" * 50)
print("🎉 MODEL TRAINING COMPLETE!")
print(f"✅ Final Test MAE: {test_mae:.2f} days")
print(f"✅ Final Test R²: {test_r2:.3f}")
print(f"✅ Model saved: {model_path}")
print(f"✅ SHAP plot saved: shap_summary.png")
print("=" * 50)

# Save training summary
summary = {
    "test_mae": test_mae,
    "test_r2": test_r2,
    "feature_importance": feature_importance.to_dict('records'),
    "model_path": model_path,
    "sample_prediction": {
        "input": test_features,
        "prediction": prediction,
        "top_features": feature_contributions[:5]
    }
}

import json
with open("training_summary.json", "w") as f:
    json.dump(summary, f, indent=2, default=str)
print("📄 Training summary saved: training_summary.json")