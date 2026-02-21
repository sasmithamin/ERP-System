from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import settings

#pw hash

ph = PasswordHasher()

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    try:
        ph.verify(hashed, password)
        return True
    except VerifyMismatchError:
        return False
    
#jwt token creation

def create_access_token(user_id: str, role: str):
    paylaod = {
        "sub": user_id,
        "role": role,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }
    return jwt.encode(paylaod, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)