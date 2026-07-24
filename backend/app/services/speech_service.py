import re
import logging
from app.services.gemini_service import extract_work_details_gemini

logger = logging.getLogger(__name__)

# Number word map for speech recognition transcripts
NUMBER_WORD_MAP = {
    "one": 1.0, "two": 2.0, "three": 3.0, "four": 4.0, "five": 5.0,
    "six": 6.0, "seven": 7.0, "eight": 8.0, "nine": 9.0, "ten": 10.0,
    "eleven": 11.0, "twelve": 12.0, "a": 1.0, "an": 1.0, "i": 1.0
}

# Known roles mapping for fallback regex parser
JOB_KEYWORDS = {
    "electrician": ["electrician", "electrical", "electric", "wireman", "wiring"],
    "freelancer": ["freelance", "freelancer", "consultant", "remote", "contractor", "self-employed"],
    "construction worker": ["construction", "builder", "site worker", "laborer", "labourer", "masonry", "bricklayer"],
    "delivery partner": ["delivery", "swiggy", "zomato", "zepto", "blinkit", "amazon", "courier", "rider", "driver"],
    "painter": ["painter", "painting", "wall painter", "color worker"],
    "security guard": ["security", "guard", "watchman", "gatekeeper"],
    "domestic worker": ["domestic", "maid", "housekeeper", "cook", "cleaner"],
    "carpenter": ["carpenter", "carpentry", "woodwork", "furniture maker"],
    "sanitation worker": ["sanitation", "garbage", "sweeper", "cleaning"],
    "mason": ["mason", "mistri", "head mason"],
    "factory worker": ["factory", "assembly", "manufacturing", "mill"],
    "plumber": ["plumber", "plumbing", "pipe fitter", "pipe"],
    "technician": ["technician", "mechanic", "repairer"]
}

KNOWN_CITIES = [
    "Chennai", "Mumbai", "Bengaluru", "Bangalore", "Delhi", "New Delhi",
    "Kolkata", "Hyderabad", "Pune", "Coimbatore", "Madurai", "Ahmedabad", "Jaipur", "Lucknow"
]

def extract_hours_from_text(text: str) -> float:
    """Extracts numeric or word hours (e.g. '5 hours', '5 hrs', '5 hour', '1 hr') from transcript."""
    text_lower = text.lower()

    # 1. Direct digit match: "5 hours", "5.5 hours", "5 hrs", "5 hr", "1 hr"
    digit_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:hours|hrs|hr|hour)\b', text_lower)
    if digit_match:
        try:
            return float(digit_match.group(1))
        except ValueError:
            pass

    # 2. Number words: "five hours", "five hrs", "one hour", etc.
    words_pattern = r'\b(' + '|'.join(NUMBER_WORD_MAP.keys()) + r')\s+(?:hours|hrs|hr|hour)\b'
    word_match = re.search(words_pattern, text_lower)
    if word_match:
        word = word_match.group(1).lower()
        if word in NUMBER_WORD_MAP:
            return NUMBER_WORD_MAP[word]

    # 3. Speech-to-text common mistranscriptions: "i hour", "a hour", "an hour"
    single_hour_match = re.search(r'\b(?:i|a|an)\s+(?:hour|hr|hrs|hours)\b', text_lower)
    if single_hour_match:
        return 1.0

    # 4. Pattern: "worked 5", "worked for 5", "worked 5 hrs", "shift 6"
    worked_num = re.search(r'(?:worked|shift|duty|for)\s+(?:for\s+)?(\d+(?:\.\d+)?)', text_lower)
    if worked_num:
        try:
            return float(worked_num.group(1))
        except ValueError:
            pass

    # 5. Any standalone number followed by work: "5 hours work"
    num_before_work = re.search(r'(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr)?\s*work', text_lower)
    if num_before_work:
        try:
            return float(num_before_work.group(1))
        except ValueError:
            pass

    return 8.0  # Default fallback if no hours specified at all

def extract_job_type_from_text(text: str) -> str:
    """Extracts job type using keyword dictionaries and dynamic pattern matching."""
    text_lower = text.lower()

    # 1. Check keyword dictionary first for exact role matches (e.g. electrician, painter, plumber, etc.)
    for canonical_job, keywords in JOB_KEYWORDS.items():
        for kw in keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                return canonical_job.title()

    # 2. Dynamic pattern matching: "i am a freelancer", "worked as a painter", "work as electrician"
    pattern_match = re.search(r'(?:i am an?|i\'m an?|worked as an?|job as an?|work as an?|working as an?)\s+([a-zA-Z\s]+?)(?:,|\.|\bfor\b|\bmy\b|\bin\b|\bwant\b|\bhours?\b|\bworked\b|$)', text_lower)
    if pattern_match:
        extracted_role = pattern_match.group(1).strip()
        if extracted_role and len(extracted_role) < 30 and extracted_role not in ['good', 'hard', 'poor', 'man']:
            return extracted_role.title()

    return "Worker"

def fallback_speech_extraction(transcript: str) -> dict:
    """Intelligent regex-based heuristic extractor if Gemini API is unavailable."""
    text = transcript.strip()
    
    hours = extract_hours_from_text(text)
    job_type = extract_job_type_from_text(text)

    # Extract Location
    location = "Chennai"
    for city in KNOWN_CITIES:
        if city.lower() in text.lower():
            location = city
            if location == "Bangalore":
                location = "Bengaluru"
            break
            
    return {
        "job_type": job_type,
        "hours_worked": hours,
        "location": location,
        "confidence": 0.90
    }

def process_speech_transcript(transcript: str) -> dict:
    """Primary speech extraction function combining Gemini AI and heuristic fallback."""
    if not transcript or not transcript.strip():
        return {
            "job_type": "Worker",
            "hours_worked": 8.0,
            "location": "Chennai",
            "confidence": 0.50,
            "raw_transcript": transcript
        }

    # Attempt Gemini API extraction
    gemini_result = extract_work_details_gemini(transcript)
    if gemini_result and isinstance(gemini_result, dict):
        job = gemini_result.get("job_type")
        hours = gemini_result.get("hours_worked")
        loc = gemini_result.get("location")
        
        # Verify valid values from Gemini
        if job and str(job).strip() and str(job).strip().lower() != "construction worker":
            final_job = str(job).strip().title()
        else:
            final_job = extract_job_type_from_text(transcript)

        try:
            final_hours = float(hours) if hours is not None and float(hours) > 0 else extract_hours_from_text(transcript)
        except (ValueError, TypeError):
            final_hours = extract_hours_from_text(transcript)

        final_loc = str(loc).strip().title() if loc else "Chennai"

        return {
            "job_type": final_job,
            "hours_worked": final_hours,
            "location": final_loc,
            "confidence": 0.98,
            "raw_transcript": transcript
        }

    # Fallback to local heuristic extraction
    fallback_res = fallback_speech_extraction(transcript)
    fallback_res["raw_transcript"] = transcript
    return fallback_res
