from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    WAREHOUSE = "warehouse"
    DELIVERY = "delivery"


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    role: UserRole
    avatar: Optional[str] = None
    isActive: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    avatar: Optional[str] = None
    isActive: Optional[bool] = None
    password: Optional[str] = None


class User(UserBase):
    id: str
    createdAt: datetime
    lastLogin: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserInDB(User):
    hashed_password: str