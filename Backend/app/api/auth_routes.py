from fastapi import APIRouter
from app.schemas.auth_schema import LoginRequest
from app.services.auth_service import login_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
async def login(data: LoginRequest):
    return await login_user(data.email, data.password)
