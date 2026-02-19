from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.orm import Session

# ---------------------------
# Configuração do Banco de Dados
# ---------------------------
DATABASE_URL = "sqlite:///./rpg.db"

# Cria engine do SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # necessário para SQLite
    echo=False
)

# Cria fábrica de sessões
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para todos os modelos
Base = declarative_base()

# ---------------------------
# Dependência FastAPI
# ---------------------------
def get_db():
    """
    Fornece uma sessão do banco de dados para rotas FastAPI.
    Fecha automaticamente após uso.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
