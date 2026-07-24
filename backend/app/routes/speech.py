from fastapi import APIRouter, HTTPException, status
from app.models.worker import SpeechExtractRequest, SpeechExtractResponse
from app.services.speech_service import process_speech_transcript

router = APIRouter(prefix="/speech", tags=["Speech & AI Extraction"])

@router.post("/extract", response_model=SpeechExtractResponse, status_code=status.HTTP_200_OK)
async def extract_speech_data(payload: SpeechExtractRequest):
    """
    POST /speech/extract
    Accepts speech transcript and uses Gemini AI (with heuristic fallback)
    to extract job_type, hours_worked, and location.
    """
    if not payload.transcript or not payload.transcript.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transcript content cannot be empty."
        )

    try:
        extracted = process_speech_transcript(payload.transcript)
        return SpeechExtractResponse(
            job_type=extracted.get("job_type", "Construction Worker"),
            hours_worked=float(extracted.get("hours_worked", 8.0)),
            location=extracted.get("location", "Chennai"),
            confidence=float(extracted.get("confidence", 0.95)),
            raw_transcript=payload.transcript
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error extracting speech data: {str(e)}"
        )
