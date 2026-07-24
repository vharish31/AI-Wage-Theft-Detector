import os
import json
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

def extract_work_details_gemini(transcript: str) -> dict:
    """
    Uses Gemini API to extract job_type, hours_worked, and location from a speech transcript.
    Returns dict with keys: job_type, hours_worked, location.
    """
    if not GEMINI_API_KEY:
        logger.info("No GEMINI_API_KEY provided. Using rule-based extraction fallback.")
        return None

    prompt = f"""
    You are an AI assistant specialized in analyzing labor work transcripts from gig, construction, and informal workers.
    Extract the following information from the user transcript:
    1. job_type (e.g. Construction Worker, Delivery Partner, Painter, Electrician, Security Guard, Domestic Worker, etc.)
    2. hours_worked (number, set to null if not explicitly mentioned in the transcript)
    3. location (city or state in India, set to null if not explicitly mentioned in the transcript)

    Return ONLY a raw JSON object with exactly these keys:
    {{
      "job_type": "string or null",
      "hours_worked": number or null,
      "location": "string or null"
    }}

    Transcript: "{transcript}"
    """

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.1,
                "response_mime_type": "application/json"
            }
        }
        
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            res_data = response.json()
            text_content = res_data["candidates"][0]["content"]["parts"][0]["text"]
            extracted = json.loads(text_content)
            return extracted
        else:
            logger.warning(f"Gemini API returned status code {response.status_code}: {response.text}")
            return None
    except Exception as e:
        logger.error(f"Error calling Gemini API for extraction: {str(e)}")
        return None

def generate_complaint_letter_gemini(job_type: str, location: str, expected: float, received: float, hours_worked: float = 8.0, worker_name: str = "Worker", employer_name: str = "Employer / Contractor") -> str:
    """
    Uses Gemini API to generate a formal legal complaint letter to the Labor Commissioner.
    """
    difference = expected - received
    percentage = round((difference / expected) * 100, 1) if expected > 0 else 0

    if not GEMINI_API_KEY:
        logger.info("No GEMINI_API_KEY provided. Using structured complaint template generator.")
        return None

    prompt = f"""
    You are an expert labor rights advocate and legal counselor in India.
    Draft a formal, rigorous, and legally structured wage theft complaint letter addressed to the Regional Labor Commissioner / Labor Inspector.

    Worker Details:
    - Worker Name: {worker_name}
    - Job Role: {job_type}
    - Location / City: {location}
    - Hours Worked per shift: {hours_worked} hours
    - Official Minimum / Standard Daily Wage: ₹{expected:.2f}
    - Actual Wage Received: ₹{received:.2f}
    - Total Shortfall / Underpayment: ₹{difference:.2f} ({percentage}% wage theft)
    - Employer / Contractor Name: {employer_name}

    Include references to statutory regulations such as the Minimum Wages Act, 1948, the Payment of Wages Act, 1936, and local state wage notification rules.
    Format clearly with formal Subject, Reference, Facts of Underpayment, Statutory Violations, Relief Demanded, and Signature Block.
    Do not use generic placeholders; fill in the provided details clearly.
    """

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.3
            }
        }
        
        response = requests.post(url, json=payload, timeout=12)
        if response.status_code == 200:
            res_data = response.json()
            letter = res_data["candidates"][0]["content"]["parts"][0]["text"]
            return letter.strip()
        else:
            logger.warning(f"Gemini API returned status code {response.status_code} for complaint generation.")
            return None
    except Exception as e:
        logger.error(f"Error calling Gemini API for complaint generation: {str(e)}")
        return None
