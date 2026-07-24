"""
Validation utility for Voice Recognition Error Prevention System.
Checks extracted speech metrics and wage inputs for anomalies and errors.
"""
from typing import Dict, Any, List, Optional

def check_historical_anomaly(current_hours: float, past_records: Optional[List[float]] = None) -> Optional[str]:
    """
    Optional historical anomaly detector.
    Compares current work hours against worker's past record average.
    """
    if not past_records or len(past_records) == 0:
        return None
    
    try:
        avg_hours = sum(past_records) / len(past_records)
        # If current entry deviates significantly from average (e.g. > 5 hours diff or 2.5x larger)
        if abs(current_hours - avg_hours) > 5.0 or (avg_hours > 0 and current_hours > 2.5 * avg_hours):
            return "This entry differs significantly from previous records"
    except Exception:
        pass
    
    return None

def validate_work_data(
    job_type: Optional[str] = None,
    hours_worked: Optional[float] = None,
    location: Optional[str] = None,
    received_amount: Optional[float] = None,
    past_records: Optional[List[float]] = None
) -> Dict[str, Any]:
    """
    Validates work data metrics based on defined rules:
    - Rule 1: hours_worked > 16 and <= 24 -> Warning: 'Unusual work duration detected'
    - Rule 2: hours_worked > 24 -> Error: 'Invalid work duration'
    - Rule 3: received_amount <= 0 (if provided) -> Warning: 'Received amount must be greater than zero'
    - Rule 4: job_type is empty -> Warning: 'Job type cannot be empty'
    - Rule 5: location is empty -> Warning: 'Location cannot be empty'
    - Historical rule: Flag significant deviation from past_records
    """
    warnings: List[str] = []
    errors: List[str] = []

    # Rule 4: Job type check
    if not job_type or not str(job_type).strip():
        warnings.append("Job type cannot be empty")

    # Rule 5: Location check
    if not location or not str(location).strip():
        warnings.append("Location cannot be empty")

    # Rule 1 & Rule 2: Hours worked checks
    if hours_worked is not None:
        try:
            hrs = float(hours_worked)
            if hrs > 24:
                errors.append("Invalid work duration")
            elif hrs > 16:
                warnings.append("Unusual work duration detected")
            
            # Historical check if past records exist
            hist_warning = check_historical_anomaly(hrs, past_records)
            if hist_warning:
                warnings.append(hist_warning)
        except (ValueError, TypeError):
            errors.append("Invalid work duration format")

    # Rule 3: Received amount check
    if received_amount is not None:
        try:
            amt = float(received_amount)
            if amt <= 0:
                warnings.append("Received amount must be greater than zero")
        except (ValueError, TypeError):
            errors.append("Invalid received amount format")

    # Construct standard response format
    result = {
        "is_valid": len(errors) == 0,
        "warnings": warnings,
        "errors": errors,
        "warning": warnings[0] if warnings else None,
        "error": errors[0] if errors else None
    }

    return result
