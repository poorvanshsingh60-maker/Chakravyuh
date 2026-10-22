from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Chakravyuh Backend"
    assert "Google OR-Tools" in data["solver"]


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Welcome to Chakravyuh" in data["message"]


def test_auth_login_demo():
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@chakravyuh.com",
        "password": "any_password"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "ADMIN"
