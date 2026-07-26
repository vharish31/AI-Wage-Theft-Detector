from pydantic import BaseModel, Field
from typing import Optional

class MethodSelectPayload(BaseModel):
    user_id: Optional[str] = "user-01"
    selected_method: str  # "payslip" | "voice" | "manual"
    timestamp: Optional[str] = None

class MethodSelectResponse(BaseModel):
    user_id: str
    selected_method: str
    status: str
    message: str

class VerificationMethodPreference(BaseModel):
    user_id: str
    last_selected_method: str
    last_updated: str
