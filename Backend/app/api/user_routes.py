from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from app.api.dependencies import require_role
from app.core.security import hash_password
from app.core.database import Database

router = APIRouter(prefix="/users", tags=["Users"])


# Create User (Admin Only)
@router.post("/")
async def create_user(
    email: str,
    password: str,
    role: str,
    current_user=Depends(require_role(["admin"]))
):
    allowed_roles = ["admin", "employee", "manager", "warehouse", "delivery"]

    if role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Allowed roles: {allowed_roles}"
        )

    db = Database.get_db()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = {
        "email": email,
        "hashed_password": hash_password(password),
        "role": role,
        "isActive": True,
        "must_change_password": True,
        "createdAt": datetime.utcnow()
    }

    result = await db.users.insert_one(new_user)

    return {
        "message": "User created",
        "user_id": str(result.inserted_id)
    }


# Get All Users (Admin Only)
@router.get("/")
async def get_users(
    current_user=Depends(require_role(["admin"]))
):
    db = Database.get_db()
    users = await db.users.find().to_list(100)

    for user in users:
        user["_id"] = str(user["_id"])
        if "hashed_password" in user:
            del user["hashed_password"]

    return users


@router.patch("/{user_id}/status")
async def update_user_status(
    user_id: str,
    is_active: bool,
    current_user=Depends(require_role(["admin"]))
):
    # Prevent admin from deactivating themselves
    if str(current_user.get("sub")) == user_id:
        raise HTTPException(
            status_code=400,
            detail="You cannot deactivate your own account"
        )

    db = Database.get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "isActive": is_active,
                "updatedAt": datetime.utcnow()
            }
        }
    )

    return {
        "message": f"User {'activated' if is_active else 'deactivated'} successfully"
    }


@router.patch("/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: str,
    current_user=Depends(require_role(["admin"]))
):
    """Change user role (Admin Only)"""
    allowed_roles = ["admin", "employee", "manager", "warehouse", "delivery"]
    
    if role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Allowed roles: {allowed_roles}"
        )
    
    db = Database.get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "role": role,
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    return {"message": f"User role updated to {role}"}