// src/components/Timer.tsx
import { useEffect, useState } from "react";

export default function Timer({ running }: { running: boolean }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  return <div className="text-xl mt-4">Time: {seconds}s</div>;
}
