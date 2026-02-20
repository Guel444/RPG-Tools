from pydantic import BaseModel, EmailStr
from typing import Optional, List

# ---------------------------
# Autenticação
# ---------------------------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str = "PLAYER"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ---------------------------
# Dice Roller
# ---------------------------
class RollRequest(BaseModel):
    expression: str

class RollResponse(BaseModel):
    expression: str
    rolls: List[int]
    modifier: int
    total: int

# ---------------------------
# Campaign
# ---------------------------
class CampaignCreate(BaseModel):
    name: str
    description: Optional[str] = None

class CampaignResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]

# ---------------------------
# NPC
# ---------------------------
class NPCCreate(BaseModel):
    name: str
    race: str
    class_name: str
    trait: str
    goal: str
    backstory: Optional[str] = None

class NPCResponse(NPCCreate):
    id: int