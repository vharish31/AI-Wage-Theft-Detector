from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List

from app.services.ml_wage_service import (
    predict_wage_theft_ml,
    get_model_metadata,
    retrain_models
)

router = APIRouter(prefix="/api/ml", tags=["Machine Learning Engine"])


class MLPredictionRequest(BaseModel):
    State: Optional[str] = Field(default="Tamil Nadu", description="State name")
    District: Optional[str] = Field(default="Chennai", description="District or City")
    Occupation: Optional[str] = Field(default="Construction Worker", description="Job title / occupation")
    Industry: Optional[str] = Field(default="Construction", description="Industry sector")
    Skill_Level: Optional[str] = Field(default="Skilled", description="Skill level (Unskilled, Semi-skilled, Skilled, Highly Skilled)")
    Employment_Type: Optional[str] = Field(default="Daily Wage", description="Employment arrangement")
    Gender: Optional[str] = Field(default="Male", description="Gender")
    Age: Optional[int] = Field(default=32, description="Age in years")
    Experience_Years: Optional[int] = Field(default=5, description="Years of work experience")
    Working_Days: Optional[int] = Field(default=26, description="Working days per month")
    Hours_Per_Day: Optional[float] = Field(default=8.0, description="Standard daily hours")
    Total_Hours_Worked: Optional[float] = Field(default=208.0, description="Total monthly hours worked")
    Overtime_Hours: Optional[float] = Field(default=10.0, description="Overtime hours worked")
    Weekend_Hours: Optional[float] = Field(default=0.0, description="Weekend hours worked")
    Night_Shift: Optional[str] = Field(default="No", description="Night shift worked (Yes/No)")
    Minimum_Hourly_Wage: Optional[float] = Field(default=106.25, description="Statutory hourly wage")
    Actual_Hourly_Wage: Optional[float] = Field(default=85.00, description="Actual received hourly wage")
    Expected_Salary: Optional[float] = Field(default=22100.0, description="Expected total salary")
    Actual_Salary: Optional[float] = Field(default=17680.0, description="Actual received salary")
    Bonus: Optional[float] = Field(default=0.0, description="Bonus received")
    Legal_Deductions: Optional[float] = Field(default=500.0, description="Valid legal deductions")
    Illegal_Deductions: Optional[float] = Field(default=1500.0, description="Unauthorized illegal deductions")
    PF_Deduction: Optional[float] = Field(default=0.0, description="PF contribution deduction")
    ESI_Deduction: Optional[float] = Field(default=0.0, description="ESI insurance deduction")
    Attendance_Percentage: Optional[float] = Field(default=100.0, description="Attendance %")
    Leaves_Taken: Optional[int] = Field(default=0, description="Leaves taken")
    Contract_Type: Optional[str] = Field(default="Daily", description="Contract type")
    Company_Size: Optional[str] = Field(default="Small", description="Company size")
    Company_Type: Optional[str] = Field(default="Private", description="Company classification")
    Payslip_Provided: Optional[str] = Field(default="No", description="Payslip issued (Yes/No)")
    Bank_Payment: Optional[str] = Field(default="No", description="Paid via Bank transfer (Yes/No)")
    Overtime_Paid: Optional[str] = Field(default="No", description="Overtime paid properly (Yes/No)")
    Minimum_Wage_Violation: Optional[str] = Field(default="Yes", description="Below minimum wage (Yes/No)")
    Overtime_Violation: Optional[str] = Field(default="Yes", description="Unpaid overtime present (Yes/No)")
    Illegal_Deduction_Violation: Optional[str] = Field(default="Yes", description="Illegal deductions made (Yes/No)")
    Late_Payment: Optional[str] = Field(default="Yes", description="Payment delayed (Yes/No)")
    Salary_Delay_Days: Optional[int] = Field(default=15, description="Days salary was delayed")
    Complaint_History: Optional[str] = Field(default="No", description="Prior complaints logged (Yes/No)")
    Union_Member: Optional[str] = Field(default="No", description="Union membership status (Yes/No)")


@router.get("/status", summary="Get Machine Learning Model & Dataset Status")
async def get_ml_status():
    """Returns metadata for the trained ML model, dataset files detected, and evaluation metrics."""
    return get_model_metadata()


@router.post("/predict", summary="Predict Wage Theft & Risk Score using Machine Learning")
async def predict_ml(request: MLPredictionRequest):
    """
    Accepts worker shift & payment profile data and predicts:
    - Wage Theft Occurrence (Yes/No with probability %)
    - ML Risk Score (0-100 continuous score)
    - Risk Severity Level (Low, Medium, High, Critical)
    - Theft Type Pattern
    - Top Contributing Risk Factors
    """
    try:
        data_dict = request.model_dump()
        result = predict_wage_theft_ml(data_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Prediction Error: {str(e)}")


@router.post("/train", summary="Trigger Re-training across all Dataset Parts")
async def train_ml(background_tasks: BackgroundTasks):
    """Triggers dataset aggregation and re-trains models on all dataset_part*.csv files."""
    try:
        metadata = retrain_models()
        return {
            "status": "Success",
            "message": "ML models trained and reloaded successfully.",
            "metadata": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Training Failure: {str(e)}")
