from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from enum import Enum
import datetime

class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"

class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, description="Full Name")
    email: str = Field(..., description="Email address")
    password: str = Field(..., min_length=6, description="Password")
    phone: Optional[str] = "+91 98765 43210"
    state: Optional[str] = "Tamil Nadu"
    role: Optional[UserRole] = UserRole.USER

class UserLoginRequest(BaseModel):
    email: str = Field(..., description="Registered Email")
    password: str = Field(..., description="Password")

class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    state: Optional[str] = None
    language: Optional[str] = "English"
    password: Optional[str] = None

class UserAuthResponse(BaseModel):
    userId: str
    name: str
    email: str
    role: str
    token: str
    phone: Optional[str] = None
    state: Optional[str] = None
    status: str = "ACTIVE"
    createdAt: str

class UserRecord(BaseModel):
    id: str
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    state: Optional[str] = None
    status: str = "ACTIVE"
    created_at: str
    last_login: Optional[str] = None

class AdminUserManageRequest(BaseModel):
    userId: str
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None
