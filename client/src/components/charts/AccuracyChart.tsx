// src/components/AccuracyChart.tsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: {
    day: string;
    accuracy: number;
  }[];
};

export default function AccuracyChart({ data }: Props) {
  return (
    <div className="w-full h-40">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="day" tickLine={false} axisLine={false} />

          <YAxis hide />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="accuracy"
            dot={false}
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
