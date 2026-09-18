"use client";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { AQIWidget } from "@/components/dashboard/AQIWidget";
import { EmberParticles } from "@/components/dashboard/EmberParticles";
import { ChatBot } from "@/components/chat/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Flame, Home, Users, Wind, MapPin, AlertTriangle, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";
import { HISTORICAL_FIRES } from "@/lib/utils/damage-calculator";

const DEMO_STATS = {
  activeFiresUS: 47,
  acresBurning: 284_300,
  structuresAtRisk: 12_800,
  evacuationOrders: 8,
  containmentAvg: 28,
  smokeAffectedCounties: 143,
};

const ACTIVE_INCIDENTS = [
  { name: "Pine Ridge Fire", state: "CA", acres: 45230, containment: 35, status: "active" as const },
  { name: "Cascade Complex", state: "OR", acres: 128900, containment: 18, status: "active" as const },
  { name: "Dry Creek Fire", state: "WA", acres: 8700, containment: 75, status: "active" as const },
  { name: "Mesa Verde Fire", state: "CO", acres: 22400, containment: 50, status: "active" as const },
  { name: "High Desert Blaze", state: "NM", acres: 67000, containment: 5, status: "active" as const },
];

export default function HomePage() {
  const topFires = HISTORICAL_FIRES.slice(0, 5);

  return (
    <div className="min-h-screen bg-fire-gradient">
      <EmberParticles />
      <Navbar />

      <main className="relative z-10 pt-20 md:pt-16 pb-16">
        {/* Hero */}
        <section className="max-w-screen-2xl mx-auto px-4 pt-8 pb-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="fire" pulse>Live Data</Badge>
                <span className="text-xs text-[rgba(245,240,234,0.4)]">Updated hourly from NASA FIRMS</span>
              </div>
              <h1
                className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="text-[#f5f0ea]">Wildfire</span>
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg, #ff4500, #ff8c00, #ffd700)" }}
                >
                  Intelligence
                </span>
                <br />
                <span className="text-[#f5f0ea]">Platform</span>
              </h1>
              <p className="text-[rgba(245,240,234,0.6)] text-lg max-w-xl leading-relaxed">
                Real-time satellite fire detection, damage assessment, escape route planning, and AI-powered safety guidance for the United States.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href="/map"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff6b00] text-white font-semibold text-sm hover:from-[#ff5a1a] hover:to-[#ff7b1a] transition-all shadow-lg shadow-[rgba(255,69,0,0.4)]"
                >
                  <MapPin className="h-4 w-4" />
                  View Fire Map
                </Link>
                <Link
                  href="/damages"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(255,69,0,0.35)] text-[#ff7b35] font-semibold text-sm hover:bg-[rgba(255,69,0,0.1)] transition-all"
                >
                  <TrendingUp className="h-4 w-4" />
                  Assess Damages
                </Link>
                <Link
                  href="/escape"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-[rgba(245,240,234,0.6)] font-semibold text-sm hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f5f0ea] transition-all"
                >
                  <Shield className="h-4 w-4" />
                  Escape Routes
                </Link>
              </div>
            </div>

            {/* Alert banner */}
            <div className="w-full lg:w-[340px] glass-fire rounded-2xl border border-[rgba(255,69,0,0.25)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-[#ff4500] animate-pulse" />
                <span className="text-sm font-bold text-[#f5f0ea]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Active Incidents</span>
                <Badge variant="fire" className="ml-auto">{ACTIVE_INCIDENTS.length}</Badge>
              </div>
              <div className="space-y-2.5">
                {ACTIVE_INCIDENTS.map((fire) => (
                  <div key={fire.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,69,0,0.2)] transition-colors">
                    <div
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{
                        background: fire.containment < 25 ? "#ff1500" : fire.containment < 60 ? "#ff6600" : "#ffcc00",
                        boxShadow: `0 0 6px ${fire.containment < 25 ? "#ff1500" : fire.containment < 60 ? "#ff6600" : "#ffcc00"}`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#f5f0ea] truncate">{fire.name}</p>
                      <p className="text-[10px] text-[rgba(245,240,234,0.4)]">{fire.state} · {fire.acres.toLocaleString()} acres</p>
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: fire.containment < 25 ? "#ff4444" : fire.containment < 60 ? "#ff9900" : "#4ade80" }}>
                      {fire.containment}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats grid */}
        <section className="max-w-screen-2xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Active Fires (US)" value={DEMO_STATS.activeFiresUS} icon={Flame} color="fire" pulse />
            <StatCard title="Acres Burning" value={(DEMO_STATS.acresBurning / 1000).toFixed(0) + "K"} icon={MapPin} color="red" />
            <StatCard title="Structures at Risk" value={DEMO_STATS.structuresAtRisk.toLocaleString()} icon={Home} color="amber" />
            <StatCard title="Evacuation Orders" value={DEMO_STATS.evacuationOrders} icon={Users} color="red" pulse />
            <StatCard title="Avg Containment" value={DEMO_STATS.containmentAvg + "%"} icon={TrendingUp} color="amber" />
            <StatCard title="Smoke-Affected Counties" value={DEMO_STATS.smokeAffectedCounties} icon={Wind} color="purple" />
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-screen-2xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* AQI + historical */}
            <div className="xl:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AQIWidget lat={37.7749} lon={-122.4194} />
                <AQIWidget lat={34.0522} lon={-118.2437} />
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[rgba(255,69,0,0.1)]">
                      <TrendingUp className="h-4 w-4 text-[#ff4500]" />
                    </div>
                    <CardTitle className="text-base">Notable Historical Fires</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topFires.map((fire) => (
                      <div key={`${fire.year}-${fire.name}`} className="flex items-center gap-4 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,69,0,0.15)] transition-colors">
                        <span className="text-xl flex-shrink-0">🔥</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#f5f0ea] truncate">{fire.name}</p>
                          <p className="text-[10px] text-[rgba(245,240,234,0.4)]">{fire.state} · {fire.year} · {fire.acresBurned.toLocaleString()} acres</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-[#ff7b35]">
                            ${fire.estimatedDamage >= 1e9 ? (fire.estimatedDamage / 1e9).toFixed(1) + "B" : (fire.estimatedDamage / 1e6).toFixed(0) + "M"}
                          </p>
                          <p className="text-[10px] text-[rgba(245,240,234,0.35)]">{fire.fatalities} fatalities</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chatbot */}
            <div id="chat" className="xl:col-span-1">
              <div className="glass-fire rounded-2xl border border-[rgba(255,69,0,0.2)] h-[600px] flex flex-col overflow-hidden">
                <ChatBot />
              </div>
            </div>
          </div>
        </section>

        {/* Data sources attribution */}
        <section className="max-w-screen-2xl mx-auto px-4">
          <div className="glass-smoke rounded-xl p-4 border border-[rgba(255,255,255,0.06)]">
            <p className="text-[10px] text-[rgba(245,240,234,0.3)] text-center">
              Data sources: NASA FIRMS (VIIRS/MODIS satellite hotspots) · EPA AirNow · Open-Meteo Air Quality · NOAA Weather · CAL FIRE · NWCG Incident Data
              · Demonstration data used when API keys are not configured.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
