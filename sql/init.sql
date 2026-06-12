create table practice_sessions (
    id SERIAL primary key,
    duration INTEGER not null,
    correct_notes INTEGER not null,
    incorrect_notes INTEGER not null,
    created_at TIMESTAMP default NOW()
);
