'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

type Props = { data: { time: string; value: number }[] };

export default function GlucoseChart({ data }: Props) {
  return (
    <div className="chartCard" style={{height: 320}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={[40, 300]} />
          <Tooltip />
          <ReferenceArea y1={70} y2={180} strokeOpacity={0.1} />
          <Line type="monotone" dataKey="value" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
