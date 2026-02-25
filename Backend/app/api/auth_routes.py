from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from app.schemas.auth_schema import LoginRequest, ChangePasswordRequest
from app.services.auth_service import login_user
from app.api.dependencies import get_current_user
from app.repositories.user_repository import update_user_password, get_user_by_email
from app.repositories.user_repository import get_user_by_id
from app.core.security import hash_password, verify_password
from app.core.database import Database
import secrets
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["Auth"])


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/login")
async def login(data: LoginRequest):
    return await login_user(data.email, data.password)


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user=Depends(get_current_user)
):
    user = await get_user_by_id(current_user["sub"])

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(request.current_password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Current password incorrect")

    new_hashed = hash_password(request.new_password)

    await update_user_password(current_user["sub"], new_hashed)

    return {"message": "Password updated successfully"}


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    """Request password reset - generates a reset token"""
    user = await get_user_by_email(request.email)
    
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If an account exists with this email, a reset link has been sent"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    # Store reset token in database
    db = Database.get_db()
    await db.password_resets.delete_many({"email": request.email})  # Remove old tokens
    await db.password_resets.insert_one({
        "email": request.email,
        "token": reset_token,
        "expires_at": expires_at,
        "created_at": datetime.utcnow()
    })
    
    # In production, send email with reset link
    # For now, return the token (in production, this would only return success message)
    return {
        "message": "If an account exists with this email, a reset link has been sent",
        "reset_token": reset_token  # Remove this in production - only for testing
    }


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset password using token"""
    db = Database.get_db()
    
    # Find valid reset token
    reset_record = await db.password_resets.find_one({
        "token": request.token,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Get user and update password
    user = await get_user_by_email(reset_record["email"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_hashed = hash_password(request.new_password)
    await update_user_password(str(user["_id"]), new_hashed)
    
    # Delete used token
    await db.password_resets.delete_one({"token": request.token})
    
    return {"message": "Password reset successfully"}


@router.get("/me")
async def get_current_user_info(current_user=Depends(get_current_user)):
    """Get current user information"""
    user = await get_user_by_id(current_user["sub"])
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user["role"],
        "phone": user.get("phone", ""),
        "isActive": user.get("isActive", True)
    }