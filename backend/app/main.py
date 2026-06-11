import random

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import get_conn
from app.schemas import SessionCreate

app = FastAPI(title="Guitar Practice API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/notes/random")
def get_random_note():
    notes = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    ]
    return {"note": random.choice(notes)}

@app.post("/sessions")
def create_session(payload: SessionCreate):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO practice_sessions
                (duration, correct_notes, incorrect_notes)
                VALUES (%s, %s, %s)
                RETURNING id, duration,
                          correct_notes,
                          incorrect_notes,
                          created_at
                """,
                (
                    payload.duration,
                    payload.correct_notes,
                    payload.incorrect_notes,
                ),
            )

            row = cur.fetchone()
            conn.commit()

    return {
        "id": row[0],
        "duration": row[1],
        "correct_notes": row[2],
        "incorrect_notes": row[3],
        "created_at": row[4],
    }

@app.get("/stats")
def get_stats():
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    DATE(created_at) as day,
                    SUM(correct_notes) as correct_notes,
                    SUM(incorrect_notes) as incorrect_notes,
                    SUM(duration) as practice_time
                FROM practice_sessions
                WHERE created_at >= NOW() - INTERVAL '7 days'
                GROUP BY day
                ORDER BY day
            """)

            rows = cur.fetchall()

    return [
        {
            "day": str(row[0]),
            "correct_notes": row[1] or 0,
            "incorrect_notes": row[2] or 0,
            "practice_time": row[3] or 0,
        }
        for row in rows
    ]