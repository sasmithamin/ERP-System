from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth_schema import LoginRequest, ChangePasswordRequest
from app.services.auth_service import login_user
from app.api.dependencies import get_current_user
from app.repositories.user_repository import update_user_password
from app.repositories.user_repository import get_user_by_id
from app.core.security import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])

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