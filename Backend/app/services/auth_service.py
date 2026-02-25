from fastapi import HTTPException
from app.repositories.user_repository import get_user_by_email
from app.core.security import verify_password, create_access_token

async def login_user(email: str, password: str):
    user = await get_user_by_email(email)

    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": create_access_token(str(user["_id"]), user["role"]),
        "must_change_password": user["must_change_password"],
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", ""),
            "role": user["role"]
        }
    }
