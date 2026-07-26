from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class GigPlatformDetectRequest(BaseModel):
    transcript: str

class GigPlatformDetectResponse(BaseModel):
    is_gig: bool
    platform: Optional[str] = "Generic Gig Worker"
    task_type: Optional[str] = "Delivery"
    completed_tasks: Optional[float] = None
    rate_per_task: Optional[float] = None
    actual_payment: Optional[float] = None
    confidence: float = 0.90
    raw_transcript: str

class GigTaskDetails(BaseModel):
    platform: str = Field(default="Swiggy", description="Name of the gig platform (Swiggy, Uber, etc.)")
    custom_platform: Optional[str] = None
    task_type: str = Field(default="Delivery", description="Delivery, Ride, Parcel, Pickup, Drop, Order, Custom Task")
    completed_tasks: float = Field(..., gt=0, description="Total completed tasks/deliveries/trips")
    rate_per_task: float = Field(..., gt=0, description="Base payout per completed task")
    actual_payment: float = Field(..., ge=0, description="Actual payment received from platform")
    working_hours: Optional[float] = Field(default=8.0, ge=0, description="Optional working hours for hourly equivalent rate")
    worker_name: Optional[str] = "Gig Worker"
    location: Optional[str] = "Chennai"
    
    # Optional Earnings & Bonuses
    tips: Optional[float] = 0.0
    peak_hour_bonus: Optional[float] = 0.0
    rain_bonus: Optional[float] = 0.0
    festival_bonus: Optional[float] = 0.0
    referral_bonus: Optional[float] = 0.0
    night_incentive: Optional[float] = 0.0
    other_bonuses: Optional[float] = 0.0
    
    # Optional Platform Deductions
    fuel_cost: Optional[float] = 0.0
    platform_commission: Optional[float] = 0.0
    late_penalty: Optional[float] = 0.0
    cancellation_fee: Optional[float] = 0.0
    insurance_deduction: Optional[float] = 0.0
    equipment_rent: Optional[float] = 0.0
    other_deductions: Optional[float] = 0.0

class GigWorkerAuditResponse(BaseModel):
    worker_name: str
    platform: str
    task_type: str
    completed_tasks: float
    rate_per_task: float
    base_earnings: float
    total_bonuses: float
    total_tips: float
    gross_earnings: float
    total_deductions: float
    net_expected_payment: float
    actual_payment: float
    difference: float
    wage_theft_percentage: float
    risk_score: float
    risk_level: str
    is_underpaid: bool
    working_hours: float
    effective_hourly_expected: float
    effective_hourly_received: float
    bonuses_breakdown: Dict[str, float]
    deductions_breakdown: Dict[str, float]
    summary_text: str
    legal_ref: str

class GigComplaintRequest(BaseModel):
    worker_name: Optional[str] = "Gig Worker"
    employer_name: Optional[str] = "Gig Platform / Logistics Operator"
    platform: str
    task_type: str
    completed_tasks: float
    rate_per_task: float
    expected_net: float
    actual_received: float
    location: Optional[str] = "Chennai"
    bonuses: Optional[float] = 0.0
    deductions: Optional[float] = 0.0
