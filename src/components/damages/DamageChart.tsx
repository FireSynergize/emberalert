"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { DamageEstimate } from "@/types/fire";

const CATEGORY_COLORS = ["#ff4500", "#10b981", "#f59e0b", "#6366f1"];

interface DamageChartProps {
  result: DamageEstimate;
}

export function DamageChart({ result }: DamageChartProps) {
  const data = [
    { name: "Property", value: result.propertyDamage },
    { name: "Agricultural", value: result.agriculturalDamage },
    { name: "Infrastructure", value: result.infrastructureDamage },
    { name: "Environmental", value: result.environmentalDamage },
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) => {
    if (active && payload?.length) {
      const val = payload[0].value;
      const formatted = val >= 1e9
        ? `$${(val / 1e9).toFixed(2)}B`
        : val >= 1e6
        ? `$${(val / 1e6).toFixed(1)}M`
        : `$${(val / 1e3).toFixed(0)}K`;
      return (
        <div className="glass-smoke rounded-lg px-3 py-2 border border-[rgba(255,69,0,0.2)]">
          <p className="text-xs text-[rgba(245,240,234,0.5)]">{payload[0].name}</p>
          <p className="text-sm font-bold text-[#ff7b35]">{formatted}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-fire rounded-xl p-5 border border-[rgba(255,69,0,0.15)]">
      <p className="text-xs font-semibold uppercase tracking-widest text-[rgba(245,240,234,0.4)] mb-4">Damage Breakdown</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(245,240,234,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(245,240,234,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1e9 ? `$${(v/1e9).toFixed(0)}B` : v >= 1e6 ? `$${(v/1e6).toFixed(0)}M` : `$${(v/1e3).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,69,0,0.06)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={CATEGORY_COLORS[i]} opacity={0.9} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
