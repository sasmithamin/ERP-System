from app.core.database import users_collection
from app.core.security import hash_password
from app.models.user_model import user_document

async def seed_admin():
    existing = await users_collection.find_one({"role": "admin"})

    if not existing:
        await users_collection.insert_one(
            user_document(
                "admin@company.com",
                hash_password("Admin@123"),
                "admin"
            )
        )
