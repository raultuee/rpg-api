"""
Schemas Pydantic — validação de entrada/saída da API.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------- Usuário ----------
class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: EmailStr
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Campanha ----------
class CampaignCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    description: Optional[str] = ""


class CampaignOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: str
    master_id: int
    created_at: datetime


# ---------- Personagem ----------
class CharacterBase(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    character_class: str = "Aventureiro"
    race: str = "Humano"
    level: int = Field(default=1, ge=1, le=100)

    strength: int = Field(default=10, ge=1, le=30)
    dexterity: int = Field(default=10, ge=1, le=30)
    constitution: int = Field(default=10, ge=1, le=30)
    intelligence: int = Field(default=10, ge=1, le=30)
    wisdom: int = Field(default=10, ge=1, le=30)
    charisma: int = Field(default=10, ge=1, le=30)

    hp: int = Field(default=10, ge=0)
    max_hp: int = Field(default=10, ge=1)

    backstory: Optional[str] = ""
    avatar_url: Optional[str] = ""
    campaign_id: Optional[int] = None


class CharacterCreate(CharacterBase):
    pass


class CharacterUpdate(BaseModel):
    """Todos os campos opcionais — permite update parcial (PATCH)."""
    name: Optional[str] = None
    character_class: Optional[str] = None
    race: Optional[str] = None
    level: Optional[int] = None
    strength: Optional[int] = None
    dexterity: Optional[int] = None
    constitution: Optional[int] = None
    intelligence: Optional[int] = None
    wisdom: Optional[int] = None
    charisma: Optional[int] = None
    hp: Optional[int] = None
    max_hp: Optional[int] = None
    backstory: Optional[str] = None
    avatar_url: Optional[str] = None
    campaign_id: Optional[int] = None


class CharacterOut(CharacterBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
