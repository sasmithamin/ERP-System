from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from bson import ObjectId
from app.core.config import settings
from app.core.database import Database
from app.schemas.user_schema import User

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Decode JWT token and return user payload"""
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_current_active_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Get current user as User schema (for dashboard routes)"""
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    # Get user from database
    db = Database.get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.get("isActive", True):
        raise HTTPException(status_code=403, detail="Inactive user")
    
    # Return as User schema
    return User(
        id=str(user["_id"]),
        name=user.get("name", ""),
        email=user["email"],
        phone=user.get("phone", ""),
        role=user["role"],
        avatar=user.get("avatar"),
        isActive=user.get("isActive", True),
        createdAt=user.get("createdAt"),
        lastLogin=user.get("lastLogin")
    )


def require_role(allowed_roles: list):
    def role_checker(current_user=Depends(get_current_user)):

        if not current_user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Inactive user"
            )

        if current_user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized"
            )

        return current_user

    return role_checker