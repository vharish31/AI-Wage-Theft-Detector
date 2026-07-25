import re
import logging
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)

def detect_typo(val: float, expected: float) -> Optional[float]:
    """
    Detects common worker typing mistakes:
    - Extra zero (e.g., ₹6000 instead of ₹600, or ₹8500 instead of ₹850)
    - Missing zero (e.g., ₹60 instead of ₹600, or ₹85 instead of ₹850)
    - Repeated digits (e.g., ₹99999, ₹1111)
    Returns suggested corrected amount or None if no clear typo is detected.
    """
    if val <= 0:
        return None

    # Check 1: Extra zero (10x ratio)
    if abs(val - (expected * 10)) / (expected * 10) < 0.15 or (val > 3000 and abs((val / 10) - expected) < 200):
        return round(val / 10.0, 2)

    # Check 2: Missing zero (1/10th ratio)
    if abs(val - (expected / 10)) / (expected / 10) < 0.15 or (val < 150 and abs((val * 10) - expected) < 200):
        return round(val * 10.0, 2)

    # Check 3: Repeated digits (e.g. 9999, 8888, 1111)
    val_str = str(int(val))
    if len(val_str) >= 4 and len(set(val_str)) == 1:
        return round(expected, 2)

    return None

def detect_anomaly(val: float, expected: float, past_records: Optional[List[float]] = None) -> Dict[str, Any]:
    """
    Detects numerical anomalies against statutory benchmarks and historical logs.
    """
    if expected <= 0:
        expected = 800.0

    ratio = val / expected if expected > 0 else 1.0

    # Historical comparison if past logs exist
    historical_anomaly = False
    past_avg = None
    if past_records and len(past_records) > 0:
        try:
            valid_past = [float(x) for x in past_records if float(x) > 0]
            if valid_past:
                past_avg = sum(valid_past) / len(valid_past)
                if val < (0.25 * past_avg):
                    historical_anomaly = True
        except (ValueError, TypeError):
            pass

    if val <= 0:
        return {
            "level": "REJECT",
            "message": "Payment amount must be greater than ₹0.",
            "is_anomaly": True
        }
    elif ratio > 5.0 or val > 50000.0:
        return {
            "level": "HIGH",
            "message": f"⚠ This payment amount (₹{val:g}) appears unusually high compared to expected wage (₹{expected:g}).",
            "is_anomaly": True
        }
    elif ratio < 0.15 or val < 50.0 or historical_anomaly:
        msg = f"⚠ This payment amount (₹{val:g}) appears unusually low."
        if historical_anomaly and past_avg:
            msg += f" (Much lower than your previous average payout of ₹{past_avg:.2f})."
        return {
            "level": "HIGH",
            "message": msg,
            "is_anomaly": True
        }
    elif ratio < 0.60 or ratio > 2.0:
        return {
            "level": "MEDIUM",
            "message": f"Please verify payment amount (₹{val:g}). Differs significantly from benchmark ₹{expected:g}.",
            "is_anomaly": True
        }
    else:
        return {
            "level": "NORMAL",
            "message": "Payment amount appears valid and within statutory expected range.",
            "is_anomaly": False
        }

def calculate_payment_confidence(val: float, expected: float, has_typo: bool) -> float:
    """Calculates confidence score (0.0 - 1.0) for the entered payment value."""
    if val <= 0:
        return 0.0
    if has_typo:
        return 0.45
    
    ratio = val / expected if expected > 0 else 1.0
    if 0.70 <= ratio <= 1.5:
        return 0.96
    elif 0.40 <= ratio <= 2.5:
        return 0.82
    elif 0.15 <= ratio <= 4.0:
        return 0.65
    else:
        return 0.40

def suggest_correct_amount(val: float, expected: float) -> Optional[float]:
    """Generates suggested corrected payment amount if typo or severe discrepancy exists."""
    typo_suggestion = detect_typo(val, expected)
    if typo_suggestion is not None:
        return typo_suggestion
    
    # If val is extremely low (e.g. 8 vs 850), suggest 850 or 85
    if val < 20 and expected > 300:
        return round(expected, 2)

    return None

def validate_payment(
    received_amount: Any,
    expected_wage: float = 850.0,
    job_type: str = "Worker",
    hours_worked: float = 8.0,
    past_records: Optional[List[float]] = None
) -> Dict[str, Any]:
    """
    Primary Smart Payment Validation function.
    Validates input format, basic rejection rules, range limits, typos, and anomalies.
    Returns comprehensive validation metadata.
    """
    # 1. Format & Non-numeric validation
    if received_amount is None or str(received_amount).strip() == "":
        return {
            "valid": False,
            "warning_level": "REJECT",
            "validation_status": "EMPTY",
            "original_amount": None,
            "expected_wage": expected_wage,
            "has_typo": False,
            "message": "Please enter a valid payment amount.",
            "suggested_amount": None,
            "confidence": 0.0,
            "source": "VALIDATION_ENGINE",
            "job_type": job_type,
            "hours_worked": hours_worked
        }

    try:
        val = float(str(received_amount).replace(",", "").strip())
    except (ValueError, TypeError):
        return {
            "valid": False,
            "warning_level": "REJECT",
            "validation_status": "INVALID_FORMAT",
            "original_amount": None,
            "expected_wage": expected_wage,
            "has_typo": False,
            "message": "Please enter a valid numeric payment amount (letters and symbols are not allowed).",
            "suggested_amount": None,
            "confidence": 0.0,
            "source": "VALIDATION_ENGINE",
            "job_type": job_type,
            "hours_worked": hours_worked
        }

    # 2. Rejection Rules (Negative or Zero)
    if val < 0:
        return {
            "valid": False,
            "warning_level": "REJECT",
            "validation_status": "NEGATIVE",
            "original_amount": val,
            "expected_wage": expected_wage,
            "has_typo": False,
            "message": "Payment amount cannot be negative.",
            "suggested_amount": None,
            "confidence": 0.0,
            "source": "VALIDATION_ENGINE",
            "job_type": job_type,
            "hours_worked": hours_worked
        }

    if val == 0:
        return {
            "valid": False,
            "warning_level": "REJECT",
            "validation_status": "ZERO",
            "original_amount": val,
            "expected_wage": expected_wage,
            "has_typo": False,
            "message": "Payment amount must be greater than ₹0.",
            "suggested_amount": None,
            "confidence": 0.0,
            "source": "VALIDATION_ENGINE",
            "job_type": job_type,
            "hours_worked": hours_worked
        }


    # 3. Typo Detection & Anomaly Analysis
    suggested = suggest_correct_amount(val, expected_wage)
    has_typo = suggested is not None and suggested != val
    anomaly_info = detect_anomaly(val, expected_wage, past_records)
    confidence = calculate_payment_confidence(val, expected_wage, has_typo)

    warning_level = anomaly_info["level"]
    if has_typo and warning_level != "REJECT":
        warning_level = "HIGH"

    validation_status = "VALID"
    if warning_level == "HIGH":
        validation_status = "TYPO_OR_HIGH_ANOMALY"
    elif warning_level == "MEDIUM":
        validation_status = "MEDIUM_DISCREPANCY"

    return {
        "valid": True,
        "warning_level": warning_level, # 'NORMAL', 'MEDIUM', 'HIGH', 'REJECT'
        "validation_status": validation_status,
        "original_amount": val,
        "expected_wage": expected_wage,
        "suggested_amount": suggested if has_typo else None,
        "has_typo": has_typo,
        "message": anomaly_info["message"] if warning_level != "NORMAL" else "Payment amount appears valid.",
        "confidence": confidence,
        "source": "SMART_PAYMENT_VALIDATION",
        "job_type": job_type,
        "hours_worked": hours_worked
    }
