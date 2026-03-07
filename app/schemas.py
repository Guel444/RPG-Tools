from pydantic import BaseModel, EmailStr
from typing import Optional


# ─── Auth ─────────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = "PLAYER"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ─── Dice ─────────────────────────────────────────────────────────────────────
class RollRequest(BaseModel):
    expression: str


class RollResponse(BaseModel):
    expression: str
    rolls: list[int]
    modifier: int
    total: int


# ─── NPC ──────────────────────────────────────────────────────────────────────
class NPCCreate(BaseModel):
    name: str
    race: str
    class_name: str
    trait: str
    goal: str
    backstory: Optional[str] = None