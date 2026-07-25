from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class JobItem(BaseModel):
    job_id: str = Field(..., example="job-1")
    job_type: str = Field(..., example="Construction Worker")
    hours_worked: float = Field(default=8.0, example=5.0)
    location: str = Field(default="Chennai", example="Chennai")
    received_amount: Optional[float] = Field(default=0.0, example=500.0)
    employer_name: Optional[str] = Field(default="Employer / Contractor", example="Site Contractor")

class JobAuditResult(BaseModel):
    job_id: str
    job_type: str
    location: str
    state: str
    hours_worked: float
    expected_wage: float
    received_amount: float
    difference: float
    risk_score: float
    risk_level: str
    is_underpaid: bool
    hourly_rate_expected: float
    hourly_rate_received: float
    employer_name: Optional[str] = "Employer / Contractor"
    legal_ref: Optional[str] = "Minimum Wages Act, 1948"

class DailySummary(BaseModel):
    total_jobs: int
    total_hours_worked: float
    total_expected_wage: float
    total_received_amount: float
    total_difference: float
    overall_risk_level: str
    highest_underpayment_job: Optional[str] = None
    is_underpaid: bool

class MultiJobAuditRequest(BaseModel):
    worker_name: Optional[str] = Field(default="Worker", example="Ramesh")
    jobs: List[JobItem]

class MultiJobAuditResponse(BaseModel):
    worker_name: str
    is_multi_job: bool
    summary: DailySummary
    jobs_results: List[JobAuditResult]

class MultiJobDetectRequest(BaseModel):
    transcript: str = Field(..., example="I worked as a construction worker in the morning for 5 hours and as a painter in the evening for 3 hours")

class MultiJobDetectResponse(BaseModel):
    is_multi_job: bool
    detected_jobs: List[JobItem]
    raw_transcript: str
