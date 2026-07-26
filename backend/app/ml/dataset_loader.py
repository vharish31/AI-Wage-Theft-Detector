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
    """Finds all .csv dataset files across designated directories, deduplicated by filename."""
    files_dict = {}
    for d in DATASET_DIRS:
        if os.path.exists(d):
            pattern = os.path.join(d, "*.csv")
            for filepath in glob.glob(pattern):
                filename = os.path.basename(filepath)
                if filename not in files_dict:
                    files_dict[filename] = os.path.abspath(filepath)
    return [files_dict[k] for k in sorted(files_dict.keys())]


def harmonize_dataframe(df: pd.DataFrame, filename: str) -> pd.DataFrame:
    """Harmonizes non-standard CSVs (e.g. payroll datasets) into the standard Wage Theft schema."""
    df_clean = df.copy()

    # Standard dataset part already matching schema
    if TARGET_BINARY in df_clean.columns and TARGET_RISK in df_clean.columns:
        return df_clean

    logger.info(f"Harmonizing non-standard schema for dataset file '{filename}'...")

    # Payroll CSV Harmonization (e.g. train-test-payroll.csv, payroll.csv, processed-payroll.csv)
    if "REGULAR_PAY" in df_clean.columns:
        reg_pay = pd.to_numeric(df_clean["REGULAR_PAY"], errors='coerce').fillna(0.0)
        ot_pay = pd.to_numeric(df_clean.get("OVERTIME_PAY", 0), errors='coerce').fillna(0.0)
        other_pay = pd.to_numeric(df_clean.get("ALL_OTHER_PAY", 0), errors='coerce').fillna(0.0)
        benefit_pay = pd.to_numeric(df_clean.get("BENEFIT_PAY", 0), errors='coerce').fillna(0.0)

        df_clean["Actual_Salary"] = reg_pay + ot_pay + other_pay
        
        # Determine benchmark expected salary by job class/title
        if "JOB_CLASS_PGRADE" in df_clean.columns:
            grp = df_clean.groupby("JOB_CLASS_PGRADE")["Actual_Salary"].transform("median")
            df_clean["Expected_Salary"] = grp.fillna(df_clean["Actual_Salary"].median())
        else:
            df_clean["Expected_Salary"] = df_clean["Actual_Salary"].median()

        # Risk score calculation
        exp_sal = df_clean["Expected_Salary"]
        act_sal = df_clean["Actual_Salary"]
        diff = exp_sal - act_sal
        
        risk_scores = np.where(exp_sal > 0, np.maximum(0, (diff / exp_sal) * 100.0), 0.0)
        df_clean[TARGET_RISK] = np.clip(risk_scores, 0.0, 100.0)
        df_clean[TARGET_BINARY] = np.where(df_clean[TARGET_RISK] >= 15.0, "Yes", "No")

        is_theft = df_clean[TARGET_RISK] >= 15.0
        no_ot = (ot_pay == 0)
        df_clean[TARGET_TYPE] = np.where(
            ~is_theft, "None",
            np.where(no_ot, "Unpaid Overtime", "Minimum Wage Violation")
        )


        # Standard features mapping
        df_clean["Occupation"] = df_clean["JOB_TITLE"].astype(str) if "JOB_TITLE" in df_clean.columns else "Payroll Employee"
        df_clean["State"] = "State Jurisdiction"
        df_clean["District"] = "District Jurisdiction"
        df_clean["Industry"] = "Public / Corporate Sector"
        df_clean["Skill_Level"] = "Skilled"
        df_clean["Employment_Type"] = df_clean["EMPLOYMENT_TYPE"].astype(str) if "EMPLOYMENT_TYPE" in df_clean.columns else "Full Time"
        df_clean["Gender"] = np.where(df_clean.get("GENDER", 0) == 1, "Female", "Male")

        df_clean["Age"] = 35
        df_clean["Experience_Years"] = 8
        df_clean["Working_Days"] = 26
        df_clean["Hours_Per_Day"] = 8.0
        df_clean["Total_Hours_Worked"] = 208.0
        df_clean["Overtime_Hours"] = np.where(ot_pay > 0, 15.0, 0.0)
        df_clean["Weekend_Hours"] = 0.0
        df_clean["Night_Shift"] = "No"
        df_clean["Minimum_Hourly_Wage"] = (df_clean["Expected_Salary"] / 208.0).round(2)
        df_clean["Actual_Hourly_Wage"] = (df_clean["Actual_Salary"] / 208.0).round(2)
        df_clean["Bonus"] = other_pay
        df_clean["Legal_Deductions"] = benefit_pay
        df_clean["Illegal_Deductions"] = np.where(df_clean[TARGET_RISK] >= 15.0, diff.clip(lower=0), 0.0)
        df_clean["PF_Deduction"] = 0.0
        df_clean["ESI_Deduction"] = 0.0
        df_clean["Attendance_Percentage"] = 100.0
        df_clean["Leaves_Taken"] = 0
        df_clean["Contract_Type"] = "Monthly"
        df_clean["Company_Size"] = "Large"
        df_clean["Company_Type"] = "Corporate"
        df_clean["Payslip_Provided"] = "Yes"
        df_clean["Bank_Payment"] = "Yes"
        df_clean["Overtime_Paid"] = np.where(ot_pay > 0, "Yes", "No")
        df_clean["Minimum_Wage_Violation"] = np.where(act_sal < exp_sal * 0.85, "Yes", "No")
        df_clean["Overtime_Violation"] = np.where((ot_pay == 0) & (df_clean[TARGET_RISK] > 15), "Yes", "No")
        df_clean["Illegal_Deduction_Violation"] = np.where(df_clean[TARGET_RISK] > 25, "Yes", "No")
        df_clean["Late_Payment"] = "No"
        df_clean["Salary_Delay_Days"] = 0
        df_clean["Complaint_History"] = "No"
    # Government Labour Law Checker Dataset Harmonization (e.g. government_labour_law_checker_dataset_5000.csv)
    elif "min_wage_day" in df_clean.columns and "min_wage_month" in df_clean.columns:
        df_clean["State"] = df_clean["state"].astype(str)
        df_clean["District"] = "Central District"
        df_clean["Occupation"] = df_clean["job_category"].astype(str)
        df_clean["Industry"] = "Statutory Benchmark Sector"
        df_clean["Skill_Level"] = df_clean["skill_level"].astype(str)
        df_clean["Employment_Type"] = "Full Time"
        df_clean["Gender"] = "All"
        df_clean["Age"] = 35
        df_clean["Experience_Years"] = 5
        df_clean["Working_Days"] = 26
        df_clean["Hours_Per_Day"] = pd.to_numeric(df_clean.get("max_hours_day", 8), errors='coerce').fillna(8.0)
        df_clean["Total_Hours_Worked"] = df_clean["Hours_Per_Day"] * 26.0
        df_clean["Overtime_Hours"] = 0.0
        df_clean["Weekend_Hours"] = 0.0
        df_clean["Night_Shift"] = "No"

        daily_wage = pd.to_numeric(df_clean["min_wage_day"], errors='coerce').fillna(0.0)
        monthly_wage = pd.to_numeric(df_clean["min_wage_month"], errors='coerce').fillna(0.0)
        hours_day = df_clean["Hours_Per_Day"].replace(0, 8.0)

        df_clean["Minimum_Hourly_Wage"] = (daily_wage / hours_day).round(2)
        df_clean["Actual_Hourly_Wage"] = df_clean["Minimum_Hourly_Wage"]
        df_clean["Expected_Salary"] = monthly_wage
        df_clean["Actual_Salary"] = monthly_wage
        df_clean["Bonus"] = 0.0
        df_clean["Legal_Deductions"] = 0.0
        df_clean["Illegal_Deductions"] = 0.0
        df_clean["PF_Deduction"] = 0.0
        df_clean["ESI_Deduction"] = 0.0
        df_clean["Attendance_Percentage"] = 100.0
        df_clean["Leaves_Taken"] = 0
        df_clean["Salary_Delay_Days"] = 0
        df_clean["Contract_Type"] = "Monthly"
        df_clean["Company_Size"] = "Medium"
        df_clean["Company_Type"] = "Statutory"
        df_clean["Payslip_Provided"] = "Yes"
        df_clean["Bank_Payment"] = "Yes"
        df_clean["Overtime_Paid"] = "Yes"
        df_clean["Minimum_Wage_Violation"] = "No"
        df_clean["Overtime_Violation"] = "No"
        df_clean["Illegal_Deduction_Violation"] = "No"
        df_clean["Late_Payment"] = "No"
        df_clean["Complaint_History"] = "No"
        df_clean["Union_Member"] = "No"

        df_clean[TARGET_BINARY] = "No"
        df_clean[TARGET_RISK] = 0.0
        df_clean[TARGET_TYPE] = "None"

    return df_clean


def load_combined_dataset() -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Loads and concatenates all discovered dataset files."""
    files = get_all_dataset_files()
    if not files:
        raise FileNotFoundError(f"No CSV dataset files found in {DATASET_DIRS}")

    dfs = []
    file_info = []
    for f in files:
        filename = os.path.basename(f)
        try:
            df_part = pd.read_csv(f, low_memory=False)


            original_len = len(df_part)
            df_harmonized = harmonize_dataframe(df_part, filename)
            dfs.append(df_harmonized)

            file_info.append({
                "filename": filename,
                "path": f,
                "rows": len(df_harmonized),
                "original_rows": original_len
            })
            logger.info(f"Loaded dataset '{filename}' with full {original_len:,} rows.")

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
