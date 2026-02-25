from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from app.core.database import Database
from app.api import auth_routes, user_routes
from app.api.endpoints import dashboard

app = FastAPI(
    title="ERP System API",
    description="Backend API for ERP System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    await Database.connect_db()
    # Create indexes
    await Database.create_indexes()

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    await Database.close_db()

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(auth_routes.router, prefix="/api")
app.include_router(user_routes.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")  # Add dashboard routes