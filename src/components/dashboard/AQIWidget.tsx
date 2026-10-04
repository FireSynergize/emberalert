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
      <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg p-4 animate-pulse">
        <div className="h-3 w-24 bg-[#2e2e2e] rounded mb-3" />
        <div className="h-7 w-16 bg-[#2e2e2e] rounded" />
      </div>
    );
  }

  const aqi = data?.aqi ?? 0;
  const cat = getAQICategory(aqi);

  return (
    <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Wind className="h-3.5 w-3.5" style={{ color: cat.color }} />
        <p className="text-xs text-[#666] uppercase tracking-wider">Air Quality Index</p>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold" style={{ color: cat.color }}>
          {aqi || "—"}
        </span>
        <span className="text-xs font-medium mb-0.5 text-[#888]">{cat.label}</span>
      </div>
      <p className="text-xs text-[#666] mt-1">{cat.description}</p>
      {data?.pm25 != null && (
        <p className="text-xs text-[#555] mt-0.5">PM2.5: {data.pm25.toFixed(1)} μg/m³</p>
      )}
    </div>
  );
}
