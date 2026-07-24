from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class ComplaintRequest(BaseModel):
    job_type: str = Field(..., example="Construction Worker")
    location: str = Field(..., example="Chennai")
    expected: float = Field(..., example=850.0)
    received: float = Field(..., example=600.0)
    hours_worked: Optional[float] = Field(default=8.0, example=8.0)
    worker_name: Optional[str] = Field(default="Worker", example="Ramesh Kumar")
    employer_name: Optional[str] = Field(default="Site Supervisor / Employer", example="ABC Construction Ltd.")
    incident_date: Optional[str] = Field(default=None)

class ComplaintResponse(BaseModel):
    complaint: str
    summary: str
    recommended_actions: list[str]
    legal_section: str
