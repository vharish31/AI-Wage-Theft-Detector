from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.utils.payment_validator import validate_payment

router = APIRouter(prefix="/payment", tags=["Smart Payment Amount Validation"])

class PaymentValidateRequest(BaseModel):
    received_amount: Any = Field(description="Entered payment amount")
    expected_wage: Optional[float] = Field(default=850.0, description="Statutory expected wage benchmark")
    job_type: Optional[str] = Field(default="Worker", description="Job title")
    hours_worked: Optional[float] = Field(default=8.0, description="Work shift duration")
    past_records: Optional[List[float]] = Field(default=None, description="Optional historical payment logs")

class PaymentValidateResponse(BaseModel):
    valid: bool
    warning_level: str  # 'NORMAL', 'MEDIUM', 'HIGH', 'REJECT'
    validation_status: str
    original_amount: Optional[float]
    expected_wage: float
    suggested_amount: Optional[float]
    has_typo: bool
    message: str
    confidence: float
    source: str
    job_type: str
    hours_worked: float

@router.post("/validate", response_model=PaymentValidateResponse, status_code=status.HTTP_200_OK)
async def validate_payment_endpoint(payload: PaymentValidateRequest):
    """
    POST /payment/validate
    Validates payment amount entries, detects typos (extra zero, missing zero, repeated digits),
    calculates warning levels (Normal, Medium, High), and suggests corrected amounts.
    """
    try:
        res = validate_payment(
            received_amount=payload.received_amount,
            expected_wage=payload.expected_wage or 850.0,
            job_type=payload.job_type or "Worker",
            hours_worked=payload.hours_worked or 8.0,
            past_records=payload.past_records
        )
        return PaymentValidateResponse(
            valid=res["valid"],
            warning_level=res["warning_level"],
            validation_status=res["validation_status"],
            original_amount=res.get("original_amount"),
            expected_wage=res["expected_wage"],
            suggested_amount=res.get("suggested_amount"),
            has_typo=res.get("has_typo", False),
            message=res["message"],
            confidence=res["confidence"],
            source=res["source"],
            job_type=res["job_type"],
            hours_worked=res["hours_worked"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error validating payment amount: {str(e)}"
        )
