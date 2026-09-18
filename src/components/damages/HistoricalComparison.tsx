"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { HISTORICAL_FIRES } from "@/lib/utils/damage-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TrendingUp, Clock } from "lucide-react";

export function HistoricalComparison() {
  const sorted = [...HISTORICAL_FIRES].sort((a, b) => b.estimatedDamage - a.estimatedDamage);

  const byYear = HISTORICAL_FIRES.reduce((acc, f) => {
    const existing = acc.find((a) => a.year === f.year);
    if (existing) {
      existing.damage += f.estimatedDamage / 1e9;
      existing.acres += f.acresBurned;
    } else {
      acc.push({ year: f.year, damage: f.estimatedDamage / 1e9, acres: f.acresBurned });
    }
    return acc;
  }, [] as { year: number; damage: number; acres: number }[]).sort((a, b) => a.year - b.year);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload?.length) {
      return (
        <div className="glass-smoke rounded-lg px-3 py-2 border border-[rgba(255,69,0,0.2)]">
          <p className="text-xs text-[rgba(245,240,234,0.5)]">{label}</p>
          <p className="text-sm font-bold text-[#ff7b35]">${payload[0].value.toFixed(1)}B</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#f5f0ea]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Historical Wildfire Data
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#ff4500]" />
              <CardTitle className="text-sm">Top 10 Costliest US Fires</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sorted.slice(0, 10)} layout="vertical" barCategoryGap="20%">
                <XAxis
                  type="number"
                  tick={{ fill: "rgba(245,240,234,0.3)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v >= 1e9 ? (v/1e9).toFixed(0)+"B" : (v/1e6).toFixed(0)+"M"}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "rgba(245,240,234,0.5)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.length) {
                      const v = payload[0].value as number;
                      return (
                        <div className="glass-smoke rounded-lg px-3 py-2 border border-[rgba(255,69,0,0.2)]">
                          <p className="text-xs text-[rgba(245,240,234,0.5)]">{label}</p>
                          <p className="text-sm font-bold text-[#ff7b35]">
                            ${v >= 1e9 ? (v/1e9).toFixed(1)+"B" : (v/1e6).toFixed(0)+"M"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ fill: "rgba(255,69,0,0.06)" }}
                />
                <Bar dataKey="estimatedDamage" radius={[0, 4, 4, 0]}>
                  {sorted.slice(0, 10).map((_, i) => (
                    <Cell
                      key={i}
                      fill={`hsl(${20 - i * 1.5}, 100%, ${60 - i * 2}%)`}
                      opacity={0.9 - i * 0.04}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#ff4500]" />
              <CardTitle className="text-sm">Economic Damage by Year (Billions)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={byYear}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "rgba(245,240,234,0.4)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(245,240,234,0.3)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}B`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,69,0,0.3)" }} />
                <Line
                  type="monotone"
                  dataKey="damage"
                  stroke="#ff4500"
                  strokeWidth={2}
                  dot={{ fill: "#ff4500", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#ff7b35" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)]">
              {["Fire Name", "State", "Year", "Acres Burned", "Structures", "Fatalities", "Est. Damage", "Cause"].map((h) => (
                <th key={h} className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[rgba(245,240,234,0.35)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORICAL_FIRES.map((fire, i) => (
              <tr key={i} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,69,0,0.04)] transition-colors">
                <td className="py-2.5 px-3 font-medium text-[#f5f0ea]">{fire.name}</td>
                <td className="py-2.5 px-3 text-[rgba(245,240,234,0.6)]">{fire.state}</td>
                <td className="py-2.5 px-3 text-[rgba(245,240,234,0.6)]">{fire.year}</td>
                <td className="py-2.5 px-3 text-[rgba(245,240,234,0.6)]">{fire.acresBurned.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-[rgba(245,240,234,0.6)]">{fire.structuresDestroyed.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-red-400">{fire.fatalities}</td>
                <td className="py-2.5 px-3 font-semibold text-[#ff7b35]">
                  ${fire.estimatedDamage >= 1e9 ? (fire.estimatedDamage/1e9).toFixed(1)+"B" : (fire.estimatedDamage/1e6).toFixed(0)+"M"}
                </td>
                <td className="py-2.5 px-3 text-[rgba(245,240,234,0.5)]">{fire.cause}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
