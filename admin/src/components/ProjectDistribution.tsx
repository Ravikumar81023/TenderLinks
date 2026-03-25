//@ts-nocheck
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface ProjectDistributionProps {
  data: {
    sector: string;
    count: number;
  }[];
}

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

export function ProjectDistribution({ data }: ProjectDistributionProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#f0f9ff", border: "none" }}
          labelStyle={{ color: "#1e3a8a" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
