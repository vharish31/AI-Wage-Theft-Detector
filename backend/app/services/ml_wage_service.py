import os
import json
import logging
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional

from app.ml.train_model import train_ml_pipeline, MODEL_DIR
from app.ml.dataset_loader import NUMERICAL_FEATURES, CATEGORICAL_FEATURES

logger = logging.getLogger(__name__)

# Global cache for loaded model pipeline
_CACHED_PIPELINE = None
_CACHED_METADATA = None


def get_pipeline_bundle() -> Optional[Dict[str, Any]]:
    """Loads and caches trained ML pipeline bundle."""
    global _CACHED_PIPELINE
    if _CACHED_PIPELINE is not None:
        return _CACHED_PIPELINE

    bundle_path = os.path.join(MODEL_DIR, "wage_theft_pipeline.joblib")
    if os.path.exists(bundle_path):
        try:
            _CACHED_PIPELINE = joblib.load(bundle_path)
            logger.info("Successfully loaded ML model pipeline into memory.")
            return _CACHED_PIPELINE
        except Exception as e:
            logger.error(f"Error loading ML model pipeline bundle: {str(e)}")
    return None


def get_model_metadata() -> Dict[str, Any]:
    """Loads model metadata from JSON."""
    global _CACHED_METADATA
    metadata_path = os.path.join(MODEL_DIR, "model_metadata.json")
    if os.path.exists(metadata_path):
        try:
            with open(metadata_path, "r", encoding="utf-8") as f:
                _CACHED_METADATA = json.load(f)
                return _CACHED_METADATA
        except Exception as e:
            logger.error(f"Error reading model metadata: {str(e)}")

    return {
        "model_status": "Not Trained",
        "message": "Model artifacts not found. Please trigger model training."
    }


def reload_model_cache():
    """Flushes cache to force loading newly trained artifacts."""
    global _CACHED_PIPELINE, _CACHED_METADATA
    _CACHED_PIPELINE = None
    _CACHED_METADATA = None
    get_pipeline_bundle()
    get_model_metadata()


def retrain_models() -> Dict[str, Any]:
    """Triggers dataset aggregation, training, and reloads model cache."""
    metadata = train_ml_pipeline()
    reload_model_cache()
    return metadata


def _compute_risk_level(score: float) -> str:
    if score >= 50.0:
        return "Critical Risk"
    elif score >= 25.0:
        return "High Risk"
    elif score >= 10.0:
        return "Medium Risk"
    else:
        return "Low Risk"


def predict_wage_theft_ml(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Predicts wage theft likelihood, risk score, and theft type from worker input features.
    Accepts both standard and customized key-value feature representations.
    """
    bundle = get_pipeline_bundle()
    metadata = get_model_metadata()

    if not bundle:
        # Fallback if model is not trained yet
        return {
            "is_ml_trained": False,
            "message": "ML model not trained yet. Falling back to statutory rule-based engine.",
            "wage_theft_predicted": None,
            "predicted_risk_score": 0.0
        }

    feature_names = bundle["feature_names"]
    cat_mappings = bundle["cat_mappings"]
    num_medians = bundle["num_medians"]
    scaler = bundle["scaler"]
    wt_clf = bundle["wage_theft_clf"]
    rs_reg = bundle["risk_score_reg"]
    tt_clf = bundle["theft_type_clf"]

    # Map input data into feature row
    row = []
    input_normalized = {str(k).strip().lower(): v for k, v in input_data.items()}

    for feat in feature_names:
        feat_key = feat.lower()
        val = input_normalized.get(feat_key, None)

        if feat in NUMERICAL_FEATURES:
            if val is not None:
                try:
                    num_val = float(val)
                except (ValueError, TypeError):
                    num_val = num_medians.get(feat, 0.0)
            else:
                num_val = num_medians.get(feat, 0.0)
            row.append(num_val)

        elif feat in CATEGORICAL_FEATURES:
            mapping = cat_mappings.get(feat, {})
            val_str = str(val).strip() if val is not None else ""
            
            # Match exact or case-insensitive string in mapping
            matched_code = 0
            if val_str in mapping:
                matched_code = mapping[val_str]
            else:
                for k, code in mapping.items():
                    if k.lower() == val_str.lower():
                        matched_code = code
                        break

            row.append(matched_code)
        else:
            row.append(0.0)

    # Scale feature vector using DataFrame to preserve feature names
    X_sample_df = pd.DataFrame([row], columns=feature_names)
    X_scaled = scaler.transform(X_sample_df)


    # Predict outputs
    wt_pred = int(wt_clf.predict(X_scaled)[0])
    wt_proba = float(wt_clf.predict_proba(X_scaled)[0][1]) * 100.0
    predicted_risk_score = max(0.0, min(100.0, float(rs_reg.predict(X_scaled)[0])))
    predicted_theft_type = str(tt_clf.predict(X_scaled)[0])

    # Top contributing risk factors
    importances = wt_clf.feature_importances_
    top_indices = np.argsort(importances)[::-1][:5]
    top_factors = [
        {
            "feature": feature_names[idx],
            "value": input_data.get(feature_names[idx], num_medians.get(feature_names[idx], "Standard")),
            "importance_weight": round(float(importances[idx]), 3)
        }
        for idx in top_indices
    ]

    return {
        "is_ml_trained": True,
        "wage_theft_predicted": bool(wt_pred == 1),
        "wage_theft_probability_pct": round(wt_proba, 1),
        "predicted_risk_score": round(predicted_risk_score, 1),
        "predicted_risk_level": _compute_risk_level(predicted_risk_score),
        "predicted_theft_type": predicted_theft_type,
        "model_confidence": f"{round(max(wt_proba, 100 - wt_proba), 1)}%",
        "top_risk_factors": top_factors,
        "dataset_summary": {
            "total_records_trained": metadata.get("dataset_summary", {}).get("total_records", 0),
            "dataset_files_loaded": metadata.get("dataset_summary", {}).get("dataset_files", []),
            "model_accuracy": metadata.get("metrics", {}).get("wage_theft_classifier", {}).get("accuracy", 0.0)
        }
    }
