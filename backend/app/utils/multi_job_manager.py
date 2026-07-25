import re
import logging
from typing import List, Dict, Any, Optional
from app.services.speech_service import JOB_KEYWORDS, extract_hours_from_text, extract_location_from_text

logger = logging.getLogger(__name__)

def detect_multi_jobs_transcript(transcript: str) -> Dict[str, Any]:
    """
    Parses a speech transcript to detect if the worker mentioned multiple jobs/shifts in a single day.
    Example: "I worked as a construction worker in the morning for 5 hours and as a painter in the evening for 3 hours"
    """
    if not transcript or not transcript.strip():
        return {"is_multi_job": False, "detected_jobs": []}

    text = transcript.strip().lower()
    
    # Check for multi-job conjunction indicators: "and", "then", "after", "morning...afternoon", "evening"
    conjunction_splitters = [
        r'\b(?:and|then|after\s*that|also|later|plus)\s+(?:worked|did|as|was|i|at)\b',
        r'(?<=\d\s*(?:hours|hrs|hr))\s*(?:and|,|then)\s*'
    ]

    matched_roles = []
    for canonical_job, keywords in JOB_KEYWORDS.items():
        for kw in keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', text):
                if canonical_job.title() not in [m["job_type"] for m in matched_roles]:
                    matched_roles.append({
                        "job_type": canonical_job.title(),
                        "kw": kw
                    })
                break

    # If 2 or more distinct job roles were mentioned in transcript
    if len(matched_roles) >= 2:
        detected_jobs = []
        loc = extract_location_from_text(transcript) or "Chennai"

        # Split transcript by sentences or conjunction clauses
        clauses = re.split(r'\b(?:and|then|afterwards|plus|also)\b', text)

        for i, role_info in enumerate(matched_roles):
            job_title = role_info["job_type"]
            
            # Find associated hours in the specific clause matching the role keyword
            hours_val = 8.0
            for clause in clauses:
                if role_info["kw"] in clause:
                    clause_hrs = extract_hours_from_text(clause)
                    if clause_hrs and clause_hrs > 0:
                        hours_val = clause_hrs
                        break
            
            if hours_val == 8.0 and len(matched_roles) > 1:
                # Default reasonable split for multi-jobs if unspecified (e.g., 5h, 3h, etc.)
                hours_val = 5.0 if i == 0 else (3.0 if i == 1 else 2.0)

            detected_jobs.append({
                "job_id": f"job-{i+1}",
                "job_type": job_title,
                "hours_worked": hours_val,
                "location": loc,
                "received_amount": 0.0,
                "employer_name": f"Employer / Contractor {i+1}"
            })

        return {
            "is_multi_job": True,
            "detected_jobs": detected_jobs
        }

    return {"is_multi_job": False, "detected_jobs": []}

def validate_job(job_data: Dict[str, Any]) -> Dict[str, Any]:
    """Validates an individual job card entry."""
    errors = []
    warnings = []

    job_type = job_data.get("job_type", "").strip()
    hours = job_data.get("hours_worked", 0.0)
    received = job_data.get("received_amount", 0.0)

    if not job_type or job_type.lower() == "none":
        errors.append("Job type is required.")

    if hours is None or float(hours) <= 0:
        errors.append("Hours worked must be greater than 0.")
    elif float(hours) > 24:
        errors.append("Working hours cannot exceed 24 in a single day.")

    if received is None or float(received) < 0:
        errors.append("Received payment cannot be negative.")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings
    }

def calculate_daily_summary(job_results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes total daily expected wage, received pay, shortfall, overall risk level,
    and identifies the highest underpayment job.
    """
    if not job_results:
        return {
            "total_jobs": 0,
            "total_hours_worked": 0.0,
            "total_expected_wage": 0.0,
            "total_received_amount": 0.0,
            "total_difference": 0.0,
            "overall_risk_level": "Low",
            "highest_underpayment_job": None,
            "is_underpaid": False
        }

    total_jobs = len(job_results)
    total_hours = sum(float(j.get("hours_worked", 0.0)) for j in job_results)
    total_expected = round(sum(float(j.get("expected_wage", 0.0)) for j in job_results), 2)
    total_received = round(sum(float(j.get("received_amount", 0.0)) for j in job_results), 2)
    total_diff = round(max(0.0, total_expected - total_received), 2)

    highest_underpayment = 0.0
    highest_job_name = None

    for j in job_results:
        diff = float(j.get("difference", 0.0))
        if diff > highest_underpayment:
            highest_underpayment = diff
            highest_job_name = j.get("job_type", "Worker Job")

    overall_risk_score = (total_diff / total_expected * 100) if total_expected > 0 else 0.0
    
    if overall_risk_score > 50:
        overall_risk = "Critical"
    elif overall_risk_score > 25:
        overall_risk = "High"
    elif overall_risk_score > 10:
        overall_risk = "Medium"
    elif total_diff > 0:
        overall_risk = "Low"
    else:
        overall_risk = "No Issue"

    return {
        "total_jobs": total_jobs,
        "total_hours_worked": total_hours,
        "total_expected_wage": total_expected,
        "total_received_amount": total_received,
        "total_difference": total_diff,
        "overall_risk_level": overall_risk,
        "highest_underpayment_job": highest_job_name,
        "is_underpaid": total_diff > 0
    }

def generate_combined_report(worker_name: str, job_results: List[Dict[str, Any]], summary: Dict[str, Any]) -> str:
    """
    Generates a combined formal legal complaint letter summarizing all wage theft discrepancies across multiple jobs.
    """
    location = job_results[0].get("location", "Chennai") if job_results else "Chennai"
    
    job_facts_lines = []
    for i, j in enumerate(job_results, start=1):
        job_type = j.get("job_type", "Worker")
        hrs = j.get("hours_worked", 8.0)
        exp = j.get("expected_wage", 0.0)
        rec = j.get("received_amount", 0.0)
        diff = j.get("difference", 0.0)
        emp = j.get("employer_name", f"Employer {i}")
        job_facts_lines.append(
            f"Job {i} - {job_type} ({hrs} hrs, Employer: {emp}):\n"
            f"   - Statutory Minimum Wage Rate: Rs. {exp:.2f}\n"
            f"   - Actual Amount Received: Rs. {rec:.2f}\n"
            f"   - Shortfall / Wages Withheld: Rs. {diff:.2f}\n"
        )

    job_facts = "\n".join(job_facts_lines)

    return f"""TO:
The Regional Labor Commissioner / Labor Inspector
Department of Labor, {location}

FROM:
Complainant: {worker_name or 'Worker'}
Location: {location}

SUBJECT: FORMAL COMPLAINT REGARDING MULTI-JOB WAGE THEFT & UNDERPAYMENT

Respected Sir/Madam,

I am writing to formally log a legal grievance regarding severe wage underpayment across multiple shifts/jobs performed in a single workday in {location}.

DAILY MULTI-JOB WORKDAY AUDIT BREAKDOWN:
{job_facts}
TOTAL DAILY SUMMARY:
- Total Jobs Performed: {summary.get('total_jobs', len(job_results))}
- Total Hours Worked: {summary.get('total_hours_worked', 0.0)} Hours
- Total Statutory Entitled Wage: Rs. {summary.get('total_expected_wage', 0.0):.2f}
- Total Amount Paid to Worker: Rs. {summary.get('total_received_amount', 0.0):.2f}
- Total Daily Unpaid Balance: Rs. {summary.get('total_difference', 0.0):.2f} (Severity: {summary.get('overall_risk_level', 'High')} Risk)

STATUTORY GROUNDS:
The failure to pay statutory minimum wage rates for each respective job role constitutes a direct violation of Section 12 of the Minimum Wages Act, 1948, and Article 23 of the Constitution of India.

PRAYER FOR RELIEF:
1. Direct the respective employers/contractors to pay the full outstanding balance of Rs. {summary.get('total_difference', 0.0):.2f}.
2. Impose statutory compensation and interest as mandated under Section 20 of the Minimum Wages Act, 1948.

Sincerely,
{worker_name or 'Worker'}
Location: {location}
"""
