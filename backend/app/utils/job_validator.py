"""
Job Validator & Normalization Utilities.
Provides job title normalization, alias lookup, and legal wage category preview matching.
"""

from typing import Dict, Any
from app.utils.job_aliases import JOB_ALIASES, CANONICAL_JOB_TYPES

def normalize_job_type(job_name: str) -> str:
    """
    Normalizes any input job title or vernacular alias into a standard canonical job role.
    Example:
      Input: "kothanar" -> Output: "Mason"
      Input: "swiggy rider" -> Output: "Delivery Partner"
      Input: "wireman" -> Output: "Electrician"
    """
    if not job_name or not str(job_name).strip():
        return "Construction Worker"

    cleaned = str(job_name).strip().lower()

    # Direct dictionary lookup
    if cleaned in JOB_ALIASES:
        return JOB_ALIASES[cleaned]

    # Partial / substring search in alias keys
    for alias, canonical in JOB_ALIASES.items():
        if alias in cleaned or cleaned in alias:
            return canonical

    # If already canonical (case insensitive match)
    for c_job in CANONICAL_JOB_TYPES:
        if c_job.lower() == cleaned:
            return c_job

    return str(job_name).strip().title()

def validate_job_type(job_name: str) -> bool:
    """Checks if a given job name is recognized or maps to a valid canonical job."""
    normalized = normalize_job_type(job_name)
    return normalized in CANONICAL_JOB_TYPES

def get_job_category_info(job_name: str, location: str) -> Dict[str, Any]:
    """
    Resolves the normalized job title, legal wage category, and expected daily rate
    for preview before running full wage theft analysis.
    """
    from app.services.wage_service import get_expected_wage

    normalized_job = normalize_job_type(job_name)
    match = get_expected_wage(normalized_job, location)

    state = match.get("state", "Tamil Nadu")
    category = match.get("category", "Skilled / Statutory Benchmark")

    # Formulate legal category display string (e.g. "Tamil Nadu Skilled Mason")
    wage_category = f"{state} {category} {normalized_job}".strip()

    return {
        "raw_job_type": job_name,
        "job_type": normalized_job,
        "location": match.get("city", location.title()),
        "state": state,
        "category": category,
        "wage_category": wage_category,
        "expected_daily_wage": float(match.get("daily_wage", 800.0)),
        "expected_hourly_wage": float(match.get("hourly_wage", 100.0)),
        "legal_act_ref": match.get("legal_act_ref", "Minimum Wages Act")
    }
