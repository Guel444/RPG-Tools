# app/main.py

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from .database import Base, engine, get_db
from . import auth, dice, npc
from .models import User, Role, NPC

# -------------------------------
# Inicialização do app e DB
# -------------------------------
Base.metadata.create_all(bind=engine)
app = FastAPI(title="RPG Tools")
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")
security = HTTPBearer()


# -------------------------------
# Pydantic Models
# -------------------------------
class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str  # "PLAYER" ou "MASTER"

class LoginRequest(BaseModel):
    email: str
    password: str

class RollRequest(BaseModel):
    expression: str

class RollResponse(BaseModel):
    expression: str
    rolls: List[int]
    modifier: int
    total: int


# -------------------------------
# Dependência: Usuário atual
# -------------------------------
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    payload = auth.decode_token(credentials.credentials)
    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# -------------------------------
# Rotas de Autenticação
# -------------------------------
@app.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == request.email).first():
        return JSONResponse(content={"success": False, "detail": "Email já registrado"})
    
    user = User(
        email=request.email,
        password=auth.hash_password(request.password),
        role=request.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return JSONResponse(content={"success": True, "detail": "Usuário criado com sucesso"})


@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not auth.verify_password(request.password, user.password):
        return JSONResponse(content={"success": False, "detail": "Credenciais inválidas"})
    
    token = auth.create_access_token({"sub": user.id})
    return JSONResponse(content={"success": True, "detail": "Login realizado", "access_token": token})


@app.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
def dashboard_page(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return JSONResponse(content={
        "success": True,
        "detail": "Usuário autenticado",
        "data": {"email": current_user.email, "role": current_user.role.value}
    })


# -------------------------------
# Dice Roller
# -------------------------------
@app.post("/roll", response_model=RollResponse)
def roll(request: RollRequest):
    try:
        rolls, modifier, total = dice.roll_dice(request.expression)
        return RollResponse(
            expression=request.expression,
            rolls=rolls,
            modifier=modifier,
            total=total
        )
    except ValueError as e:
        return JSONResponse(content={"success": False, "detail": str(e)})


# -------------------------------
# NPC Routes
# -------------------------------
@app.get("/npc")
def create_npc(current_user: User = Depends(get_current_user)):
    npc_data = npc.generate_npc()
    return JSONResponse(content={"success": True, "detail": "NPC gerado", "data": npc_data})


@app.post("/npc/save")
def save_npc(npc_data: dict,
             db: Session = Depends(get_db),
             current_user: User = Depends(get_current_user)):
    
    try:
        new_npc = NPC(
            name=npc_data["name"],
            race=npc_data["race"],
            class_name=npc_data["class"],
            trait=npc_data["trait"],
            goal=npc_data["goal"],
            owner_id=current_user.id
        )
        db.add(new_npc)
        db.commit()
        db.refresh(new_npc)

        return JSONResponse(content={
            "success": True,
            "detail": "NPC salvo com sucesso",
            "data": {
                "id": new_npc.id,
                "name": new_npc.name,
                "race": new_npc.race,
                "class_name": new_npc.class_name,
                "trait": new_npc.trait,
                "goal": new_npc.goal
            }
        })
    except Exception as e:
        return JSONResponse(content={"success": False, "detail": f"Erro ao salvar NPC: {e}"})


@app.get("/npc/my")
def my_npcs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    npcs = db.query(NPC).filter(NPC.owner_id == current_user.id).all()
    npc_list = [{
        "id": n.id,
        "name": n.name,
        "race": n.race,
        "class_name": n.class_name,
        "trait": n.trait,
        "goal": n.goal
    } for n in npcs]
    return JSONResponse(content={"success": True, "detail": "NPCs carregados", "data": npc_list})


@app.delete("/npc/{npc_id}")
def delete_npc(npc_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    npc_to_delete = db.query(NPC).filter(NPC.id == npc_id, NPC.owner_id == current_user.id).first()
    if not npc_to_delete:
        return JSONResponse(content={"success": False, "detail": "NPC não encontrado ou sem permissão"})
    
    db.delete(npc_to_delete)
    db.commit()
    return JSONResponse(content={"success": True, "detail": "NPC deletado com sucesso"})
