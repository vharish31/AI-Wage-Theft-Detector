import re
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

# Natural Language Shift Phrase Mappings
SHIFT_PHRASE_PATTERNS = [
    {
        "pattern": r"\b(half\s*day|half\s*shift|half\s*a\s*day|4\s*hours?\s*work)\b",
        "hours": 4.0,
        "shift_type": "Half Day",
        "confidence": 0.90,
        "reasoning": "Based on your statement: 'Half day' (standard 4-hour shift)"
    },
    {
        "pattern": r"\b(morning\s*(?:to|till|until|through)\s*evening|daytime|day\s*shift)\b",
        "hours": 8.0,
        "shift_type": "Full Day",
        "confidence": 0.90,
        "reasoning": "Based on your statement: 'Morning to evening' (standard 8-hour shift)"
    },
    {
        "pattern": r"\b(whole\s*day|full\s*day|all\s*day|entire\s*day|complete\s*day)\b",
        "hours": 8.0,
        "shift_type": "Full Day",
        "confidence": 0.90,
        "reasoning": "Based on your statement: 'Whole day' (standard 8-hour shift)"
    },
    {
        "pattern": r"\b(night\s*shift|overnight|all\s*night|night\s*duty|night\s*work)\b",
        "hours": 10.0,
        "shift_type": "Night Shift",
        "confidence": 0.85,
        "reasoning": "Based on your statement: 'Night shift' (typical 10-hour night shift)"
    },
    {
        "pattern": r"\b(few\s*hours|couple\s*of\s*hours|short\s*shift|some\s*hours|part\s*time)\b",
        "hours": 3.0,
        "shift_type": "Short Shift",
        "confidence": 0.75,
        "reasoning": "Based on your statement: 'Few hours' (short work duration)"
    },
    {
        "pattern": r"\b(overtime|extra\s*hours|double\s*shift|extended\s*hours|late\s*hours)\b",
        "hours": 10.0,
        "shift_type": "Overtime Shift",
        "confidence": 0.85,
        "reasoning": "Based on your statement: 'Overtime' (extended 10-hour shift)"
    }
]

def detect_shift_type(hours: float) -> str:
    """Returns human-friendly shift label based on numeric hours."""
    if hours <= 4.5:
        return "Half Day (4 Hours)"
    elif hours <= 8.5:
        return "Full Day (8 Hours)"
    elif hours <= 11.0:
        return "Night / Extended Shift (10 Hours)"
    else:
        return f"Custom Shift ({hours:.1f} Hours)"

def calculate_confidence(transcript: str, hours: float) -> float:
    """Calculates confidence score (0.0 - 1.0) based on specificity of transcript."""
    if not transcript or not transcript.strip():
        return 0.50
    
    text = transcript.lower()
    
    # Explicit digit + hour mention
    if re.search(r'\b\d+(?:\.\d+)?\s*(?:hours|hrs|hr)\b', text):
        return 0.95
    
    # Specific phrase match
    for item in SHIFT_PHRASE_PATTERNS:
        if re.search(item["pattern"], text):
            return item["confidence"]
    
    # Vague transcript fallback
    return 0.72

def estimate_hours(transcript: str, hours_extracted: Optional[float] = None) -> Dict[str, Any]:
    """
    Intelligently estimates working hours from natural language statements.
    Returns dict containing estimated_hours, confidence, shift_type, reasoning, and source.
    """
    text = (transcript or "").strip().lower()

    # 1. If explicit hours were already successfully extracted (>0)
    if hours_extracted is not None and hours_extracted > 0:
        conf = calculate_confidence(transcript, hours_extracted)
        return {
            "estimated_hours": float(hours_extracted),
            "confidence": conf,
            "shift_type": detect_shift_type(hours_extracted),
            "reasoning": f"Extracted explicit work duration of {hours_extracted:g} hours from transcript.",
            "source": "AI_EXTRACTION"
        }

    # 2. Natural language phrase pattern matching
    for item in SHIFT_PHRASE_PATTERNS:
        if re.search(item["pattern"], text):
            return {
                "estimated_hours": item["hours"],
                "confidence": item["confidence"],
                "shift_type": item["shift_type"],
                "reasoning": item["reasoning"],
                "source": "AI_ESTIMATION"
            }

    # 3. Explicit numeric pattern fallback (e.g. "5 hours", "worked 6")
    digit_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:hours|hrs|hr)?', text)
    if digit_match:
        try:
            parsed_val = float(digit_match.group(1))
            if 0.5 <= parsed_val <= 24.0:
                return {
                    "estimated_hours": parsed_val,
                    "confidence": 0.88,
                    "shift_type": detect_shift_type(parsed_val),
                    "reasoning": f"Identified numeric work duration of {parsed_val:g} hours in transcript.",
                    "source": "NUMERIC_INTERPRETATION"
                }
        except ValueError:
            pass

    # 4. Default fallback when phrase is ambiguous
    default_hours = 8.0
    return {
        "estimated_hours": default_hours,
        "confidence": 0.70,
        "shift_type": "Full Day (Estimated)",
        "reasoning": f"Vague work duration statement in transcript: '{transcript}'. Defaulted to standard full-day 8-hour shift for review.",
        "source": "AI_ESTIMATION_FALLBACK"
    }
