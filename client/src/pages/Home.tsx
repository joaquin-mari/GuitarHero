import { useEffect, useState } from "react";
import ChordCard from "../components/ChordChard";
import Timer from "../components/Timer";
import { getRandomNote, saveSession } from "../api/client";
import StatsDashboard from "../components/charts/StatsDashboard";
import { usePitchDetection } from "../hooks/usePitchDetection";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [targetNote, setTargetNote] = useState("");
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [correctNotes, setCorrectNotes] = useState(0);
  const [incorrectNotes, setIncorrectNotes] = useState(0);

  const detectedNote = usePitchDetection(gameStarted);

  async function loadNote() {
    const data = await getRandomNote();
    setTargetNote(data.note);
  }

  async function startPractice() {
    setGameStarted(true);
    setRunning(true);

    setCorrectNotes(0);
    setIncorrectNotes(0);

    setStartTime(Date.now());

    await loadNote();
  }

  async function handleCorrect() {
    setCorrectNotes((prev) => prev + 1);
    await loadNote();
  }

  async function handleIncorrect() {
    setIncorrectNotes((prev) => prev + 1);
    await loadNote();
  }

  async function stopPractice() {
    if (!startTime) return;

    const duration = Math.floor((Date.now() - startTime) / 1000);

    await saveSession({
      duration,
      correct_notes: correctNotes,
      incorrect_notes: incorrectNotes,
    });

    setRunning(false);
    setGameStarted(false);
    setTargetNote("");
    setStartTime(null);
  }

  useEffect(() => {
    if (!gameStarted) return;
    if (!detectedNote) return;

    if (detectedNote.length < 1) return;

    if (detectedNote === targetNote) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
  }, [detectedNote]);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center mt-20 gap-1">
        <h1 className="text-3xl font-bold">Guitar Hero Trainer</h1>

        <StatsDashboard />

        <button onClick={startPractice} className="border px-6 py-3 rounded">
          Start
        </button>
      </div>
    );
  }

  const totalNotes = correctNotes + incorrectNotes;

  const accuracy =
    totalNotes > 0 ? ((correctNotes / totalNotes) * 100).toFixed(1) : "0";

  return (
    <div className="flex flex-col items-center mt-20 gap-6">
      <ChordCard chord={targetNote} />

      <Timer running={running} />

      <div className="text-sm text-gray-500">
        Detected: {detectedNote || "..."}
      </div>

      <div className="text-center">
        <p>Correct: {correctNotes}</p>
        <p>Incorrect: {incorrectNotes}</p>
        <p>Accuracy: {accuracy}%</p>
      </div>

      <button onClick={stopPractice} className="border px-4 py-2 rounded">
        Stop Practice
      </button>
    </div>
  );
}
