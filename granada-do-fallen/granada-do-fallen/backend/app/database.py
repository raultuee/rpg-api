"""
Configuração da conexão com o banco de dados.
Usa SQLite por padrão (arquivo local), mas pode trocar para
PostgreSQL/MySQL só mudando a DATABASE_URL.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./granada_do_fallen.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # necessário só para SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency do FastAPI: abre e fecha a sessão do banco a cada request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
