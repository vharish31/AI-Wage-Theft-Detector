import json
import os
import logging
from typing import Dict, Any, List
from app.utils.helpers import map_location_to_state, compute_risk_level

logger = logging.getLogger(__name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "wage_rates.json")

def load_wage_rates() -> List[Dict[str, Any]]:
    """Loads wage rates dataset from data/wage_rates.json."""
    try:
        abs_path = os.path.abspath(DATA_PATH)
        if os.path.exists(abs_path):
            with open(abs_path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Error loading wage rates json: {str(e)}")
    
    # Default fallback data if file missing
    return [
        {
            "job": "Construction Worker",
            "state": "Tamil Nadu",
            "city": "Chennai",
            "daily_wage": 850,
            "hourly_wage": 106.25,
            "legal_act_ref": "Tamil Nadu Minimum Wages Act"
        },
        {
            "job": "Delivery Partner",
            "state": "Tamil Nadu",
            "city": "Chennai",
            "daily_wage": 700,
            "hourly_wage": 87.50,
            "legal_act_ref": "Tamil Nadu Shops & Establishments Act"
        },
        {
            "job": "Painter",
            "state": "Tamil Nadu",
            "city": "Chennai",
            "daily_wage": 900,
            "hourly_wage": 112.50,
            "legal_act_ref": "Tamil Nadu Construction Board Rates"
        }
    ]

def get_expected_wage(job_type: str, location: str) -> Dict[str, Any]:
    """
    Finds standard minimum wage for a job type in a location/state.
    Performs fuzzy matching on job title and location.
    """
    rates = load_wage_rates()
    state = map_location_to_state(location)
    
    job_query = job_type.strip().lower()
    location_query = location.strip().lower()
    state_query = state.lower()

    best_match = None
    
    # 1st priority: Exact city and job match
    for item in rates:
        item_job = item["job"].lower()
        item_city = item.get("city", "").lower()
        if item_job in job_query or job_query in item_job:
            if item_city and (item_city in location_query or location_query in item_city):
                best_match = item
                break
    
    # 2nd priority: State and job match
    if not best_match:
        for item in rates:
            item_job = item["job"].lower()
            item_state = item["state"].lower()
            if (item_job in job_query or job_query in item_job) and (item_state in state_query or state_query in item_state):
                best_match = item
                break

    # 3rd priority: Job match only across any region
    if not best_match:
        for item in rates:
            item_job = item["job"].lower()
            if item_job in job_query or job_query in item_job:
                best_match = item
                break

    # Default fallback benchmark rate
    if not best_match:
        best_match = {
            "job": job_type.title(),
            "state": state,
            "city": location.title(),
            "daily_wage": 800.0,
            "hourly_wage": 100.0,
            "legal_act_ref": "Standard State Minimum Wage Guidelines"
        }

    return best_match

def detect_wage_theft(job_type: str, location: str, received_amount: float, hours_worked: float = 8.0) -> Dict[str, Any]:
    """
    Core Wage Detection Engine:
    Expected Wage = Benchmark Daily Rate (adjusted for hours worked if non-standard)
    Difference = Expected - Received
    Risk Score = ((Expected - Received) / Expected) * 100
    Risk Level: Low (0-10%), Medium (10-25%), High (25-50%), Critical (>50%)
    """
    match_info = get_expected_wage(job_type, location)
    
    # Base daily wage standard is for an 8-hour shift
    base_daily_wage = float(match_info["daily_wage"])
    hourly_rate_expected = float(match_info.get("hourly_wage", base_daily_wage / 8.0))
    
    # Calculate expected wage based on hours worked
    if hours_worked != 8.0 and hours_worked > 0:
        expected_wage = round(hourly_rate_expected * hours_worked, 2)
    else:
        expected_wage = round(base_daily_wage, 2)

    received_amount = round(float(received_amount), 2)
    difference = max(0.0, round(expected_wage - received_amount, 2))
    
    if expected_wage > 0:
        risk_score = max(0.0, round(((expected_wage - received_amount) / expected_wage) * 100.0, 1))
    else:
        risk_score = 0.0

    risk_level = compute_risk_level(risk_score)
    is_underpaid = received_amount < expected_wage
    
    hourly_rate_received = round(received_amount / hours_worked, 2) if hours_worked > 0 else 0.0

    return {
        "job_type": match_info["job"],
        "location": location.title(),
        "state": match_info["state"],
        "expected_wage": expected_wage,
        "received_amount": received_amount,
        "difference": difference,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "is_underpaid": is_underpaid,
        "hourly_rate_expected": hourly_rate_expected,
        "hourly_rate_received": hourly_rate_received,
        "legal_ref": match_info.get("legal_act_ref", "Minimum Wages Act")
    }
