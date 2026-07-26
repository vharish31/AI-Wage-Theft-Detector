import datetime
from fastapi import APIRouter, HTTPException
from app.models.verification_method import (
    MethodSelectPayload,
    MethodSelectResponse,
    VerificationMethodPreference
)

router = APIRouter(prefix="/api/verification-method", tags=["Verification Method Router"])

# Memory store for user preferences
USER_METHOD_PREFERENCES = {}

@router.post("/select", response_model=MethodSelectResponse)
async def select_verification_method(payload: MethodSelectPayload):
    """
    POST /api/verification-method/select
    Logs and remembers the worker's selected verification method.
    """
    method = payload.selected_method.lower()
    if method not in ["payslip", "voice", "manual"]:
        raise HTTPException(status_code=400, detail="Invalid verification method. Choose 'payslip', 'voice', or 'manual'.")

    user_id = payload.user_id or "user-01"
    now_str = datetime.datetime.now().isoformat()

    USER_METHOD_PREFERENCES[user_id] = {
        "user_id": user_id,
        "last_selected_method": method,
        "last_updated": now_str
    }

    return MethodSelectResponse(
        user_id=user_id,
        selected_method=method,
        status="success",
        message=f"Verification method '{method}' selected and saved."
    )

@router.get("/preference", response_model=VerificationMethodPreference)
async def get_user_verification_preference(user_id: str = "user-01"):
    """
    GET /api/verification-method/preference
    Returns the user's previously selected verification method preference.
    """
    pref = USER_METHOD_PREFERENCES.get(user_id, {
        "user_id": user_id,
        "last_selected_method": "payslip",
        "last_updated": datetime.datetime.now().isoformat()
    })
    return VerificationMethodPreference(**pref)
