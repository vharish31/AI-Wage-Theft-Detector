from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from app.utils.hours_estimator import estimate_hours, detect_shift_type
from app.utils.hours_validator import validate_hours

router = APIRouter(prefix="/hours", tags=["Smart Hours Estimation & Validation"])

class HoursEstimateRequest(BaseModel):
    transcript: Optional[str] = Field(default="", description="Worker speech transcript or statement")
    hours_worked: Optional[float] = Field(default=None, description="Extracted numeric hours if available")

class HoursEstimateResponse(BaseModel):
    estimated_hours: float
    confidence: float
    source: str
    reasoning: str
    shift_type: str
    validation: Dict[str, Any]

@router.post("/estimate", response_model=HoursEstimateResponse, status_code=status.HTTP_200_OK)
async def estimate_and_validate_hours(payload: HoursEstimateRequest):
    """
    POST /hours/estimate
    Intelligently estimates working hours from natural language statements
    and validates duration bounds (<1h, >16h, >24h).
    """
    try:
        estimation = estimate_hours(payload.transcript or "", payload.hours_worked)
        est_val = estimation.get("estimated_hours", 8.0)
        
        validation = validate_hours(est_val)

        return HoursEstimateResponse(
            estimated_hours=est_val,
            confidence=estimation.get("confidence", 0.80),
            source=estimation.get("source", "AI_ESTIMATION"),
            reasoning=estimation.get("reasoning", "Based on worker statement interpretation"),
            shift_type=estimation.get("shift_type", detect_shift_type(est_val)),
            validation=validation
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing smart hours estimation: {str(e)}"
        )
