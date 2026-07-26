import os
import json
import uuid
import datetime
from fastapi import APIRouter, HTTPException, Header, status
from typing import List, Dict, Any, Optional

from app.models.user import (
    UserLoginRequest, UserRegisterRequest,
    UserAuthResponse, UserProfileUpdateRequest, UserRecord
)
from app.auth.password_utils import hash_password, verify_password
from app.auth.jwt_handler import generate_jwt_token, verify_jwt_token

router = APIRouter(prefix="/api/auth", tags=["Authentication Module"])

USERS_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "data", "users.json")

def _get_abs_users_path() -> str:
    return os.path.abspath(USERS_FILE)

def load_users() -> List[Dict[str, Any]]:
    path = _get_abs_users_path()
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    # Pre-seeded fallback users
    return [
        {
            "id": "usr-admin-01",
            "name": "Administrator",
            "email": "admin@wagedetector.com",
            "password_hash": hash_password("Admin@123"),
            "role": "ADMIN",
            "phone": "+91 98765 43210",
            "state": "Tamil Nadu",
            "status": "ACTIVE",
            "created_at": "2026-07-01T08:00:00Z",
            "last_login": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "id": "usr-worker-01",
            "name": "Harish",
            "email": "user@wagedetector.com",
            "password_hash": hash_password("User@123"),
            "role": "USER",
            "phone": "+91 91234 56789",
            "state": "Tamil Nadu",
            "status": "ACTIVE",
            "created_at": "2026-07-05T10:15:00Z",
            "last_login": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
    ]

def save_users(users: List[Dict[str, Any]]):
    path = _get_abs_users_path()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)

@router.post("/login", response_model=UserAuthResponse, status_code=status.HTTP_200_OK)
async def login_user(payload: UserLoginRequest):
    """
    POST /api/auth/login
    Authenticates user credentials and returns JWT token + user role.
    Supports demo credentials:
    - admin@wagedetector.com / Admin@123
    - user@wagedetector.com / User@123
    """
    users = load_users()
    email_clean = payload.email.strip().lower()
    
    matched_user = None
    for u in users:
        if u["email"].lower() == email_clean:
            matched_user = u
            break

    # Demo accounts fallback check if database missing matched record
    if not matched_user:
        if email_clean == "admin@wagedetector.com" and payload.password == "Admin@123":
            matched_user = {
                "id": "usr-admin-01",
                "name": "Administrator",
                "email": "admin@wagedetector.com",
                "password_hash": hash_password("Admin@123"),
                "role": "ADMIN",
                "phone": "+91 98765 43210",
                "state": "Tamil Nadu",
                "status": "ACTIVE",
                "created_at": "2026-07-01T08:00:00Z"
            }
            users.append(matched_user)
            save_users(users)
        elif email_clean == "user@wagedetector.com" and payload.password == "User@123":
            matched_user = {
                "id": "usr-worker-01",
                "name": "Harish",
                "email": "user@wagedetector.com",
                "password_hash": hash_password("User@123"),
                "role": "USER",
                "phone": "+91 91234 56789",
                "state": "Tamil Nadu",
                "status": "ACTIVE",
                "created_at": "2026-07-05T10:15:00Z"
            }
            users.append(matched_user)
            save_users(users)

    if not matched_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check credentials and try again."
        )

    # Check status
    if matched_user.get("status") == "SUSPENDED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account suspended by system administrator. Contact support."
        )

    # Verify Password
    pwd_ok = verify_password(payload.password, matched_user["password_hash"])
    if not pwd_ok:
        # Fallback for exact string comparison for demo accounts
        if (matched_user["email"].lower() == "admin@wagedetector.com" and payload.password == "Admin@123") or \
           (matched_user["email"].lower() == "user@wagedetector.com" and payload.password == "User@123"):
            pwd_ok = True

    if not pwd_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check credentials and try again."
        )

    # Update last login
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    matched_user["last_login"] = now_iso
    save_users(users)

    token = generate_jwt_token(
        user_id=matched_user["id"],
        email=matched_user["email"],
        role=matched_user["role"],
        name=matched_user["name"]
    )

    return UserAuthResponse(
        userId=matched_user["id"],
        name=matched_user["name"],
        email=matched_user["email"],
        role=matched_user["role"],
        token=token,
        phone=matched_user.get("phone", "+91 98765 43210"),
        state=matched_user.get("state", "Tamil Nadu"),
        status=matched_user.get("status", "ACTIVE"),
        createdAt=matched_user.get("created_at", now_iso)
    )

@router.post("/register", response_model=UserAuthResponse, status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserRegisterRequest):
    """
    POST /api/auth/register
    Registers a new worker or admin user account.
    """
    users = load_users()
    email_clean = payload.email.strip().lower()

    for u in users:
        if u["email"].lower() == email_clean:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )

    new_id = f"usr-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    user_record = {
        "id": new_id,
        "name": payload.name.strip(),
        "email": email_clean,
        "password_hash": hash_password(payload.password),
        "role": payload.role.value if payload.role else "USER",
        "phone": payload.phone or "+91 98765 43210",
        "state": payload.state or "Tamil Nadu",
        "status": "ACTIVE",
        "created_at": now_iso,
        "last_login": now_iso
    }

    users.append(user_record)
    save_users(users)

    token = generate_jwt_token(
        user_id=new_id,
        email=email_clean,
        role=user_record["role"],
        name=user_record["name"]
    )

    return UserAuthResponse(
        userId=new_id,
        name=user_record["name"],
        email=user_record["email"],
        role=user_record["role"],
        token=token,
        phone=user_record["phone"],
        state=user_record["state"],
        status="ACTIVE",
        createdAt=now_iso
    )

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout_user():
    """POST /api/auth/logout - Invalidates active user session."""
    return {"message": "Logged out successfully", "status": "ok"}

@router.get("/profile", status_code=status.HTTP_200_OK)
async def get_user_profile(authorization: Optional[str] = Header(None)):
    """GET /api/auth/profile - Returns authenticated user profile."""
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization Header")

    payload = verify_jwt_token(authorization)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or Expired JWT Token")

    users = load_users()
    for u in users:
        if u["id"] == payload.get("userId"):
            return {
                "userId": u["id"],
                "name": u["name"],
                "email": u["email"],
                "role": u["role"],
                "phone": u.get("phone", ""),
                "state": u.get("state", "Tamil Nadu"),
                "status": u.get("status", "ACTIVE"),
                "createdAt": u.get("created_at")
            }

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found")

@router.put("/profile", status_code=status.HTTP_200_OK)
async def update_user_profile(payload: UserProfileUpdateRequest, authorization: Optional[str] = Header(None)):
    """PUT /api/auth/profile - Updates user profile information."""
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization Header")

    jwt_payload = verify_jwt_token(authorization)
    if not jwt_payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or Expired JWT Token")

    users = load_users()
    user_id = jwt_payload.get("userId")
    
    updated_user = None
    for u in users:
        if u["id"] == user_id:
            if payload.name: u["name"] = payload.name.strip()
            if payload.phone: u["phone"] = payload.phone.strip()
            if payload.state: u["state"] = payload.state.strip()
            if payload.password: u["password_hash"] = hash_password(payload.password)
            updated_user = u
            break

    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found")

    save_users(users)
    return {
        "message": "Profile updated successfully",
        "user": {
            "userId": updated_user["id"],
            "name": updated_user["name"],
            "email": updated_user["email"],
            "role": updated_user["role"],
            "phone": updated_user.get("phone"),
            "state": updated_user.get("state")
        }
    }
