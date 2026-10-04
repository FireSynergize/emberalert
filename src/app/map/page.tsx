"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Loader2 } from "lucide-react";

const FireMap = dynamic(() => import("@/components/map/FireMap").then((m) => ({ default: m.FireMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#1c1c1c] rounded-lg border border-[#2e2e2e]">
      <div className="text-center">
        <Loader2 className="h-6 w-6 text-[#e84c1a] animate-spin mx-auto mb-2" />
        <p className="text-sm text-[#666]">Loading satellite imagery...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="min-h-screen bg-[#111] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14 flex flex-col">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#e0e0e0]">Fire Intelligence Map</h1>
              <p className="text-sm text-[#666] mt-0.5">
                Satellite imagery with real-time fire hotspots and air quality overlays
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-[600px] relative">
            <Suspense>
              <FireMap height="100%" showControls initialCenter={[-98.5795, 39.8283]} initialZoom={4} />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: "NASA FIRMS Data", desc: "VIIRS and MODIS sensors detect fire hotspots with ~375m resolution every 12 hours." },
              { title: "Fire Radiative Power", desc: "FRP values indicate fire intensity. Higher values (red) signal more energetic, rapidly spreading fires." },
              { title: "Smoke & Air Quality", desc: "PM2.5 concentrations from smoke can reach hazardous levels 100+ miles from active fires." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg p-4">
                <p className="text-sm font-medium text-[#e0e0e0] mb-1">{title}</p>
                <p className="text-xs text-[#666] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
