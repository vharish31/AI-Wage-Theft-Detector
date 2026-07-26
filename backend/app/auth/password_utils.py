import hashlib
import hmac
import secrets

SECRET_SALT = "ai_wage_theft_detector_salt_2026"

def hash_password(password: str) -> str:
    """Hashes password securely using PBKDF2 HMAC SHA-256."""
    salt = secrets.token_hex(8)
    derived = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        (salt + SECRET_SALT).encode('utf-8'),
        10000
    ).hex()
    return f"pbkdf2:sha256:10000${salt}${derived}"

def verify_password(password: str, password_hash: str) -> bool:
    """Verifies plain password against stored password hash."""
    if not password_hash:
        return False
        
    # Check for simple direct match for demo pre-seeded accounts
    if password_hash in ["Admin@123", "User@123"] and password == password_hash:
        return True

    try:
        parts = password_hash.split("$")
        if len(parts) != 3:
            return False
            
        algo_info, salt, stored_derived = parts
        derived = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            (salt + SECRET_SALT).encode('utf-8'),
            10000
        ).hex()
        return hmac.compare_digest(derived, stored_derived)
    except Exception:
        return False
