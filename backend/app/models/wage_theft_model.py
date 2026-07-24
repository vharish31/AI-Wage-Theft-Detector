from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class WageTheftAnalysisRequest(BaseModel):
    job_type: Optional[str] = Field(default="Delivery Partner", example="Delivery Partner")
    orders_completed: Optional[float] = Field(default=25.0, example=25.0)
    rate_per_order: Optional[float] = Field(default=35.0, example=35.0)
    incentives: Optional[float] = Field(default=200.0, example=200.0)
    base_pay: Optional[float] = Field(default=850.0, example=850.0)
    overtime_pay: Optional[float] = Field(default=0.0, example=0.0)
    deductions: Optional[float] = Field(default=0.0, example=0.0)
    actual_pay: float = Field(..., example=850.0)
    voice_transcript: Optional[str] = Field(default=None, example="I worked 8 hours but got paid for only 6.")
    ocr_clarity: Optional[float] = Field(default=0.95, example=0.95)
    voice_confidence: Optional[float] = Field(default=0.90, example=0.90)

class WageTheftAnalysisResponse(BaseModel):
    id: str
    job_type: str
    calculation_method: str
    expected_pay: float = Field(..., alias="expectedPay")
    actual_pay: float = Field(..., alias="actualPay")
    wage_theft_amount: float = Field(..., alias="wageTheftAmount")
    wage_theft_percentage: float = Field(..., alias="wageTheftPercentage")
    risk_level: str = Field(..., alias="riskLevel")
    confidence_score: int = Field(..., alias="confidenceScore")
    confidence_level: str = Field(..., alias="confidenceLevel")
    status: str
    created_at: str = Field(..., alias="createdAt")

    class Config:
        populate_by_name = True

class MonthlyTrendItem(BaseModel):
    month: str
    amount: float

class CaseStatusRatio(BaseModel):
    possible_wage_theft: int = Field(..., alias="possibleWageTheft")
    no_wage_theft: int = Field(..., alias="noWageTheft")

    class Config:
        populate_by_name = True

class WageTheftStatisticsResponse(BaseModel):
    total_cases_analysed: int = Field(..., alias="totalCasesAnalysed")
    total_wage_theft_detected: float = Field(..., alias="totalWageTheftDetected")
    avg_wage_theft_percentage: float = Field(..., alias="avgWageTheftPercentage")
    high_risk_cases: int = Field(..., alias="highRiskCases")
    medium_risk_cases: int = Field(..., alias="mediumRiskCases")
    low_risk_cases: int = Field(..., alias="lowRiskCases")
    no_issue_cases: int = Field(..., alias="noIssueCases")
    case_status: CaseStatusRatio = Field(..., alias="caseStatus")
    monthly_trend: List[MonthlyTrendItem] = Field(..., alias="monthlyTrend")

    class Config:
        populate_by_name = True
