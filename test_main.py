import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

# Banco de dados em memória exclusivo para testes
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine_test = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

Base.metadata.create_all(bind=engine_test)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


# -------------------------------
# Fixtures
# -------------------------------
@pytest.fixture(autouse=True)
def clean_db():
    """Limpa o banco antes de cada teste."""
    Base.metadata.drop_all(bind=engine_test)
    Base.metadata.create_all(bind=engine_test)
    yield


def register_user(username="testuser", email="test@test.com", password="123456", role="PLAYER"):
    return client.post("/register", json={
        "username": username,
        "email": email,
        "password": password,
        "role": role
    })


def login_user(email="test@test.com", password="123456"):
    return client.post("/login", json={"email": email, "password": password})


def get_token():
    register_user()
    response = login_user()
    return response.json()["access_token"]


def auth_headers():
    return {"Authorization": f"Bearer {get_token()}"}


# -------------------------------
# Testes de Autenticação
# -------------------------------
class TestAuth:

    def test_register_success(self):
        response = register_user()
        assert response.status_code == 200
        assert response.json()["success"] == True

    def test_register_duplicate_email(self):
        register_user()
        response = register_user()
        assert response.json()["success"] == False
        assert "Email" in response.json()["detail"]

    def test_register_duplicate_username(self):
        register_user()
        response = register_user(email="other@test.com")
        assert response.json()["success"] == False
        assert "Username" in response.json()["detail"]

    def test_login_success(self):
        register_user()
        response = login_user()
        assert response.status_code == 200
        assert response.json()["success"] == True
        assert "access_token" in response.json()

    def test_login_wrong_password(self):
        register_user()
        response = login_user(password="senhaerrada")
        assert response.json()["success"] == False

    def test_login_unknown_email(self):
        response = login_user(email="naoexiste@test.com")
        assert response.json()["success"] == False

    def test_me_authenticated(self):
        response = client.get("/me", headers=auth_headers())
        assert response.status_code == 200
        assert response.json()["data"]["username"] == "testuser"

    def test_me_unauthenticated(self):
        response = client.get("/me")
        assert response.status_code == 403


# -------------------------------
# Testes do Dice Roller
# -------------------------------
class TestDice:

    def test_roll_d20(self):
        response = client.post("/roll", json={"expression": "1d20"}, headers=auth_headers())
        assert response.status_code == 200
        data = response.json()
        assert 1 <= data["total"] <= 20

    def test_roll_with_modifier(self):
        response = client.post("/roll", json={"expression": "2d6+3"}, headers=auth_headers())
        data = response.json()
        assert data["modifier"] == 3
        assert len(data["rolls"]) == 2

    def test_roll_invalid_expression(self):
        response = client.post("/roll", json={"expression": "abc"}, headers=auth_headers())
        data = response.json()
        assert "detail" in data

    def test_roll_too_many_dice(self):
        response = client.post("/roll", json={"expression": "200d6"}, headers=auth_headers())
        data = response.json()
        assert "detail" in data


# -------------------------------
# Testes de NPC
# -------------------------------
class TestNPC:

    def test_generate_npc(self):
        response = client.get("/npc", headers=auth_headers())
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "name" in data["data"]
        assert "race" in data["data"]

    def test_save_npc(self):
        headers = auth_headers()
        response = client.post("/npc/save", headers=headers, json={
            "name": "Aragorn",
            "race": "Human",
            "class_name": "Ranger",
            "trait": "Brave",
            "goal": "Protect the realm",
            "backstory": "A wanderer from the north"
        })
        assert response.json()["success"] == True

    def test_list_my_npcs(self):
        headers = auth_headers()
        client.post("/npc/save", headers=headers, json={
            "name": "Legolas",
            "race": "Elf",
            "class_name": "Archer",
            "trait": "Graceful",
            "goal": "Defend the forest",
            "backstory": None
        })
        response = client.get("/npc/my", headers=headers)
        assert response.json()["success"] == True
        assert len(response.json()["data"]) == 1

    def test_edit_npc(self):
        headers = auth_headers()
        save = client.post("/npc/save", headers=headers, json={
            "name": "Gimli",
            "race": "Dwarf",
            "class_name": "Warrior",
            "trait": "Stubborn",
            "goal": "Reclaim the mountain",
            "backstory": None
        })
        npc_id = save.json()["data"]["id"]

        response = client.put(f"/npc/{npc_id}", headers=headers, json={
            "name": "Gimli Filho de Gloin",
            "race": "Dwarf",
            "class_name": "Warrior",
            "trait": "Loyal",
            "goal": "Reclaim the mountain",
            "backstory": "Son of Gloin"
        })
        assert response.json()["success"] == True
        assert response.json()["data"]["name"] == "Gimli Filho de Gloin"

    def test_delete_npc(self):
        headers = auth_headers()
        save = client.post("/npc/save", headers=headers, json={
            "name": "Sauron",
            "race": "Maia",
            "class_name": "Sorcerer",
            "trait": "Evil",
            "goal": "Rule all",
            "backstory": None
        })
        npc_id = save.json()["data"]["id"]

        response = client.delete(f"/npc/{npc_id}", headers=headers)
        assert response.json()["success"] == True

        npcs = client.get("/npc/my", headers=headers).json()["data"]
        assert len(npcs) == 0

    def test_delete_other_users_npc(self):
        """Usuário não pode deletar NPC de outro usuário."""
        headers1 = auth_headers()
        save = client.post("/npc/save", headers=headers1, json={
            "name": "Frodo",
            "race": "Hobbit",
            "class_name": "Rogue",
            "trait": "Curious",
            "goal": "Destroy the ring",
            "backstory": None
        })
        npc_id = save.json()["data"]["id"]

        register_user(username="outro", email="outro@test.com")
        token2 = client.post("/login", json={"email": "outro@test.com", "password": "123456"}).json()["access_token"]
        headers2 = {"Authorization": f"Bearer {token2}"}

        response = client.delete(f"/npc/{npc_id}", headers=headers2)
        assert response.json()["success"] == False


# -------------------------------
# Testes de Notas
# -------------------------------
class TestNotes:

    def test_get_empty_notes(self):
        response = client.get("/notes", headers=auth_headers())
        assert response.json()["success"] == True
        assert response.json()["content"] == ""

    def test_save_and_get_notes(self):
        headers = auth_headers()
        client.post("/notes", headers=headers, json={"content": "Lembrar de dar XP para o grupo"})
        response = client.get("/notes", headers=headers)
        assert response.json()["content"] == "Lembrar de dar XP para o grupo"

    def test_update_notes(self):
        headers = auth_headers()
        client.post("/notes", headers=headers, json={"content": "Nota antiga"})
        client.post("/notes", headers=headers, json={"content": "Nota atualizada"})
        response = client.get("/notes", headers=headers)
        assert response.json()["content"] == "Nota atualizada"