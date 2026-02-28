from sqlalchemy import Column, String, DateTime, Text, Enum, Integer, ForeignKey, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum
from .database import Base


# ---------------------------
# Roles
# ---------------------------
class Role(str, enum.Enum):
    MASTER = "MASTER"
    PLAYER = "PLAYER"


# ---------------------------
# Campaign Status
# ---------------------------
class CampaignStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    PAUSED = "PAUSED"
    COMPLETED = "COMPLETED"


# ---------------------------
# Tabela de associação Campaign <-> NPC
# ---------------------------
campaign_npcs = Table(
    "campaign_npcs",
    Base.metadata,
    Column("campaign_id", String, ForeignKey("campaigns.id"), primary_key=True),
    Column("npc_id", Integer, ForeignKey("npcs.id"), primary_key=True)
)


# ---------------------------
# Users
# ---------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, nullable=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(Role), default=Role.PLAYER)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    npcs = relationship("NPC", back_populates="owner")
    notes = relationship("Note", back_populates="owner")
    campaigns = relationship("Campaign", back_populates="owner")


# ---------------------------
# Campaigns
# ---------------------------
class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(CampaignStatus), default=CampaignStatus.ACTIVE)
    current_session = Column(Integer, default=1)
    location = Column(String, nullable=True)
    session_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner_id = Column(String, ForeignKey("users.id"))
    owner = relationship("User", back_populates="campaigns")
    npcs = relationship("NPC", secondary=campaign_npcs, back_populates="campaigns")
    sessions = relationship("CampaignSession", back_populates="campaign", cascade="all, delete-orphan", order_by="CampaignSession.number")



# ---------------------------
# Campaign Sessions
# ---------------------------
class CampaignSession(Base):
    __tablename__ = "campaign_sessions"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, nullable=False)
    date = Column(String, nullable=True)          # ISO date string "2024-03-15"
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    npcs_involved = Column(Text, nullable=True)   # JSON list of NPC names
    loot = Column(Text, nullable=True)
    next_hook = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    campaign_id = Column(String, ForeignKey("campaigns.id", ondelete="CASCADE"))
    campaign = relationship("Campaign", back_populates="sessions")

# ---------------------------
# Notes
# ---------------------------
class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner_id = Column(String, ForeignKey("users.id"))
    owner = relationship("User", back_populates="notes")


# ---------------------------
# NPCs
# ---------------------------
class NPC(Base):
    __tablename__ = "npcs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    race = Column(String, nullable=False)
    class_name = Column(String, nullable=False)
    trait = Column(String, nullable=False)
    goal = Column(String, nullable=False)
    backstory = Column(Text, nullable=True)

    owner_id = Column(String, ForeignKey("users.id"))
    owner = relationship("User", back_populates="npcs")
    campaigns = relationship("Campaign", secondary=campaign_npcs, back_populates="npcs")