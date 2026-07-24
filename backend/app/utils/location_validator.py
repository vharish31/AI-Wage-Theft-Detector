"""
Location Validator & Resolution Utilities.
Validates extracted locations, resolves missing locations to Indian states,
and normalizes city/state names for wage benchmark rate matching.
"""

from typing import Dict, Any, Optional
from app.utils.helpers import CITY_STATE_MAP

# Extended City to State mapping for comprehensive Indian regions
EXTENDED_CITY_STATE_MAP = {
    # Tamil Nadu
    "chennai": "Tamil Nadu",
    "coimbatore": "Tamil Nadu",
    "madurai": "Tamil Nadu",
    "salem": "Tamil Nadu",
    "trichy": "Tamil Nadu",
    "tiruchirappalli": "Tamil Nadu",
    "tirunelveli": "Tamil Nadu",
    "vellore": "Tamil Nadu",
    "erode": "Tamil Nadu",
    "thanjavur": "Tamil Nadu",

    # Karnataka
    "bengaluru": "Karnataka",
    "bangalore": "Karnataka",
    "mysore": "Karnataka",
    "mysuru": "Karnataka",
    "hubli": "Karnataka",
    "mangalore": "Karnataka",
    "belgaum": "Karnataka",

    # Maharashtra
    "mumbai": "Maharashtra",
    "pune": "Maharashtra",
    "nagpur": "Maharashtra",
    "nashik": "Maharashtra",
    "thane": "Maharashtra",

    # Delhi / NCR
    "delhi": "Delhi",
    "new delhi": "Delhi",
    "noida": "Delhi",
    "gurugram": "Delhi",
    "gurgaon": "Delhi",

    # West Bengal
    "kolkata": "West Bengal",
    "howrah": "West Bengal",
    "durgapur": "West Bengal",
    "siliguri": "West Bengal",

    # Telangana & Andhra Pradesh
    "hyderabad": "Telangana",
    "warangal": "Telangana",
    "visakhapatnam": "Andhra Pradesh",
    "vijayawada": "Andhra Pradesh",
    "guntur": "Andhra Pradesh",

    # Kerala
    "kochi": "Kerala",
    "cochin": "Kerala",
    "thiruvananthapuram": "Kerala",
    "trivandrum": "Kerala",
    "kozhikode": "Kerala",
    "calicut": "Kerala"
}

CITY_SYNONYMS = {
    "bangalore": "Bengaluru",
    "madras": "Chennai",
    "calcutta": "Kolkata",
    "trivandrum": "Thiruvananthapuram",
    "cochin": "Kochi",
    "gurgaon": "Gurugram",
    "calicut": "Kozhikode",
    "trichy": "Trichy",
    "mysore": "Mysuru"
}

def normalize_location(location_name: str) -> str:
    """
    Normalizes city name to standard title format and resolves common synonyms.
    Example: 'bangalore' -> 'Bengaluru', 'madras' -> 'Chennai'
    """
    if not location_name or not str(location_name).strip():
        return ""

    cleaned = str(location_name).strip().lower()
    if cleaned in CITY_SYNONYMS:
        return CITY_SYNONYMS[cleaned]

    return str(location_name).strip().title()

def resolve_location(city: str, state: Optional[str] = None) -> Dict[str, Any]:
    """
    Resolves city to its corresponding Indian State and standard legal wage zone.
    Returns dict with keys: city, state, location_str, is_resolved.
    """
    normalized_city = normalize_location(city)
    if not normalized_city:
        return {
            "city": "",
            "state": state.title() if state else "",
            "location_str": state.title() if state else "",
            "is_resolved": False
        }

    city_lower = normalized_city.lower()
    resolved_state = state.title() if state and str(state).strip() else None

    if not resolved_state:
        for c, s in EXTENDED_CITY_STATE_MAP.items():
            if c == city_lower or c in city_lower:
                resolved_state = s
                break

    if not resolved_state:
        for c, s in CITY_STATE_MAP.items():
            if c in city_lower:
                resolved_state = s
                break

    if not resolved_state:
        resolved_state = "Tamil Nadu"  # Default fallback state

    return {
        "city": normalized_city,
        "state": resolved_state,
        "location_str": f"{normalized_city}, {resolved_state}",
        "is_resolved": True
    }

def validate_location(location_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Validates if location string is provided and non-empty.
    Returns validation status dict with warning/error messages.
    """
    if not location_name or not str(location_name).strip() or str(location_name).strip().lower() in ["unknown", "none", "null", ""]:
        return {
            "is_valid": False,
            "city": "",
            "state": "",
            "message": "Warning: Location required for accurate wage calculation.",
            "error": "Location cannot be empty"
        }

    resolved = resolve_location(location_name)
    return {
        "is_valid": True,
        "city": resolved["city"],
        "state": resolved["state"],
        "message": "Location validated successfully",
        "error": None
    }
