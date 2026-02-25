from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings


class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None
    
    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB"""
        cls.client = AsyncIOMotorClient(settings.MONGO_URI)
        cls.db = cls.client["erp_db"]
        print("Connected to MongoDB")
    
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client is not None:
            cls.client.close()
            print("MongoDB connection closed")
    
    @classmethod
    def get_db(cls) -> AsyncIOMotorDatabase:
        """Get database instance"""
        return cls.db
    
    @classmethod
    async def create_indexes(cls):
        """Create database indexes for performance"""
        if cls.db is None:
            return
        
        # Users collection
        await cls.db.users.create_index("email", unique=True)
        await cls.db.users.create_index("phone")
        await cls.db.users.create_index("role")
        
        # Products collection
        await cls.db.products.create_index("sku", unique=True)
        await cls.db.products.create_index("category")
        
        # Inventory collection
        await cls.db.inventory.create_index("productId")
        await cls.db.inventory.create_index("batchNumber")
        await cls.db.inventory.create_index("expiryDate")
        await cls.db.inventory.create_index("location")
        
        # Orders collection
        await cls.db.orders.create_index("orderNumber", unique=True)
        await cls.db.orders.create_index("shopId")
        await cls.db.orders.create_index("status")
        await cls.db.orders.create_index("createdAt")
        await cls.db.orders.create_index([("createdAt", -1)])
        
        # Deliveries collection
        await cls.db.deliveries.create_index("orderId", unique=True)
        await cls.db.deliveries.create_index("driverId")
        await cls.db.deliveries.create_index("status")
        await cls.db.deliveries.create_index("scheduledDate")
        
        # Shops collection
        await cls.db.shops.create_index("phone")
        await cls.db.shops.create_index("area")
        
        # Suppliers collection
        await cls.db.suppliers.create_index("email")
        await cls.db.suppliers.create_index("agency")
        
        # Activities collection
        await cls.db.activities.create_index("timestamp", expireAfterSeconds=2592000)
        await cls.db.activities.create_index([("timestamp", -1)])
        await cls.db.activities.create_index("type")
        await cls.db.activities.create_index("userId")
        
        # Stock movements collection
        await cls.db.stock_movements.create_index("productId")
        await cls.db.stock_movements.create_index("createdAt")
        await cls.db.stock_movements.create_index("type")


# Dependency for FastAPI routes
async def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency to get database"""
    return Database.get_db()


# Direct database collections for simpler access
def _get_collection(name: str):
    """Get a collection from the database"""
    db = Database.get_db()
    if db is None:
        raise RuntimeError("Database not connected")
    return db[name]


# Lazy collection accessors
class _CollectionProxy:
    def __init__(self, name: str):
        self.name = name
    
    def __getattr__(self, attr):
        return getattr(_get_collection(self.name), attr)
    
    def __call__(self, *args, **kwargs):
        return _get_collection(self.name)


# For backward compatibility with existing code
users_collection = _CollectionProxy("users")