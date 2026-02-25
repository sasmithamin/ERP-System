from bson import ObjectId
from app.core.database import Database


# Get user by email (used during login)
async def get_user_by_email(email: str):
    db = Database.get_db()
    return await db.users.find_one({"email": email})


# Get user by ID (used after token validation)
async def get_user_by_id(user_id: str):
    db = Database.get_db()
    return await db.users.find_one({"_id": ObjectId(user_id)})


# Create new user (admin creates users)
async def create_user(user_data: dict):
    db = Database.get_db()
    return await db.users.insert_one(user_data)


# Update password
async def update_user_password(user_id: str, hashed_password: str):
    db = Database.get_db()
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "hashed_password": hashed_password,
                "must_change_password": False
            }
        }
    )