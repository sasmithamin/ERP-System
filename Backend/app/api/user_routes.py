from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from datetime import datetime
from app.api.dependencies import require_role
from app.core.security import hash_password
from app.core.database import users_collection

router = APIRouter(prefix="/users", tags=["Users"])



# Create User (Admin Only)

@router.post("/")
async def create_user(
    email: str,
    password: str,
    role: str,
    current_user=Depends(require_role(["admin"]))
):
    
    allowed_roles = ["admin", "employee", "manager", "warehouse"]

    if role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Allowed roles: {allowed_roles}"
        )

    existing = await users_collection.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = {
        "email": email,
        "hashed_password": hash_password(password),
        "role": role,
        "is_active": True,
        "must_change_password": True,
        "created_at": datetime.utcnow()
    }

    result = await users_collection.insert_one(new_user)

    return {
        "message": "User created",
        "user_id": str(result.inserted_id)
    }



# Get All Users (Admin Only)

@router.get("/")
async def get_users(
    current_user=Depends(require_role(["admin"]))
):

    users = await users_collection.find().to_list(100)

    for user in users:
        user["_id"] = str(user["_id"])
        del user["hashed_password"]

    return users

@router.patch("/{user_id}/status")
async def update_user_status(
    user_id: str,
    is_active: bool,
    current_user=Depends(require_role(["admin"]))
):
    # Prevent admin from deactivating themselves
    if str(current_user.get("_id")) == user_id:
        raise HTTPException(
            status_code=400,
            detail="You cannot deactivate your own account"
        )

    user = await users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "is_active": is_active,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {
        "message": f"User {'activated' if is_active else 'deactivated'} successfully"
    }