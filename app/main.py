from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from .database import Base, engine, get_db
from . import auth, dice, npc
from .models import User, Role, NPC, Note, Campaign, CampaignStatus
from .schemas import RegisterRequest, LoginRequest, RollRequest, RollResponse, NPCCreate

app = FastAPI(title="RPG Tools")
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")
security = HTTPBearer()


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
# Auth
# -------------------------------
@app.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == request.email).first():
        return JSONResponse(content={"success": False, "detail": "Email already registered"})
    if db.query(User).filter(User.username == request.username).first():
        return JSONResponse(content={"success": False, "detail": "Username already taken"})

    role = Role.MASTER if request.role == "MASTER" else Role.PLAYER
    user = User(
        username=request.username,
        email=request.email,
        password=auth.hash_password(request.password),
        role=role
    )
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


# -------------------------------
# Páginas HTML
# -------------------------------
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


# -------------------------------
# Usuário atual
# -------------------------------
@app.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return JSONResponse(content={
        "success": True,
        "data": {
            "username": current_user.username,
            "email": current_user.email,
            "role": current_user.role.value
        }
    })


# -------------------------------
# Dice Roller
# -------------------------------
@app.post("/roll", response_model=RollResponse)
def roll(request: RollRequest):
    try:
        rolls, modifier, total = dice.roll_dice(request.expression)
        return RollResponse(expression=request.expression, rolls=rolls, modifier=modifier, total=total)
    except ValueError as e:
        return JSONResponse(content={"success": False, "detail": str(e)})


# -------------------------------
# Notes
# -------------------------------
class NoteRequest(BaseModel):
    content: str

@app.get("/notes")
def get_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.owner_id == current_user.id).first()
    return JSONResponse(content={"success": True, "content": note.content if note else ""})

@app.post("/notes")
def save_notes(
    request: NoteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.owner_id == current_user.id).first()
    if note:
        note.content = request.content
    else:
        note = Note(content=request.content, owner_id=current_user.id)
        db.add(note)
    db.commit()
    return JSONResponse(content={"success": True, "detail": "Notes saved!"})


# -------------------------------
# NPC
# -------------------------------
@app.get("/npc")
def create_npc(current_user: User = Depends(get_current_user)):
    npc_data = npc.generate_npc()
    return JSONResponse(content={"success": True, "data": npc_data})

@app.post("/npc/save")
def save_npc(
    npc_data: NPCCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        new_npc = NPC(
            name=npc_data.name,
            race=npc_data.race,
            class_name=npc_data.class_name,
            trait=npc_data.trait,
            goal=npc_data.goal,
            backstory=npc_data.backstory,
            owner_id=current_user.id
        )
        db.add(new_npc)
        db.commit()
        db.refresh(new_npc)
        return JSONResponse(content={
            "success": True,
            "data": {
                "id": new_npc.id,
                "name": new_npc.name,
                "race": new_npc.race,
                "class_name": new_npc.class_name,
                "trait": new_npc.trait,
                "goal": new_npc.goal,
                "backstory": new_npc.backstory
            }
        })
    except Exception as e:
        return JSONResponse(content={"success": False, "detail": str(e)})

@app.get("/npc/my")
def my_npcs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    npcs = db.query(NPC).filter(NPC.owner_id == current_user.id).all()
    return JSONResponse(content={
        "success": True,
        "data": [{
            "id": n.id,
            "name": n.name,
            "race": n.race,
            "class_name": n.class_name,
            "trait": n.trait,
            "goal": n.goal,
            "backstory": n.backstory
        } for n in npcs]
    })

@app.put("/npc/{npc_id}")
def update_npc(
    npc_id: int,
    npc_data: NPCCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    n = db.query(NPC).filter(NPC.id == npc_id, NPC.owner_id == current_user.id).first()
    if not n:
        return JSONResponse(content={"success": False, "detail": "NPC not found"})
    n.name = npc_data.name
    n.race = npc_data.race
    n.class_name = npc_data.class_name
    n.trait = npc_data.trait
    n.goal = npc_data.goal
    n.backstory = npc_data.backstory
    db.commit()
    db.refresh(n)
    return JSONResponse(content={
        "success": True,
        "data": {
            "id": n.id,
            "name": n.name,
            "race": n.race,
            "class_name": n.class_name,
            "trait": n.trait,
            "goal": n.goal,
            "backstory": n.backstory
        }
    })

@app.delete("/npc/{npc_id}")
def delete_npc(
    npc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    n = db.query(NPC).filter(NPC.id == npc_id, NPC.owner_id == current_user.id).first()
    if not n:
        return JSONResponse(content={"success": False, "detail": "NPC not found"})
    db.delete(n)
    db.commit()
    return JSONResponse(content={"success": True, "detail": "NPC deleted"})


# -------------------------------
# Campaigns
# -------------------------------
class CampaignRequest(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[str] = "ACTIVE"
    current_session: Optional[int] = 1
    location: Optional[str] = None
    session_notes: Optional[str] = None

class AddNPCRequest(BaseModel):
    npc_id: int

def campaign_to_dict(c: Campaign):
    return {
        "id": c.id,
        "name": c.name,
        "description": c.description,
        "status": c.status.value if c.status else "ACTIVE",
        "current_session": c.current_session or 1,
        "location": c.location,
        "session_notes": c.session_notes,
        "npc_count": len(c.npcs),
        "npcs": [{
            "id": n.id,
            "name": n.name,
            "race": n.race,
            "class_name": n.class_name
        } for n in c.npcs]
    }

@app.get("/campaigns")
def list_campaigns(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    campaigns = db.query(Campaign).filter(Campaign.owner_id == current_user.id).all()
    return JSONResponse(content={"success": True, "data": [campaign_to_dict(c) for c in campaigns]})

@app.post("/campaigns")
def create_campaign(
    request: CampaignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    status = CampaignStatus(request.status) if request.status else CampaignStatus.ACTIVE
    campaign = Campaign(
        name=request.name,
        description=request.description,
        status=status,
        current_session=request.current_session or 1,
        location=request.location,
        session_notes=request.session_notes,
        owner_id=current_user.id
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return JSONResponse(content={"success": True, "data": campaign_to_dict(campaign)})

@app.put("/campaigns/{campaign_id}")
def update_campaign(
    campaign_id: str,
    request: CampaignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.owner_id == current_user.id
    ).first()
    if not campaign:
        return JSONResponse(content={"success": False, "detail": "Campaign not found"})

    campaign.name = request.name
    campaign.description = request.description
    campaign.status = CampaignStatus(request.status) if request.status else CampaignStatus.ACTIVE
    campaign.current_session = request.current_session or 1
    campaign.location = request.location
    campaign.session_notes = request.session_notes
    db.commit()
    db.refresh(campaign)
    return JSONResponse(content={"success": True, "data": campaign_to_dict(campaign)})

@app.delete("/campaigns/{campaign_id}")
def delete_campaign(
    campaign_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.owner_id == current_user.id
    ).first()
    if not campaign:
        return JSONResponse(content={"success": False, "detail": "Campaign not found"})
    db.delete(campaign)
    db.commit()
    return JSONResponse(content={"success": True, "detail": "Campaign deleted"})

@app.post("/campaigns/{campaign_id}/npcs")
def add_npc_to_campaign(
    campaign_id: str,
    request: AddNPCRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.owner_id == current_user.id
    ).first()
    if not campaign:
        return JSONResponse(content={"success": False, "detail": "Campaign not found"})

    npc_obj = db.query(NPC).filter(
        NPC.id == request.npc_id,
        NPC.owner_id == current_user.id
    ).first()
    if not npc_obj:
        return JSONResponse(content={"success": False, "detail": "NPC not found"})

    if npc_obj in campaign.npcs:
        return JSONResponse(content={"success": False, "detail": "NPC already in campaign"})

    campaign.npcs.append(npc_obj)
    db.commit()
    db.refresh(campaign)
    return JSONResponse(content={"success": True, "data": campaign_to_dict(campaign)})

@app.delete("/campaigns/{campaign_id}/npcs/{npc_id}")
def remove_npc_from_campaign(
    campaign_id: str,
    npc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.owner_id == current_user.id
    ).first()
    if not campaign:
        return JSONResponse(content={"success": False, "detail": "Campaign not found"})

    npc_obj = db.query(NPC).filter(NPC.id == npc_id).first()
    if not npc_obj or npc_obj not in campaign.npcs:
        return JSONResponse(content={"success": False, "detail": "NPC not in campaign"})

    campaign.npcs.remove(npc_obj)
    db.commit()
    return JSONResponse(content={"success": True, "detail": "NPC removed from campaign"})