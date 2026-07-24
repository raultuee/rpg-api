"""
Granada do Fallen — API principal.

Rodar localmente:
    uvicorn app.main:app --reload

Docs automáticas (Swagger):
    http://localhost:8000/docs
"""
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .auth import create_access_token, get_current_user, verify_password
from .database import Base, engine, get_db

# Cria as tabelas no banco (equivalente a uma migration inicial simples)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Granada do Fallen API",
    description="API do sistema de RPG Granada do Fallen — personagens, "
                 "campanhas e autenticação.",
    version="1.0.0",
)

# Libera o front-end (React, geralmente em localhost:5173 no Vite) a
# chamar a API durante o desenvolvimento.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["status"])
def root():
    return {"status": "online", "app": "Granada do Fallen"}


# ---------------------------------------------------------------------
# Autenticação
# ---------------------------------------------------------------------
@app.post("/auth/register", response_model=schemas.UserOut, tags=["auth"])
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Nome de usuário já existe")
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    return crud.create_user(db, user)


@app.post("/auth/login", response_model=schemas.Token, tags=["auth"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(data={"sub": str(user.id)})
    return schemas.Token(access_token=token)


@app.get("/auth/me", response_model=schemas.UserOut, tags=["auth"])
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user


# ---------------------------------------------------------------------
# Campanhas
# ---------------------------------------------------------------------
@app.post("/campaigns", response_model=schemas.CampaignOut, tags=["campaigns"])
def create_campaign(
    campaign: schemas.CampaignCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_campaign(db, campaign, master_id=current_user.id)


@app.get("/campaigns", response_model=list[schemas.CampaignOut], tags=["campaigns"])
def list_campaigns(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_campaigns_by_user(db, current_user.id)


@app.delete("/campaigns/{campaign_id}", status_code=204, tags=["campaigns"])
def remove_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    campaign = crud.get_campaign(db, campaign_id)
    if not campaign or campaign.master_id != current_user.id:
        raise HTTPException(status_code=404, detail="Campanha não encontrada")
    crud.delete_campaign(db, campaign)


# ---------------------------------------------------------------------
# Personagens
# ---------------------------------------------------------------------
@app.post("/characters", response_model=schemas.CharacterOut, tags=["characters"])
def create_character(
    character: schemas.CharacterCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_character(db, character, owner_id=current_user.id)


@app.get("/characters", response_model=list[schemas.CharacterOut], tags=["characters"])
def list_characters(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_characters_by_user(db, current_user.id)


@app.get("/characters/{character_id}", response_model=schemas.CharacterOut, tags=["characters"])
def get_character(
    character_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    character = crud.get_character(db, character_id)
    if not character or character.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    return character


@app.patch("/characters/{character_id}", response_model=schemas.CharacterOut, tags=["characters"])
def update_character(
    character_id: int,
    data: schemas.CharacterUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    character = crud.get_character(db, character_id)
    if not character or character.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    return crud.update_character(db, character, data)


@app.delete("/characters/{character_id}", status_code=204, tags=["characters"])
def remove_character(
    character_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    character = crud.get_character(db, character_id)
    if not character or character.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Personagem não encontrado")
    crud.delete_character(db, character)
