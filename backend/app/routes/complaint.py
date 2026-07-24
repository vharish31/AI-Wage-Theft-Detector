from fastapi import APIRouter, HTTPException, Response, status
from app.models.report import ComplaintRequest, ComplaintResponse
from app.services.gemini_service import generate_complaint_letter_gemini
from app.services.pdf_service import generate_wage_theft_pdf_report
from app.utils.helpers import compute_risk_level

router = APIRouter(prefix="/complaint", tags=["AI Complaint & PDF Generator"])

def build_fallback_complaint(job_type: str, location: str, expected: float, received: float, hours: float = 8.0, worker: str = "Worker", employer: str = "Employer / Contractor") -> str:
    difference = expected - received
    risk_pct = round((difference / expected) * 100, 1) if expected > 0 else 0
    return f"""TO:
The Regional Labor Commissioner / Labor Inspector
Department of Labor, {location}

FROM:
Complainant: {worker}
Role: {job_type}
Location: {location}

SUBJECT: FORMAL COMPLAINT AGAINST UNLAWFUL WAGE UNDERPAYMENT / WAGE THEFT UNDER MINIMUM WAGES ACT

Respected Sir/Madam,

I am writing to formally submit a grievance regarding severe wage underpayment by my employer/contractor ({employer}) in {location}.

FACTS OF WAGE THEFT:
1. Nature of Work: {job_type} (Shift duration: {hours} hours).
2. Statutory Minimum Wage Rate: ₹{expected:.2f} per shift.
3. Actual Amount Paid to Worker: ₹{received:.2f}.
4. Total Shortfall / Underpayment: ₹{difference:.2f} (Underpayment severity: {risk_pct}%).

STATUTORY VIOLATIONS:
The failure to pay statutory minimum wages constitutes a direct violation of Section 12 of the Minimum Wages Act, 1948, and Article 23 of the Constitution of India prohibiting forced or underpaid labor.

RELIEF DEMANDED:
1. Immediate recovery of unpaid balance ₹{difference:.2f}.
2. Imposition of statutory compensation & interest as mandated by Section 20 of the Minimum Wages Act.
3. Official inspection of employer records to prevent recurring wage theft against gig and informal workers.

Sincerely,
{worker}
Date: Today's Date
Location: {location}
"""

@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_200_OK)
async def generate_complaint(payload: ComplaintRequest):
    """
    POST /complaint
    Generates a formal legal complaint letter using Gemini AI (with fallback template).
    """
    try:
        worker_name = payload.worker_name or "Worker"
        employer_name = payload.employer_name or "Employer / Site Supervisor"
        hours = payload.hours_worked or 8.0

        # Call Gemini AI letter generator
        letter = generate_complaint_letter_gemini(
            job_type=payload.job_type,
            location=payload.location,
            expected=payload.expected,
            received=payload.received,
            hours_worked=hours,
            worker_name=worker_name,
            employer_name=employer_name
        )

        # Fallback template if Gemini fails or API key is not present
        if not letter:
            letter = build_fallback_complaint(
                job_type=payload.job_type,
                location=payload.location,
                expected=payload.expected,
                received=payload.received,
                hours=hours,
                worker=worker_name,
                employer=employer_name
            )

        diff = payload.expected - payload.received
        risk_pct = round((diff / payload.expected) * 100, 1) if payload.expected > 0 else 0

        return ComplaintResponse(
            complaint=letter,
            summary=f"Wage theft detected: Worker was paid ₹{payload.received:.2f} instead of statutory ₹{payload.expected:.2f} (Shortfall: ₹{diff:.2f}, Risk: {risk_pct}%).",
            recommended_actions=[
                "Submit this complaint letter to your district Labor Commissioner's office.",
                "Keep daily work logs, supervisor messages, and payment receipts as evidence.",
                "Seek assistance from free legal services (DLSA) or local labor unions."
            ],
            legal_section="Section 12 & 20, Minimum Wages Act, 1948"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating complaint: {str(e)}"
        )

@router.post("/pdf")
async def generate_pdf(payload: ComplaintRequest):
    """
    POST /complaint/pdf
    Generates and returns downloadable PDF audit report and legal complaint letter.
    """
    try:
        worker_name = payload.worker_name or "Worker"
        employer_name = payload.employer_name or "Employer / Site Supervisor"
        hours = payload.hours_worked or 8.0

        letter = generate_complaint_letter_gemini(
            job_type=payload.job_type,
            location=payload.location,
            expected=payload.expected,
            received=payload.received,
            hours_worked=hours,
            worker_name=worker_name,
            employer_name=employer_name
        )

        if not letter:
            letter = build_fallback_complaint(
                job_type=payload.job_type,
                location=payload.location,
                expected=payload.expected,
                received=payload.received,
                hours=hours,
                worker=worker_name,
                employer=employer_name
            )

        diff = max(0.0, payload.expected - payload.received)
        risk_score = round((diff / payload.expected) * 100, 1) if payload.expected > 0 else 0
        risk_level = compute_risk_level(risk_score)

        pdf_bytes = generate_wage_theft_pdf_report(
            job_type=payload.job_type,
            location=payload.location,
            expected_wage=payload.expected,
            received_wage=payload.received,
            difference=diff,
            risk_score=risk_score,
            risk_level=risk_level,
            hours_worked=hours,
            complaint_text=letter,
            worker_name=worker_name,
            employer_name=employer_name
        )

        filename = f"Wage_Theft_Report_{payload.job_type.replace(' ', '_')}.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating PDF report: {str(e)}"
        )
