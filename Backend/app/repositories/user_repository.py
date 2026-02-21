from app.core.database import users_collection
from bson import ObjectId

# Get user by email (used during login)
async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

# Get user by ID (used after token validation)
async def get_user_by_id(user_id: str):
    return await users_collection.find_one(
        {"_id": ObjectId(user_id)}
    )

# Create new user (admin creates users)
async def create_user(user_data: dict):
    return await users_collection.insert_one(user_data)

#update pw
async def update_user_password(user_id: str, hashed_password: str):
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "hashed_password": hashed_password,
                "must_change_password": False
            }
        }
    )