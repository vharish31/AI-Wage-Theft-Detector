import re

CITY_STATE_MAP = {
    "chennai": "Tamil Nadu",
    "coimbatore": "Tamil Nadu",
    "madurai": "Tamil Nadu",
    "mumbai": "Maharashtra",
    "pune": "Maharashtra",
    "bengaluru": "Karnataka",
    "bangalore": "Karnataka",
    "mysore": "Karnataka",
    "delhi": "Delhi",
    "new delhi": "Delhi",
    "kolkata": "West Bengal",
    "hyderabad": "Telangana",
    "ahmedabad": "Gujarat"
}

def map_location_to_state(location: str) -> str:
    """Helper function to convert city or place names to Indian state standard."""
    loc_clean = location.strip().lower()
    for city, state in CITY_STATE_MAP.items():
        if city in loc_clean:
            return state
    
    # Capitalize input as default state
    return location.title()

def compute_risk_level(risk_score: float) -> str:
    """
    Risk Score Formula: ((expected - received) / expected) * 100
    - 0-10% -> Low
    - 10-25% -> Medium
    - 25-50% -> High
    - Above 50% -> Critical
    """
    if risk_score <= 10.0:
        return "Low"
    elif risk_score <= 25.0:
        return "Medium"
    elif risk_score <= 50.0:
        return "High"
    else:
        return "Critical"
