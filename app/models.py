from sqlalchemy import Column, String, DateTime, Text, Enum, Integer, ForeignKey
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

# ---------------------------
# Campaigns
# ---------------------------
class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

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
    backstory = Column(Text, nullable=True)  # novo campo

    owner_id = Column(String, ForeignKey("users.id"))
    owner = relationship("User", back_populates="npcs")