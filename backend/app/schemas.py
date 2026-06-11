from pydantic import BaseModel


class SessionCreate(BaseModel):
    duration: int
    correct_notes: int
    incorrect_notes: int