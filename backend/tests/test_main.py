from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_random_note():
    with patch("random.choice", return_value="A"):
        response = client.get("/notes/random")

    assert response.status_code == 200
    assert response.json() == {"note": "A"}

def test_create_session():
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_cursor.fetchone.return_value = (
        1, 60, 10, 2, "2026-01-01"
    )

    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

    with patch("app.main.get_conn", return_value=mock_conn):
        response = client.post(
            "/sessions",
            json={
                "duration": 60,
                "correct_notes": 10,
                "incorrect_notes": 2,
            },
        )

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == 1
    assert data["duration"] == 60
    assert data["correct_notes"] == 10
    assert data["incorrect_notes"] == 2

def test_stats():
    mock_conn = MagicMock()
    mock_cursor = MagicMock()

    mock_cursor.fetchall.return_value = [
        ("2026-01-01", 5, 1, 30),
        ("2026-01-02", 3, 2, 20),
    ]

    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor

    with patch("app.main.get_conn", return_value=mock_conn):
        response = client.get("/stats")

    assert response.status_code == 200

    data = response.json()
    assert len(data) == 2

    assert data[0]["correct_notes"] == 5
    assert data[0]["incorrect_notes"] == 1
    assert data[0]["practice_time"] == 30