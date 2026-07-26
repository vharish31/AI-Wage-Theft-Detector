from fastapi import Header, HTTPException, status, Depends
from typing import Optional, List, Dict, Any

from app.auth.jwt_handler import verify_jwt_token

async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    FastAPI dependency that extracts and verifies JWT token from Authorization header.
    Raises HTTP 401 if token is missing, invalid, or expired.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required. Please log in to access this resource."
        )

    token = authorization
    if authorization.startswith("Bearer "):
        token = authorization[7:]

    payload = verify_jwt_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token. Please log in again."
        )

    return payload

def require_role(allowed_roles: List[str]):
    """
    FastAPI dependency factory enforcing role-based access control.
    Example: Depends(require_role(["ADMIN"]))
    """
    async def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user.get("role")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Action requires one of {allowed_roles} roles."
            )
        return current_user
    return role_checker
