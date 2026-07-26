from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class PaymentItem(BaseModel):
    id: str
    name: str
    category: str  # "base_wage" | "bonus" | "allowance" | "tips" | "commission" | "deduction"
    amount: float
    remarks: Optional[str] = None

class BonusRecord(BaseModel):
    bonus_type: str  # "Attendance" | "Performance" | "Festival" | "Referral" | "Project" | "Custom"
    amount: float
    description: Optional[str] = None

class AllowanceRecord(BaseModel):
    allowance_type: str  # "Travel" | "Food" | "Night Shift" | "Risk" | "Uniform" | "Accommodation" | "Custom"
    amount: float
    description: Optional[str] = None

class TipRecord(BaseModel):
    tips_amount: float = 0.0
    commission_amount: float = 0.0

class CompensationBreakdown(BaseModel):
    base_wage: float
    total_bonuses: float
    total_allowances: float
    total_tips: float
    total_commissions: float
    total_deductions: float
    total_compensation: float
    bonuses_list: List[BonusRecord] = []
    allowances_list: List[AllowanceRecord] = []

class CompensationAuditRequest(BaseModel):
    worker_id: Optional[str] = "worker-01"
    base_wage: float
    minimum_wage: float
    bonuses: Optional[List[BonusRecord]] = []
    allowances: Optional[List[AllowanceRecord]] = []
    tips: Optional[float] = 0.0
    commissions: Optional[float] = 0.0
    deductions: Optional[float] = 0.0

class CompensationAuditResponse(BaseModel):
    breakdown: CompensationBreakdown
    minimum_wage: float
    is_base_wage_compliant: bool
    base_wage_shortfall: float
    wage_theft_detected: bool
    compliance_summary: str
    legal_reasoning: str
