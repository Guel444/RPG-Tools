import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# ---------------------------
# Configuração do Banco de Dados
# ---------------------------
# Em produção (Render), define a variável de ambiente DATABASE_URL com a URL do PostgreSQL.
# Em desenvolvimento local, usa SQLite como fallback.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./rpg.db")

# O Render fornece URLs PostgreSQL com prefixo "postgres://", mas o SQLAlchemy
# exige "postgresql://". Esta linha corrige isso automaticamente.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Argumentos específicos para SQLite (não se aplicam ao PostgreSQL)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# ---------------------------
# Dependência FastAPI
# ---------------------------
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()