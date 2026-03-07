import uuid
import enum
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Text, Enum, DateTime,
    ForeignKey, Table, Boolean
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


# ─── Association Table ────────────────────────────────────────────────────────
campaign_npcs = Table(
    "campaign_npcs",
    Base.metadata,
    Column("campaign_id", String, ForeignKey("campaigns.id", ondelete="CASCADE")),
    Column("npc_id", Integer, ForeignKey("npcs.id", ondelete="CASCADE")),
)


# ─── Enums ────────────────────────────────────────────────────────────────────
class Role(enum.Enum):
    MASTER = "MASTER"
    PLAYER = "PLAYER"


class CampaignStatus(enum.Enum):
    ACTIVE    = "ACTIVE"
    PAUSED    = "PAUSED"
    COMPLETED = "COMPLETED"


# ─── User ─────────────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    username   = Column(String, unique=True, nullable=True)
    email      = Column(String, unique=True, index=True, nullable=False)
    password   = Column(String, nullable=False)
    role       = Column(Enum(Role), default=Role.PLAYER)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    npcs      = relationship("NPC",      back_populates="owner", cascade="all, delete-orphan")
    notes     = relationship("Note",     back_populates="owner", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="owner", cascade="all, delete-orphan")


# ─── NPC ──────────────────────────────────────────────────────────────────────
class NPC(Base):
    __tablename__ = "npcs"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    race       = Column(String, nullable=False)
    class_name = Column(String, nullable=False)
    trait      = Column(String, nullable=False)
    goal       = Column(String, nullable=False)
    backstory  = Column(Text, nullable=True)
    owner_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner     = relationship("User",     back_populates="npcs")
    campaigns = relationship("Campaign", secondary=campaign_npcs, back_populates="npcs")


# ─── Note ─────────────────────────────────────────────────────────────────────
class Note(Base):
    __tablename__ = "notes"

    id         = Column(Integer, primary_key=True, index=True)
    content    = Column(Text, default="")
    owner_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner = relationship("User", back_populates="notes")


# ─── Campaign ─────────────────────────────────────────────────────────────────
class Campaign(Base):
    __tablename__ = "campaigns"

    id             = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name           = Column(String, nullable=False)
    description    = Column(Text, nullable=True)
    status         = Column(Enum(CampaignStatus), default=CampaignStatus.ACTIVE)
    location       = Column(String, nullable=True)
    owner_id       = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())
    updated_at     = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner    = relationship("User",           back_populates="campaigns")
    npcs     = relationship("NPC",            secondary=campaign_npcs, back_populates="campaigns")
    sessions = relationship("CampaignSession", back_populates="campaign",
                            cascade="all, delete-orphan", order_by="CampaignSession.number")


# ─── CampaignSession ──────────────────────────────────────────────────────────
class CampaignSession(Base):
    __tablename__ = "campaign_sessions"

    id            = Column(Integer, primary_key=True, index=True)
    campaign_id   = Column(String, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False)
    number        = Column(Integer, nullable=False)
    date          = Column(String, nullable=True)   # stored as ISO string "YYYY-MM-DD"
    title         = Column(String, nullable=False)
    summary       = Column(Text, nullable=True)
    npcs_involved = Column(String, nullable=True)
    loot          = Column(String, nullable=True)
    next_hook     = Column(Text, nullable=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    campaign = relationship("Campaign", back_populates="sessions")