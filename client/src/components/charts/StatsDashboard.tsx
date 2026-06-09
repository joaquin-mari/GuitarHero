// src/components/StatsDashboard.tsx

import { useEffect, useState } from "react";
import { getStats } from "../../api/client";
import AccuracyChart from "./AccuracyChart";

type StatRow = {
  day: string;
  correct_notes: number;
  incorrect_notes: number;
  practice_time: number;
};

export default function StatsDashboard() {
  const [stats, setStats] = useState<StatRow[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const data = await getStats();
    setStats(data);
  }

  const chartData = stats.map((row) => {
    const total = row.correct_notes + row.incorrect_notes;

    return {
      day: row.day,
      accuracy:
        total > 0 ? Number(((row.correct_notes / total) * 100).toFixed(1)) : 0,
    };
  });

  const totalPracticeTime = stats.reduce(
    (sum, row) => sum + row.practice_time,
    0,
  );

  const totalCorrect = stats.reduce((sum, row) => sum + row.correct_notes, 0);

  const avgAccuracy =
    chartData.length > 0
      ? (
          chartData.reduce((sum, item) => sum + item.accuracy, 0) /
          chartData.length
        ).toFixed(1)
      : "0";

  return (
    <div className="w-full max-w-2xl rounded-3xl bg-white  shadow-sm">
      <div className="mt-6 grid grid-cols-3 gap-10 items-end">
        <div className="mt-4">
          <p className="text-sm text-zinc-500">Average Accuracy</p>

          <h2 className="text-6xl font-semibold tracking-tight">
            {avgAccuracy}
            <span className="ml-1 text-2xl text-zinc-400">%</span>
          </h2>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Practice Time
          </p>

          <p className="mt-1 text-3xl font-semibold">
            {Math.floor(totalPracticeTime / 60)}
            <span className="ml-1 text-lg text-zinc-400">min</span>
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Correct Notes
          </p>

          <p className="mt-1 text-3xl font-semibold">{totalCorrect}</p>
        </div>
      </div>

      <div className="mt-8">
        <AccuracyChart data={chartData} />
      </div>
    </div>
  );
}
