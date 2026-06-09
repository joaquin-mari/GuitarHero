const API_URL = "/api";

export async function getRandomNote() {
  const res = await fetch(`${API_URL}/notes/random`);
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_URL}/stats`);
  return res.json();
}

export async function saveSession(data: {
  duration: number;
  correct_notes: number;
  incorrect_notes: number;
}) {
  const res = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}
