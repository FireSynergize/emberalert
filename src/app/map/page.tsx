"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Flame, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const FireMap = dynamic(() => import("@/components/map/FireMap").then((m) => ({ default: m.FireMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0500] rounded-xl border border-[rgba(255,69,0,0.2)]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 text-[#ff4500] animate-spin mx-auto mb-2" />
        <p className="text-sm text-[rgba(245,240,234,0.5)]">Loading satellite imagery...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="min-h-screen bg-fire-gradient flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 md:pt-16 flex flex-col">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold text-[#f5f0ea]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Fire Intelligence Map
              </h1>
              <p className="text-sm text-[rgba(245,240,234,0.4)] mt-0.5">
                Satellite imagery with real-time fire hotspots, perimeters, and air quality overlays
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="fire" pulse>
                <Flame className="h-3 w-3" />
                Live Satellite Data
              </Badge>
            </div>
          </div>

          <div className="flex-1 min-h-[600px]">
            <Suspense>
              <FireMap height="100%" showControls initialCenter={[-98.5795, 39.8283]} initialZoom={4} />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🛰️", title: "NASA FIRMS Data", desc: "VIIRS and MODIS sensors detect fire hotspots with ~375m resolution every 12 hours." },
              { icon: "🌡️", title: "Fire Radiative Power", desc: "FRP values indicate fire intensity. Higher values (red) signal more energetic, rapidly spreading fires." },
              { icon: "💨", title: "Smoke & Air Quality", desc: "PM2.5 concentrations from smoke can reach hazardous levels 100+ miles from active fires." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="glass-fire rounded-xl p-4 border border-[rgba(255,69,0,0.15)]">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#f5f0ea] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</p>
                    <p className="text-xs text-[rgba(245,240,234,0.5)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
