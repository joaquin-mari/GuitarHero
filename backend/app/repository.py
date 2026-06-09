from app.db import get_conn


def create_session(chord: str, duration: int):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO sessions (chord, duration)
                VALUES (%s, %s)
                RETURNING id, chord, duration;
                """,
                (chord, duration),
            )
            return cur.fetchone()


def get_sessions():
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, chord, duration FROM sessions ORDER BY id DESC;"
            )
            return cur.fetchall()