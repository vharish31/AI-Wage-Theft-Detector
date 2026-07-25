import os
import json
import time
import datetime
import logging
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, f1_score, mean_absolute_error, r2_score

from app.ml.dataset_loader import (
    load_combined_dataset,
    prepare_features_and_targets,
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "models"))


def train_ml_pipeline() -> dict:
    """
    Loads all available dataset_part*.csv files, trains 3 ML models,
    evaluates performance, and serializes trained artifacts.
    """
    logger.info("Starting ML Pipeline Model Training...")
    start_time = time.time()
    
    os.makedirs(MODEL_DIR, exist_ok=True)

    # 1. Load dataset parts
    combined_df, dataset_meta = load_combined_dataset()
    logger.info(f"Total dataset records: {dataset_meta['total_records']} from {dataset_meta['total_files']} files ({dataset_meta['dataset_files']})")

    # 2. Prepare features and targets
    data_bundle = prepare_features_and_targets(combined_df)
    X = data_bundle["X"]
    y_wage_theft = data_bundle["y_wage_theft"]
    y_risk_score = data_bundle["y_risk_score"]
    y_theft_type = data_bundle["y_theft_type"]

    # 3. Train/Test Split (80% Train, 20% Test)
    X_train, X_test, y_wt_train, y_wt_test, y_rs_train, y_rs_test, y_tt_train, y_tt_test = train_test_split(
        X, y_wage_theft, y_risk_score, y_theft_type,
        test_size=0.2, random_state=42, stratify=y_wage_theft
    )

    # 4. Feature Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 5. Train Model 1: Wage Theft Binary Classifier
    logger.info("Training Wage Theft Binary Classifier...")
    wage_theft_clf = RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
    wage_theft_clf.fit(X_train_scaled, y_wt_train)
    wt_preds = wage_theft_clf.predict(X_test_scaled)
    wt_acc = float(accuracy_score(y_wt_test, wt_preds))
    wt_f1 = float(f1_score(y_wt_test, wt_preds, zero_division=0))

    # 6. Train Model 2: Risk Score Regressor
    logger.info("Training Risk Score Regressor...")
    risk_score_reg = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
    risk_score_reg.fit(X_train_scaled, y_rs_train)
    rs_preds = risk_score_reg.predict(X_test_scaled)
    rs_mae = float(mean_absolute_error(y_rs_test, rs_preds))
    rs_r2 = float(r2_score(y_rs_test, rs_preds))

    # 7. Train Model 3: Theft Type Classifier
    logger.info("Training Theft Type Classifier...")
    theft_type_clf = RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1)
    theft_type_clf.fit(X_train_scaled, y_tt_train)
    tt_preds = theft_type_clf.predict(X_test_scaled)
    tt_acc = float(accuracy_score(y_tt_test, tt_preds))
    tt_f1 = float(f1_score(y_tt_test, tt_preds, average='macro', zero_division=0))

    # 8. Feature Importance Extraction
    importances = wage_theft_clf.feature_importances_
    feature_names = data_bundle["feature_names"]
    top_features = sorted(
        [{"feature": name, "importance": round(float(imp), 4)} for name, imp in zip(feature_names, importances)],
        key=lambda x: x["importance"],
        reverse=True
    )

    elapsed_sec = round(time.time() - start_time, 2)

    # 9. Build and Save Pipeline Bundle
    pipeline_bundle = {
        "wage_theft_clf": wage_theft_clf,
        "risk_score_reg": risk_score_reg,
        "theft_type_clf": theft_type_clf,
        "scaler": scaler,
        "cat_mappings": data_bundle["cat_mappings"],
        "num_medians": data_bundle["num_medians"],
        "feature_names": data_bundle["feature_names"],
        "classes_theft_type": theft_type_clf.classes_.tolist()
    }

    bundle_path = os.path.join(MODEL_DIR, "wage_theft_pipeline.joblib")
    joblib.dump(pipeline_bundle, bundle_path)
    logger.info(f"Saved trained pipeline bundle to '{bundle_path}'.")

    # 10. Save Metadata JSON
    metadata = {
        "trained_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "training_time_seconds": elapsed_sec,
        "dataset_summary": dataset_meta,
        "metrics": {
            "wage_theft_classifier": {
                "accuracy": round(wt_acc, 4),
                "f1_score": round(wt_f1, 4)
            },
            "risk_score_regressor": {
                "mae": round(rs_mae, 4),
                "r2_score": round(rs_r2, 4)
            },
            "theft_type_classifier": {
                "accuracy": round(tt_acc, 4),
                "f1_score_macro": round(tt_f1, 4)
            }
        },
        "top_features": top_features[:10],
        "model_status": "Ready",
        "bundle_file": "wage_theft_pipeline.joblib"
    }

    metadata_path = os.path.join(MODEL_DIR, "model_metadata.json")
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    logger.info(f"Saved model metadata to '{metadata_path}'.")

    logger.info(f"ML Pipeline Training Complete in {elapsed_sec}s! Accuracy: {wt_acc:.2%}")
    return metadata


if __name__ == "__main__":
    train_ml_pipeline()
