"use client";
import { useEffect, useState } from "react";
import { Wind } from "lucide-react";
import { getAQICategory } from "@/lib/utils/cn";

export function AQIWidget({ lat, lon }: { lat: number; lon: number }) {
  const [data, setData] = useState<{ aqi: number | null; pm25: number | null; category: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/air-quality?lat=${lat}&lon=${lon}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="glass-fire rounded-xl p-5 border border-[rgba(255,69,0,0.15)] animate-pulse">
        <div className="h-4 w-24 bg-[rgba(255,255,255,0.05)] rounded mb-3" />
        <div className="h-8 w-16 bg-[rgba(255,255,255,0.05)] rounded" />
      </div>
    );
  }

  const aqi = data?.aqi ?? 0;
  const cat = getAQICategory(aqi);

  return (
    <div
      className="glass-fire rounded-xl p-5 border hover:scale-[1.02] transition-transform"
      style={{ borderColor: `${cat.color}33`, boxShadow: `0 4px 20px ${cat.color}15` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Wind className="h-4 w-4" style={{ color: cat.color }} />
        <p className="text-xs font-medium uppercase tracking-wider text-[rgba(245,240,234,0.5)]">Air Quality Index</p>
      </div>
      <div className="flex items-end gap-3">
        <span
          className="text-3xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: cat.color }}
        >
          {aqi || "—"}
        </span>
        <span
          className="text-sm font-medium mb-1 px-2 py-0.5 rounded-full"
          style={{ color: cat.color, background: cat.bg, border: `1px solid ${cat.color}33` }}
        >
          {cat.label}
        </span>
      </div>
      <p className="text-xs text-[rgba(245,240,234,0.4)] mt-1">{cat.description}</p>
      {data?.pm25 != null && (
        <p className="text-xs text-[rgba(245,240,234,0.4)] mt-1">PM2.5: {data.pm25.toFixed(1)} μg/m³</p>
      )}
    </div>
  );
}
