import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

def validate_hours(hours: float) -> Dict[str, Any]:
    """
    Validates work hours against labor standards and statutory physical limits.
    Rules:
    - hours < 1.0: Warning "Working hours cannot be less than 1." (Invalid)
    - hours > 24.0: Error "Working hours cannot exceed 24 hours in a single day." (Rejected)
    - hours > 16.0: Warning "Unusual work duration detected." (Valid, needs confirmation)
    """
    try:
        val = float(hours)
    except (ValueError, TypeError):
        return {
            "valid": False,
            "status": "ERROR",
            "message": "Invalid numeric work hours format.",
            "needs_confirmation": False
        }

    if val < 1.0:
        return {
            "valid": False,
            "status": "WARNING_MIN",
            "message": "Working hours cannot be less than 1.",
            "needs_confirmation": True
        }
    elif val > 24.0:
        return {
            "valid": False,
            "status": "REJECT_MAX",
            "message": "Working hours cannot exceed 24 hours in a single day.",
            "needs_confirmation": False
        }
    elif val > 16.0:
        return {
            "valid": True,
            "status": "WARNING_HIGH",
            "message": "Unusual work duration detected (>16 hours). Please confirm shift length.",
            "needs_confirmation": True
        }
    else:
        return {
            "valid": True,
            "status": "OK",
            "message": "Work hours within standard statutory limits.",
            "needs_confirmation": False
        }
