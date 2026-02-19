from pydantic import BaseModel
from typing import Optional, List

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

class NPCResponse(NPCCreate):
    id: int
