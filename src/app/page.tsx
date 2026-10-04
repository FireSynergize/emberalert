"use client";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { AQIWidget } from "@/components/dashboard/AQIWidget";
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

function containmentColor(pct: number) {
  if (pct < 25) return "#ef4444";
  if (pct < 60) return "#f97316";
  return "#22c55e";
}

export default function HomePage() {
  const topFires = HISTORICAL_FIRES.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#111]">
      <Navbar />

      <main className="pt-14 pb-16">
        {/* Hero */}
        <section className="max-w-screen-2xl mx-auto px-4 pt-10 pb-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="fire" pulse>Live Data</Badge>
                <span className="text-xs text-[#666]">Updated hourly from NASA FIRMS</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#e0e0e0] leading-tight mb-3">
                Wildfire Intelligence Platform
              </h1>
              <p className="text-[#888] text-base max-w-xl leading-relaxed">
                Real-time satellite fire detection, damage assessment, escape route planning, and AI-powered safety guidance for the United States.
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                <Link
                  href="/map"
                  className="flex items-center gap-2 px-4 py-2 rounded bg-[#e84c1a] text-white text-sm font-medium hover:bg-[#d43e0f] transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  View Fire Map
                </Link>
                <Link
                  href="/damages"
                  className="flex items-center gap-2 px-4 py-2 rounded border border-[#2e2e2e] text-[#888] text-sm font-medium hover:border-[#444] hover:text-[#e0e0e0] transition-colors"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Assess Damages
                </Link>
                <Link
                  href="/escape"
                  className="flex items-center gap-2 px-4 py-2 rounded border border-[#2e2e2e] text-[#888] text-sm font-medium hover:border-[#444] hover:text-[#e0e0e0] transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Escape Routes
                </Link>
              </div>
            </div>

            {/* Active incidents */}
            <div className="w-full lg:w-[320px] bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-[#e84c1a]" />
                <span className="text-sm font-semibold text-[#e0e0e0]">Active Incidents</span>
                <Badge variant="fire" className="ml-auto">{ACTIVE_INCIDENTS.length}</Badge>
              </div>
              <div className="space-y-2">
                {ACTIVE_INCIDENTS.map((fire) => (
                  <div key={fire.name} className="flex items-center gap-3 py-2 border-b border-[#2e2e2e] last:border-0">
                    <div
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ background: containmentColor(fire.containment) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#e0e0e0] truncate">{fire.name}</p>
                      <p className="text-[10px] text-[#666]">{fire.state} · {fire.acres.toLocaleString()} acres</p>
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: containmentColor(fire.containment) }}>
                      {fire.containment}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-screen-2xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard title="Active Fires (US)" value={DEMO_STATS.activeFiresUS} icon={Flame} color="fire" pulse />
            <StatCard title="Acres Burning" value={(DEMO_STATS.acresBurning / 1000).toFixed(0) + "K"} icon={MapPin} color="red" />
            <StatCard title="Structures at Risk" value={DEMO_STATS.structuresAtRisk.toLocaleString()} icon={Home} color="amber" />
            <StatCard title="Evacuation Orders" value={DEMO_STATS.evacuationOrders} icon={Users} color="red" pulse />
            <StatCard title="Avg Containment" value={DEMO_STATS.containmentAvg + "%"} icon={TrendingUp} color="amber" />
            <StatCard title="Smoke Counties" value={DEMO_STATS.smokeAffectedCounties} icon={Wind} color="purple" />
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-screen-2xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AQIWidget lat={37.7749} lon={-122.4194} />
                <AQIWidget lat={34.0522} lon={-118.2437} />
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#e84c1a]" />
                    <CardTitle>Notable Historical Fires</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-[#2e2e2e]">
                    {topFires.map((fire) => (
                      <div key={`${fire.year}-${fire.name}`} className="flex items-center gap-3 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#e0e0e0] truncate">{fire.name}</p>
                          <p className="text-xs text-[#666]">{fire.state} · {fire.year} · {fire.acresBurned.toLocaleString()} acres</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-semibold text-[#e84c1a]">
                            ${fire.estimatedDamage >= 1e9 ? (fire.estimatedDamage / 1e9).toFixed(1) + "B" : (fire.estimatedDamage / 1e6).toFixed(0) + "M"}
                          </p>
                          <p className="text-[10px] text-[#555]">{fire.fatalities} fatalities</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chatbot */}
            <div id="chat" className="xl:col-span-1">
              <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg h-[580px] flex flex-col overflow-hidden">
                <ChatBot />
              </div>
            </div>
          </div>
        </section>

        {/* Attribution */}
        <section className="max-w-screen-2xl mx-auto px-4">
          <p className="text-[10px] text-[#444] text-center">
            Data sources: NASA FIRMS (VIIRS/MODIS) · EPA AirNow · Open-Meteo · NOAA · CAL FIRE · NWCG. Demo data used when API keys are not configured.
          </p>
        </section>
      </main>
    </div>
  );
}
