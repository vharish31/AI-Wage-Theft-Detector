from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from app.models.worker import (
    WageDetectRequest, WageDetectResponse,
    JobNormalizeRequest, JobNormalizeResponse,
    JobCategoryPreviewRequest, JobCategoryPreviewResponse
)
from app.services.wage_service import detect_wage_theft, load_wage_rates
from app.utils.job_validator import normalize_job_type, validate_job_type, get_job_category_info

router = APIRouter(prefix="", tags=["Wage Detection Engine"])

@router.post("/detect", response_model=WageDetectResponse, status_code=status.HTTP_200_OK)
async def detect_wage_underpayment(payload: WageDetectRequest):
    """
    POST /detect
    Calculates expected wage, shortfall, risk score, and risk level based on wage rate benchmarks.
    """
    try:
        hours = payload.hours_worked if payload.hours_worked and payload.hours_worked > 0 else 8.0
        result = detect_wage_theft(
            job_type=payload.job_type,
            location=payload.location,
            received_amount=payload.received_amount,
            hours_worked=hours
        )
        return WageDetectResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing wage theft calculation: {str(e)}"
        )

@router.post("/normalize-job", response_model=JobNormalizeResponse, status_code=status.HTTP_200_OK)
async def normalize_job_alias(payload: JobNormalizeRequest):
    """
    POST /normalize-job
    Normalizes any vernacular, slang, or alias job title into a canonical job role.
    """
    norm = normalize_job_type(payload.job_type)
    return JobNormalizeResponse(
        raw_job_type=payload.job_type,
        normalized_job_type=norm,
        is_canonical=validate_job_type(norm)
    )

@router.post("/job-category-preview", response_model=JobCategoryPreviewResponse, status_code=status.HTTP_200_OK)
async def preview_job_category(payload: JobCategoryPreviewRequest):
    """
    POST /job-category-preview
    Returns state wage category, statutory act reference, and benchmark rate preview.
    """
    info = get_job_category_info(payload.job_type, payload.location)
    return JobCategoryPreviewResponse(**info)

@router.get("/wage-rates", response_model=List[Dict[str, Any]])
async def get_all_wage_rates():
    """
    GET /wage-rates
    Returns benchmark dataset of wage rates.
    """
    return load_wage_rates()

