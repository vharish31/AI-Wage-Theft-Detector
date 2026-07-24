from pydantic import BaseModel, Field
from typing import Optional, List

class SpeechExtractRequest(BaseModel):
    transcript: str = Field(..., example="Today I worked 8 hours as a construction worker in Chennai")

class SpeechExtractResponse(BaseModel):
    job_type: str = Field(..., example="Construction Worker")
    hours_worked: float = Field(..., example=8.0)
    location: str = Field(..., example="Chennai")
    confidence: Optional[float] = Field(default=0.95, example=0.95)
    raw_transcript: Optional[str] = None

class WageDetectRequest(BaseModel):
    job_type: str = Field(..., example="Construction Worker")
    location: str = Field(..., example="Chennai")
    received_amount: float = Field(..., example=600.0)
    hours_worked: Optional[float] = Field(default=8.0, example=8.0)

class WageDetectResponse(BaseModel):
    job_type: str
    location: str
    state: str
    expected_wage: float
    received_amount: float
    difference: float
    risk_score: float
    risk_level: str
    is_underpaid: bool
    hourly_rate_expected: float
    hourly_rate_received: float
    legal_ref: Optional[str] = None

class ValidateRequest(BaseModel):
    job_type: Optional[str] = None
    hours_worked: Optional[float] = None
    location: Optional[str] = None
    received_amount: Optional[float] = None
    past_records: Optional[List[float]] = None

class ValidateResponse(BaseModel):
    is_valid: bool
    warnings: List[str] = []
    errors: List[str] = []
    warning: Optional[str] = None
    error: Optional[str] = None

class JobNormalizeRequest(BaseModel):
    job_type: str = Field(..., example="kothanar")

class JobNormalizeResponse(BaseModel):
    raw_job_type: str
    normalized_job_type: str
    is_canonical: bool

class JobCategoryPreviewRequest(BaseModel):
    job_type: str = Field(..., example="Mason")
    location: str = Field(..., example="Chennai")

class JobCategoryPreviewResponse(BaseModel):
    raw_job_type: str
    job_type: str
    location: str
    state: str
    category: str
    wage_category: str
    expected_daily_wage: float
    expected_hourly_wage: float
    legal_act_ref: str

class LocationValidateRequest(BaseModel):
    location: Optional[str] = Field(default=None, example="Chennai")

class LocationValidateResponse(BaseModel):
    is_valid: bool
    city: str
    state: str
    message: str
    error: Optional[str] = None

class LocationResolveRequest(BaseModel):
    city: str = Field(..., example="Chennai")
    state: Optional[str] = Field(default=None, example="Tamil Nadu")

class LocationResolveResponse(BaseModel):
    city: str
    state: str
    location_str: str
    is_resolved: bool



