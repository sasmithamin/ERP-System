from fastapi import FastAPI
from app.api.auth_routes import router as auth_router
from app.utils.seed_admin import seed_admin
from app.api.user_routes import router as user_router

app = FastAPI()

app.include_router(user_router)

@app.on_event("startup")
async def startup():
    await seed_admin()

app.include_router(auth_router)
