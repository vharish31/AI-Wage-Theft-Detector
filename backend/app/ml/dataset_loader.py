import os
import glob
import logging
import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any, List

logger = logging.getLogger(__name__)

# Search paths for datasets
DATASET_DIRS = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "datasets")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "datasets"))
]

NUMERICAL_FEATURES = [
    "Age", "Experience_Years", "Working_Days", "Hours_Per_Day", 
    "Total_Hours_Worked", "Overtime_Hours", "Weekend_Hours",
    "Minimum_Hourly_Wage", "Actual_Hourly_Wage", "Expected_Salary",
    "Actual_Salary", "Bonus", "Legal_Deductions", "Illegal_Deductions",
    "PF_Deduction", "ESI_Deduction", "Attendance_Percentage",
    "Leaves_Taken", "Salary_Delay_Days"
]

CATEGORICAL_FEATURES = [
    "State", "District", "Occupation", "Industry", "Skill_Level",
    "Employment_Type", "Gender", "Night_Shift", "Contract_Type",
    "Company_Size", "Company_Type", "Payslip_Provided", "Bank_Payment",
    "Overtime_Paid", "Minimum_Wage_Violation", "Overtime_Violation",
    "Illegal_Deduction_Violation", "Late_Payment", "Complaint_History", "Union_Member"
]

TARGET_BINARY = "Wage_Theft"
TARGET_RISK = "Risk_Score"
TARGET_TYPE = "Theft_Type"


def get_all_dataset_files() -> List[str]:
    """Finds all dataset_part*.csv files across designated directories, deduplicated by filename."""
    files_dict = {}
    for d in DATASET_DIRS:
        if os.path.exists(d):
            pattern = os.path.join(d, "dataset_part*.csv")
            for filepath in glob.glob(pattern):
                filename = os.path.basename(filepath)
                if filename not in files_dict:
                    files_dict[filename] = os.path.abspath(filepath)
    return [files_dict[k] for k in sorted(files_dict.keys())]



def load_combined_dataset() -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Loads and concatenates all discovered dataset parts."""
    files = get_all_dataset_files()
    if not files:
        raise FileNotFoundError(f"No dataset files matching 'dataset_part*.csv' found in {DATASET_DIRS}")

    dfs = []
    file_info = []
    for f in files:
        try:
            df_part = pd.read_csv(f)
            dfs.append(df_part)
            file_info.append({
                "filename": os.path.basename(f),
                "path": f,
                "rows": len(df_part)
            })
            logger.info(f"Loaded dataset file '{os.path.basename(f)}' with {len(df_part)} rows.")
        except Exception as e:
            logger.error(f"Failed to read dataset file '{f}': {str(e)}")

    if not dfs:
        raise ValueError("Could not load any valid dataset files.")

    combined_df = pd.concat(dfs, ignore_index=True)
    metadata = {
        "dataset_files": [fi["filename"] for fi in file_info],
        "total_files": len(file_info),
        "total_records": len(combined_df),
        "columns": list(combined_df.columns),
        "file_details": file_info
    }
    return combined_df, metadata


def prepare_features_and_targets(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Cleans raw DataFrame and prepares feature matrix X and targets y.
    Handles missing values and builds categorical encoding mappings.
    """
    data = df.copy()

    # Targets
    y_wage_theft = (data[TARGET_BINARY].astype(str).str.strip().str.lower() == "yes").astype(int)
    y_risk_score = pd.to_numeric(data[TARGET_RISK], errors='coerce').fillna(0.0)
    y_theft_type = data[TARGET_TYPE].astype(str).str.strip().fillna("None")

    # Build feature DataFrame
    X_df = pd.DataFrame()

    # Process Numerical features
    num_medians = {}
    for col in NUMERICAL_FEATURES:
        if col in data.columns:
            s = pd.to_numeric(data[col], errors='coerce')
            median_val = s.median() if not s.isna().all() else 0.0
            num_medians[col] = float(median_val)
            X_df[col] = s.fillna(median_val)
        else:
            num_medians[col] = 0.0
            X_df[col] = 0.0

    # Process Categorical features
    cat_mappings = {}
    for col in CATEGORICAL_FEATURES:
        if col in data.columns:
            s = data[col].astype(str).str.strip()
            unique_vals = sorted(s.unique().tolist())
            mapping = {val: idx for idx, val in enumerate(unique_vals)}
            cat_mappings[col] = mapping
            X_df[col] = s.map(mapping).fillna(0).astype(int)
        else:
            cat_mappings[col] = {"Unknown": 0}
            X_df[col] = 0

    return {
        "X": X_df,
        "y_wage_theft": y_wage_theft,
        "y_risk_score": y_risk_score,
        "y_theft_type": y_theft_type,
        "num_medians": num_medians,
        "cat_mappings": cat_mappings,
        "feature_names": list(X_df.columns)
    }
