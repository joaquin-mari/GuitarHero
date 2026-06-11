from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_random_note():
    with patch("random.choice", return_value="A"):
        response = client.get("/notes/random")

    assert response.status_code == 200
    assert response.json() == {"note": "A"}
