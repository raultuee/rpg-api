"""
Funções de acesso ao banco (CRUD) — separadas das rotas para manter
main.py enxuto e facilitar testes (Pessoa 3 pode testar isso isoladamente).
"""
from sqlalchemy.orm import Session

from . import models, schemas
from .auth import hash_password


# ---------- User ----------
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ---------- Campaign ----------
def create_campaign(db: Session, campaign: schemas.CampaignCreate, master_id: int):
    db_campaign = models.Campaign(**campaign.model_dump(), master_id=master_id)
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign


def get_campaigns_by_user(db: Session, master_id: int):
    return db.query(models.Campaign).filter(models.Campaign.master_id == master_id).all()


def get_campaign(db: Session, campaign_id: int):
    return db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()


def delete_campaign(db: Session, campaign: models.Campaign):
    db.delete(campaign)
    db.commit()


# ---------- Character ----------
def create_character(db: Session, character: schemas.CharacterCreate, owner_id: int):
    db_character = models.Character(**character.model_dump(), owner_id=owner_id)
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character


def get_characters_by_user(db: Session, owner_id: int):
    return db.query(models.Character).filter(models.Character.owner_id == owner_id).all()


def get_character(db: Session, character_id: int):
    return db.query(models.Character).filter(models.Character.id == character_id).first()


def update_character(db: Session, character: models.Character, data: schemas.CharacterUpdate):
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(character, field, value)
    db.commit()
    db.refresh(character)
    return character


def delete_character(db: Session, character: models.Character):
    db.delete(character)
    db.commit()
