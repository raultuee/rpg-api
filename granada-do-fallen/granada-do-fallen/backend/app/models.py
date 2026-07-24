"""
Modelagem do banco de dados — Pessoa 1 (Backend e Banco de Dados).

Entidades:
- User: quem joga/administra
- Campaign: uma campanha de RPG, pertence a um usuário (mestre)
- Character: uma ficha de personagem, pertence a um usuário e
  opcionalmente a uma campanha
"""
from datetime import datetime, timezone

from sqlalchemy import (
    Column, Integer, String, Text, ForeignKey, DateTime
)
from sqlalchemy.orm import relationship

from .database import Base


def now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=now)

    characters = relationship(
        "Character", back_populates="owner", cascade="all, delete-orphan"
    )
    campaigns = relationship(
        "Campaign", back_populates="master", cascade="all, delete-orphan"
    )


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, default="")
    master_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=now)

    master = relationship("User", back_populates="campaigns")
    characters = relationship("Character", back_populates="campaign")


class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)

    # Identidade da ficha
    name = Column(String(80), nullable=False)          # nome escolhido pelo jogador
    character_class = Column(String(50), default="Aventureiro")
    race = Column(String(50), default="Humano")
    level = Column(Integer, default=1)

    # Atributos principais (estilo RPG de mesa)
    strength = Column(Integer, default=10)
    dexterity = Column(Integer, default=10)
    constitution = Column(Integer, default=10)
    intelligence = Column(Integer, default=10)
    wisdom = Column(Integer, default=10)
    charisma = Column(Integer, default=10)

    hp = Column(Integer, default=10)
    max_hp = Column(Integer, default=10)

    backstory = Column(Text, default="")
    avatar_url = Column(String(255), default="")

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True)

    created_at = Column(DateTime, default=now)
    updated_at = Column(DateTime, default=now, onupdate=now)

    owner = relationship("User", back_populates="characters")
    campaign = relationship("Campaign", back_populates="characters")
