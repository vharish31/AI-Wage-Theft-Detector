from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from app.models.job import (
    MultiJobDetectRequest, MultiJobDetectResponse,
    MultiJobAuditRequest, MultiJobAuditResponse,
    JobItem, JobAuditResult, DailySummary
)
from app.utils.multi_job_manager import (
    detect_multi_jobs_transcript,
    calculate_daily_summary,
    generate_combined_report,
    validate_job
)
from app.services.speech_service import process_speech_transcript
from app.services.wage_service import detect_wage_theft

from app.models.worker import WageDetectRequest

router = APIRouter(prefix="/multi-job", tags=["Multi-Job Workday Support"])

@router.post("/detect", response_model=MultiJobDetectResponse, status_code=status.HTTP_200_OK)
async def detect_multi_jobs(payload: MultiJobDetectRequest):
    """
    POST /multi-job/detect
    Parses a speech transcript to detect whether multiple jobs/shifts were mentioned.
    """
    try:
        detection = detect_multi_jobs_transcript(payload.transcript or "")
        detected_jobs = [JobItem(**j) for j in detection.get("detected_jobs", [])]

        return MultiJobDetectResponse(
            is_multi_job=detection.get("is_multi_job", False),
            detected_jobs=detected_jobs,
            raw_transcript=payload.transcript or ""
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error detecting multi-jobs: {str(e)}"
        )

@router.post("/audit", response_model=MultiJobAuditResponse, status_code=status.HTTP_200_OK)
async def audit_multi_jobs(payload: MultiJobAuditRequest):
    """
    POST /multi-job/audit
    Runs statutory wage theft audit for each job independently and calculates combined daily summary.
    """
    if not payload.jobs:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one job is required for multi-job audit."
        )

    try:
        jobs_results = []
        for job in payload.jobs:
            hrs = job.hours_worked if job.hours_worked and job.hours_worked > 0 else 8.0
            audit_dict = detect_wage_theft(
                job_type=job.job_type,
                location=job.location or "Chennai",
                received_amount=job.received_amount or 0.0,
                hours_worked=hrs
            )

            job_result = {
                "job_id": job.job_id,
                "job_type": audit_dict["job_type"],
                "location": audit_dict["location"],
                "state": audit_dict["state"],
                "hours_worked": hrs,
                "expected_wage": audit_dict["expected_wage"],
                "received_amount": audit_dict["received_amount"],
                "difference": audit_dict["difference"],
                "risk_score": audit_dict["risk_score"],
                "risk_level": audit_dict["risk_level"],
                "is_underpaid": audit_dict["is_underpaid"],
                "hourly_rate_expected": audit_dict["hourly_rate_expected"],
                "hourly_rate_received": audit_dict["hourly_rate_received"],
                "employer_name": job.employer_name or "Employer / Contractor",
                "legal_ref": audit_dict.get("legal_ref", "Minimum Wages Act, 1948")
            }
            jobs_results.append(job_result)


        summary_dict = calculate_daily_summary(jobs_results)

        return MultiJobAuditResponse(
            worker_name=payload.worker_name or "Worker",
            is_multi_job=len(payload.jobs) > 1,
            summary=DailySummary(**summary_dict),
            jobs_results=[JobAuditResult(**j) for j in jobs_results]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error performing multi-job audit: {str(e)}"
        )

@router.post("/complaint")
async def generate_multi_job_complaint(payload: MultiJobAuditRequest):
    """
    POST /multi-job/complaint
    Generates a combined legal complaint letter summarizing all wage theft discrepancies across multiple jobs.
    """
    try:
        audit_resp = await audit_multi_jobs(payload)
        letter = generate_combined_report(
            worker_name=audit_resp.worker_name,
            job_results=[j.model_dump() for j in audit_resp.jobs_results],
            summary=audit_resp.summary.model_dump()
        )
        return {
            "complaint": letter,
            "summary": f"Multi-job wage audit complete across {audit_resp.summary.total_jobs} jobs. Total shortfall: ₹{audit_resp.summary.total_difference:.2f}.",
            "recommended_actions": [
                "Submit this combined legal complaint to your District Labor Commissioner.",
                "Keep shift receipts and employer payment details for every job.",
                "Seek legal counsel from free legal aid services (DLSA)."
            ],
            "legal_section": "Section 12 & 20, Minimum Wages Act, 1948"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating multi-job complaint: {str(e)}"
        )
