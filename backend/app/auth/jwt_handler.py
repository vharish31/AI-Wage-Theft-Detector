import json
import base64
import hmac
import hashlib
import time
import os
from typing import Dict, Any, Optional

JWT_SECRET = os.getenv("JWT_SECRET", "ai_wage_theft_detector_jwt_secret_key_2026_antigravity").strip()
TOKEN_EXPIRATION_SECONDS = 86400 * 7  # 7 Days

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def _base64url_decode(data_str: str) -> bytes:
    padding = '=' * (4 - (len(data_str) % 4))
    return base64.urlsafe_b64decode(data_str + padding)

def generate_jwt_token(user_id: str, email: str, role: str, name: str) -> str:
    """Generates signed JWT token for user session."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "userId": user_id,
        "email": email,
        "role": role,
        "name": name,
        "iat": int(time.time()),
        "exp": int(time.time()) + TOKEN_EXPIRATION_SECONDS
    }

    header_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')

    encoded_header = _base64url_encode(header_json)
    encoded_payload = _base64url_encode(payload_json)

    signing_input = f"{encoded_header}.{encoded_payload}".encode('utf-8')
    signature = hmac.new(JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
    encoded_signature = _base64url_encode(signature)

    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

def verify_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """Verifies JWT token signature and expiration. Returns payload dict or None."""
    if not token or not isinstance(token, str):
        return None

    # Handle 'Bearer <token>' prefix if present
    if token.startswith("Bearer "):
        token = token[7:]

    parts = token.split(".")
    if len(parts) != 3:
        return None

    encoded_header, encoded_payload, encoded_signature = parts

    try:
        signing_input = f"{encoded_header}.{encoded_payload}".encode('utf-8')
        expected_sig = hmac.new(JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
        actual_sig = _base64url_decode(encoded_signature)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload_bytes = _base64url_decode(encoded_payload)
        payload = json.loads(payload_bytes.decode('utf-8'))

        exp = payload.get("exp", 0)
        if time.time() > exp:
            return None

        return payload
    except Exception:
        return None
