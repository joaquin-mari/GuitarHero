

CREATE TABLE practice_sessions (
    id SERIAL PRIMARY KEY,
    duration INTEGER NOT NULL,
    correct_notes INTEGER NOT NULL,
    incorrect_notes INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);