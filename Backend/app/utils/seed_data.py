import asyncio
from datetime import datetime, timedelta
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

from app.core.config import settings
from app.core.database import Database

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed_database():
    """Seed database with initial data matching your mockData"""
    print("Connecting to database...")
    await Database.connect_db()
    db = Database.get_db()
    
    # Clear existing data
    print("Clearing existing data...")
    await db.users.delete_many({})
    await db.products.delete_many({})
    await db.inventory.delete_many({})
    await db.shops.delete_many({})
    await db.suppliers.delete_many({})
    await db.orders.delete_many({})
    await db.deliveries.delete_many({})
    await db.activities.delete_many({})
    
    # Seed Users
    print("Seeding users...")
    users = [
        {
            "_id": ObjectId("65a1b2c3d4e5f6a7b8c9d001"),
            "name": "Kamal Perera",
            "email": "kamal@dms.lk",
            "phone": "+94771234567",
            "role": "admin",
            "hashed_password": pwd_context.hash("admin123"),
            "isActive": True,
            "createdAt": datetime(2024, 1, 1),
            "lastLogin": datetime.utcnow()
        },
        {
            "_id": ObjectId("65a1b2c3d4e5f6a7b8c9d002"),
            "name": "Nimal Silva",
            "email": "nimal@dms.lk",
            "phone": "+94772345678",
            "role": "warehouse",
            "hashed_password": pwd_context.hash("warehouse123"),
            "isActive": True,
            "createdAt": datetime(2024, 2, 15),
            "lastLogin": datetime.utcnow()
        },
        {
            "_id": ObjectId("65a1b2c3d4e5f6a7b8c9d003"),
            "name": "Sunil Fernando",
            "email": "sunil@dms.lk",
            "phone": "+94773456789",
            "role": "delivery",
            "hashed_password": pwd_context.hash("delivery123"),
            "isActive": True,
            "createdAt": datetime(2024, 3, 1),
            "lastLogin": datetime.utcnow()
        },
        {
            "_id": ObjectId("65a1b2c3d4e5f6a7b8c9d004"),
            "name": "Ruwan Jayawardena",
            "email": "ruwan@dms.lk",
            "phone": "+94774567890",
            "role": "delivery",
            "hashed_password": pwd_context.hash("delivery123"),
            "isActive": True,
            "createdAt": datetime(2024, 3, 10)
        },
        {
            "_id": ObjectId("65a1b2c3d4e5f6a7b8c9d005"),
            "name": "Chamara Bandara",
            "email": "chamara@dms.lk",
            "phone": "+94775678901",
            "role": "warehouse",
            "hashed_password": pwd_context.hash("warehouse123"),
            "isActive": False,
            "createdAt": datetime(2024, 1, 20)
        }
    ]
    await db.users.insert_many(users)
    
    # Seed Products
    print("Seeding products...")
    products = [
        # Dairy Products
        {
            "_id": ObjectId("65b1c2d3e4f5a6b7c8d9e001"),
            "name": "Fresh Milk 1L",
            "sku": "DRY-FM-1L",
            "category": "dairy",
            "unit": "Liters",
            "unitPrice": 320,
            "reorderLevel": 100,
            "isActive": True
        },
        {
            "_id": ObjectId("65b1c2d3e4f5a6b7c8d9e002"),
            "name": "Fresh Milk 500ml",
            "sku": "DRY-FM-500",
            "category": "dairy",
            "unit": "ml",
            "unitPrice": 170,
            "reorderLevel": 150,
            "isActive": True
        },
        {
            "_id": ObjectId("65b1c2d3e4f5a6b7c8d9e003"),
            "name": "Curd 400g",
            "sku": "DRY-CRD-400",
            "category": "dairy",
            "unit": "grams",
            "unitPrice": 180,
            "reorderLevel": 80,
            "isActive": True
        },
        {
            "_id": ObjectId("65b1c2d3e4f5a6b7c8d9e004"),
            "name": "Yogurt Strawberry 80g",
            "sku": "DRY-YGT-STR",
            "category": "dairy",
            "unit": "grams",
            "unitPrice": 75,
            "reorderLevel": 200,
            "isActive": True
        },
        {
            "_id": ObjectId("65b1c2d3e4f5a6b7c8d9e005"),
            "name": "Butter 200g",
            "sku": "DRY-BTR-200",
            "category": "dairy",
            "unit": "grams",
            "unitPrice": 420,
            "reorderLevel": 50,
            "isActive": True
        },
        # Biscuit Products
        {
            "_id": ObjectId("65b1c2d3e4f5a6b7c8d9e006"),
            "name": "Marie Biscuits 300g",
            "sku": "BSC-MRE-300",
            "category": "biscuit",
            "unit": "packs",
            "unitPrice": 150,
            "reorderLevel": 100,
            "isActive": True
        },
        {
            "_id": ObjectId("65b1c2d3e4f5a6b7c8d9e007"),
            "name": "Cream Crackers 500g",
            "sku": "BSC-CRM-500",
            "category": "biscuit",
            "unit": "packs",
            "unitPrice": 280,
            "reorderLevel": 80,
            "isActive": True
        },
        {
            "_id": ObjectId("65b1c2d3e4f5a6b7c8d9e008"),
            "name": "Chocolate Cookies 200g",
            "sku": "BSC-CHO-200",
            "category": "biscuit",
            "unit": "packs",
            "unitPrice": 220,
            "reorderLevel": 120,
            "isActive": True
        },
        {
            "_id": ObjectId("65b1c2d3e4f5a6b7c8d9e009"),
            "name": "Digestive Biscuits 400g",
            "sku": "BSC-DIG-400",
            "category": "biscuit",
            "unit": "packs",
            "unitPrice": 320,
            "reorderLevel": 60,
            "isActive": True
        },
        {
            "_id": ObjectId("65b1c2d3e4f5a6b7c8d9e010"),
            "name": "Lemon Puff 200g",
            "sku": "BSC-LMP-200",
            "category": "biscuit",
            "unit": "packs",
            "unitPrice": 180,
            "reorderLevel": 100,
            "isActive": True
        }
    ]
    await db.products.insert_many(products)
    
    # Seed Shops
    print("Seeding shops...")
    shops = [
        {
            "_id": ObjectId("65c1d2e3f4a5b6c7d8e9f001"),
            "name": "City Mart Negombo",
            "ownerName": "Mr. Wijesinghe",
            "phone": "+94776789012",
            "email": "citymart@gmail.com",
            "address": "234 Main Street, Negombo",
            "area": "Negombo Central",
            "creditLimit": 50000,
            "currentBalance": 12500,
            "isActive": True,
            "createdAt": datetime(2024, 1, 10)
        },
        {
            "_id": ObjectId("65c1d2e3f4a5b6c7d8e9f002"),
            "name": "Fresh Foods Corner",
            "ownerName": "Mrs. Dissanayake",
            "phone": "+94777890123",
            "address": "56 Beach Road, Negombo",
            "area": "Beach Side",
            "creditLimit": 30000,
            "currentBalance": 8200,
            "isActive": True,
            "createdAt": datetime(2024, 1, 20)
        },
        {
            "_id": ObjectId("65c1d2e3f4a5b6c7d8e9f003"),
            "name": "Super Save Store",
            "ownerName": "Mr. Gunasekara",
            "phone": "+94778901234",
            "email": "supersave@gmail.com",
            "address": "89 Temple Road, Negombo",
            "area": "Temple Area",
            "creditLimit": 75000,
            "currentBalance": 0,
            "isActive": True,
            "createdAt": datetime(2024, 2, 1)
        },
        {
            "_id": ObjectId("65c1d2e3f4a5b6c7d8e9f004"),
            "name": "Daily Needs Shop",
            "ownerName": "Ms. Kumari",
            "phone": "+94779012345",
            "address": "12 Market Lane, Negombo",
            "area": "Market Area",
            "creditLimit": 25000,
            "currentBalance": 5600,
            "isActive": True,
            "createdAt": datetime(2024, 2, 15)
        },
        {
            "_id": ObjectId("65c1d2e3f4a5b6c7d8e9f005"),
            "name": "Family Grocery",
            "ownerName": "Mr. Rathnayake",
            "phone": "+94770123456",
            "address": "45 School Road, Negombo",
            "area": "School Area",
            "creditLimit": 40000,
            "currentBalance": 18900,
            "isActive": True,
            "createdAt": datetime(2024, 3, 1)
        }
    ]
    await db.shops.insert_many(shops)
    
    # Seed Suppliers
    print("Seeding suppliers...")
    suppliers = [
        {
            "_id": ObjectId("65d1e2f3a4b5c6d7e8f9001"),
            "name": "Milco Dairy Pvt Ltd",
            "agency": "dairy",
            "contactPerson": "Mr. Bandara",
            "phone": "+94112234567",
            "email": "orders@milco.lk",
            "address": "123 Industrial Zone, Colombo",
            "isActive": True,
            "createdAt": datetime(2024, 1, 1)
        },
        {
            "_id": ObjectId("65d1e2f3a4b5c6d7e8f9002"),
            "name": "Lanka Dairies",
            "agency": "dairy",
            "contactPerson": "Mrs. Fernando",
            "phone": "+94112345678",
            "email": "supply@lankadairies.lk",
            "address": "45 Milk Road, Kurunegala",
            "isActive": True,
            "createdAt": datetime(2024, 1, 15)
        },
        {
            "_id": ObjectId("65d1e2f3a4b5c6d7e8f9003"),
            "name": "Maliban Biscuits",
            "agency": "biscuit",
            "contactPerson": "Mr. Silva",
            "phone": "+94112456789",
            "email": "orders@maliban.lk",
            "address": "78 Factory Lane, Ratmalana",
            "isActive": True,
            "createdAt": datetime(2024, 1, 1)
        },
        {
            "_id": ObjectId("65d1e2f3a4b5c6d7e8f9004"),
            "name": "Munchee Biscuits",
            "agency": "biscuit",
            "contactPerson": "Mr. Perera",
            "phone": "+94112567890",
            "email": "supply@munchee.lk",
            "address": "56 Industrial Estate, Ja-Ela",
            "isActive": True,
            "createdAt": datetime(2024, 2, 1)
        }
    ]
    await db.suppliers.insert_many(suppliers)
    
    print("Database seeding completed successfully!")
    await Database.close_db()


if __name__ == "__main__":
    asyncio.run(seed_database())