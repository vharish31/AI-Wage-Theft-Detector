from fastapi import APIRouter, status
from app.models.worker import ValidateRequest, ValidateResponse
from app.utils.validation import validate_work_data

router = APIRouter(prefix="", tags=["Validation Engine"])

@router.post("/validate", response_model=ValidateResponse, status_code=status.HTTP_200_OK)
async def validate_input_data(payload: ValidateRequest):
    """
    POST /validate
    Runs voice recognition error prevention validation rules.
    Checks for hours_worked > 16 (warning), hours_worked > 24 (error),
    empty job_type / location, received_amount <= 0, and historical anomalies.
    """
    res = validate_work_data(
        job_type=payload.job_type,
        hours_worked=payload.hours_worked,
        location=payload.location,
        received_amount=payload.received_amount,
        past_records=payload.past_records
    )
    return ValidateResponse(**res)
