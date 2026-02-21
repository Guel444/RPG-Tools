from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .database import Base, engine, get_db
from . import auth, dice, npc
from .models import User, Role, NPC, Note
from .schemas import RegisterRequest, LoginRequest, RollRequest, RollResponse, NPCCreate

app = FastAPI(title="RPG Tools")
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    payload = auth.decode_token(credentials.credentials)
    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@app.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == request.email).first():
        return JSONResponse(content={"success": False, "detail": "Email already registered"})
    if db.query(User).filter(User.username == request.username).first():
        return JSONResponse(content={"success": False, "detail": "Username already taken"})
    role = Role.MASTER if request.role == "MASTER" else Role.PLAYER
    user = User(username=request.username, email=request.email, password=auth.hash_password(request.password), role=role)
    db.add(user)
    db.commit()
    return JSONResponse(content={"success": True, "detail": "Account created successfully"})


@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not auth.verify_password(request.password, user.password):
        return JSONResponse(content={"success": False, "detail": "Invalid email or password"})
    token = auth.create_access_token({"sub": user.id})
    return JSONResponse(content={"success": True, "detail": "Login successful", "access_token": token})


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
    return JSONResponse(content={"success": True, "data": {"username": current_user.username, "email": current_user.email, "role": current_user.role.value}})


@app.post("/roll", response_model=RollResponse)
def roll(request: RollRequest):
    try:
        rolls, modifier, total = dice.roll_dice(request.expression)
        return RollResponse(expression=request.expression, rolls=rolls, modifier=modifier, total=total)
    except ValueError as e:
        return JSONResponse(content={"success": False, "detail": str(e)})


class NoteRequest(BaseModel):
    content: str

@app.get("/notes")
def get_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.owner_id == current_user.id).first()
    return JSONResponse(content={"success": True, "content": note.content if note else ""})

@app.post("/notes")
def save_notes(request: NoteRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.owner_id == current_user.id).first()
    if note:
        note.content = request.content
    else:
        note = Note(content=request.content, owner_id=current_user.id)
        db.add(note)
    db.commit()
    return JSONResponse(content={"success": True, "detail": "Notes saved!"})


@app.get("/npc")
def create_npc(current_user: User = Depends(get_current_user)):
    npc_data = npc.generate_npc()
    return JSONResponse(content={"success": True, "data": npc_data})

@app.post("/npc/save")
def save_npc(npc_data: NPCCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        new_npc = NPC(name=npc_data.name, race=npc_data.race, class_name=npc_data.class_name, trait=npc_data.trait, goal=npc_data.goal, backstory=npc_data.backstory, owner_id=current_user.id)
        db.add(new_npc)
        db.commit()
        db.refresh(new_npc)
        return JSONResponse(content={"success": True, "data": {"id": new_npc.id, "name": new_npc.name, "race": new_npc.race, "class_name": new_npc.class_name, "trait": new_npc.trait, "goal": new_npc.goal, "backstory": new_npc.backstory}})
    except Exception as e:
        return JSONResponse(content={"success": False, "detail": str(e)})

@app.get("/npc/my")
def my_npcs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    npcs = db.query(NPC).filter(NPC.owner_id == current_user.id).all()
    return JSONResponse(content={"success": True, "data": [{"id": n.id, "name": n.name, "race": n.race, "class_name": n.class_name, "trait": n.trait, "goal": n.goal, "backstory": n.backstory} for n in npcs]})

@app.put("/npc/{npc_id}")
def update_npc(npc_id: int, npc_data: NPCCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    n = db.query(NPC).filter(NPC.id == npc_id, NPC.owner_id == current_user.id).first()
    if not n:
        return JSONResponse(content={"success": False, "detail": "NPC not found"})
    n.name = npc_data.name; n.race = npc_data.race; n.class_name = npc_data.class_name
    n.trait = npc_data.trait; n.goal = npc_data.goal; n.backstory = npc_data.backstory
    db.commit(); db.refresh(n)
    return JSONResponse(content={"success": True, "data": {"id": n.id, "name": n.name, "race": n.race, "class_name": n.class_name, "trait": n.trait, "goal": n.goal, "backstory": n.backstory}})

@app.delete("/npc/{npc_id}")
def delete_npc(npc_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    n = db.query(NPC).filter(NPC.id == npc_id, NPC.owner_id == current_user.id).first()
    if not n:
        return JSONResponse(content={"success": False, "detail": "NPC not found"})
    db.delete(n); db.commit()
    return JSONResponse(content={"success": True, "detail": "NPC deleted"})