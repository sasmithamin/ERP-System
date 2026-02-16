from app.core.database import users_collection

# Get user by email (used during login)
async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

# Get user by ID (used after token validation)
async def get_user_by_id(user_id):
    return await users_collection.find_one({"_id": user_id})

# Create new user (admin creates users)
async def create_user(user_data: dict):
    return await users_collection.insert_one(user_data)
