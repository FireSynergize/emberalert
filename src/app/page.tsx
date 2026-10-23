"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { AQIWidget } from "@/components/dashboard/AQIWidget";
import { ChatBot } from "@/components/chat/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Flame, Home, Users, Wind, MapPin, AlertTriangle, TrendingUp, Shield, LocateFixed, X } from "lucide-react";
import Link from "next/link";
import { HISTORICAL_FIRES } from "@/lib/utils/damage-calculator";
import type { FireStats } from "@/app/api/fire-stats/route";

type LocationState =
  | { status: "prompt" }
  | { status: "loading" }
  | { status: "granted"; lat: number; lng: number }
  | { status: "denied" }
  | { status: "skipped" };

function frpLabel(frp: number) {
  if (frp > 2000) return "Extreme";
  if (frp > 500) return "High";
  if (frp > 100) return "Moderate";
  return "Low";
}
function frpColor(frp: number) {
  if (frp > 2000) return "#ef4444";
  if (frp > 500) return "#f97316";
  if (frp > 100) return "#eab308";
  return "#22c55e";
}

export default function HomePage() {
  const topFires = HISTORICAL_FIRES.slice(0, 5);

  const [location, setLocation] = useState<LocationState>({ status: "prompt" });
  const [stats, setStats] = useState<FireStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fire-stats")
      .then((r) => r.json())
      .then((d: FireStats) => { setStats(d); setStatsLoading(false); })
      .catch(() => setStatsLoading(false));
  }, []);

  function requestLocation() {
    setLocation({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ status: "granted", lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ status: "denied" }),
      { timeout: 8000 }
    );
  }

  const hotspotCount = stats?.hotspotCount;
  const zoneCount = stats?.topZones.length ?? 0;
  const topZones = stats?.topZones ?? [];
  const hasLiveFireData = hotspotCount != null;

  return (
    <div className="min-h-screen bg-[#111]">
      <Navbar />

      <main className="pt-14 pb-16">
        {/* Location prompt banner */}
        {location.status === "prompt" && (
          <div className="bg-[#1a1a1a] border-b border-[#2e2e2e]">
            <div className="max-w-screen-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
              <LocateFixed className="h-4 w-4 text-[#e84c1a] flex-shrink-0" />
              <p className="text-xs text-[#888] flex-1">
                Allow location access for real-time local air quality and nearby fire alerts.
              </p>
              <button
                onClick={requestLocation}
                className="text-xs font-medium text-[#e84c1a] hover:text-[#ff6b3d] transition-colors flex-shrink-0"
              >
                Allow
              </button>
              <button
                onClick={() => setLocation({ status: "skipped" })}
                className="text-[#444] hover:text-[#666] transition-colors flex-shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
        {location.status === "loading" && (
          <div className="bg-[#1a1a1a] border-b border-[#2e2e2e]">
            <div className="max-w-screen-2xl mx-auto px-4 py-2.5">
              <p className="text-xs text-[#555]">Requesting location…</p>
            </div>
          </div>
        )}

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

            {/* Active fire zones */}
            <div className="w-full lg:w-[320px] bg-[#1c1c1c] border border-[#2e2e2e] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-[#e84c1a]" />
                <span className="text-sm font-semibold text-[#e0e0e0]">
                  {hasLiveFireData ? "Top Fire Zones" : "Active Incidents"}
                </span>
                {hasLiveFireData ? (
                  <Badge variant="fire" className="ml-auto">{zoneCount}</Badge>
                ) : (
                  <Badge variant="smoke" className="ml-auto text-[10px]">sample</Badge>
                )}
              </div>

              {statsLoading ? (
                <div className="space-y-2 animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-[#2a2a2a] rounded" />
                  ))}
                </div>
              ) : hasLiveFireData ? (
                <div className="space-y-0">
                  {topZones.map((zone, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-[#2e2e2e] last:border-0">
                      <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: frpColor(zone.frp) }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#e0e0e0] truncate">{zone.label} Fire Zone</p>
                        <p className="text-[10px] text-[#666]">{zone.hotspots} hotspots · {zone.frp.toLocaleString()} MW FRP</p>
                      </div>
                      <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: frpColor(zone.frp) }}>
                        {frpLabel(zone.frp)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                // Placeholder when no FIRMS key
                <div className="space-y-0">
                  {[
                    { name: "Pine Ridge Fire", state: "CA", acres: 45230, containment: 35 },
                    { name: "Cascade Complex", state: "OR", acres: 128900, containment: 18 },
                    { name: "Dry Creek Fire", state: "WA", acres: 8700, containment: 75 },
                    { name: "Mesa Verde Fire", state: "CO", acres: 22400, containment: 50 },
                    { name: "High Desert Blaze", state: "NM", acres: 67000, containment: 5 },
                  ].map((fire) => {
                    const c = fire.containment < 25 ? "#ef4444" : fire.containment < 60 ? "#f97316" : "#22c55e";
                    return (
                      <div key={fire.name} className="flex items-center gap-3 py-2 border-b border-[#2e2e2e] last:border-0">
                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: c }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#e0e0e0] truncate">{fire.name}</p>
                          <p className="text-[10px] text-[#666]">{fire.state} · {fire.acres.toLocaleString()} acres</p>
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: c }}>{fire.containment}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-screen-2xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard
              title="Active Hotspots"
              value={statsLoading ? "…" : hotspotCount != null ? hotspotCount.toLocaleString() : "—"}
              icon={Flame}
              color="fire"
              pulse={hasLiveFireData}
            />
            <StatCard
              title="Fire Zones"
              value={statsLoading ? "…" : hasLiveFireData ? zoneCount.toString() : "—"}
              icon={MapPin}
              color="red"
            />
            <StatCard title="Structures at Risk" value="—" icon={Home} color="amber" />
            <StatCard title="Evacuation Orders" value="—" icon={Users} color="red" />
            <StatCard title="Avg Containment" value="—" icon={TrendingUp} color="amber" />
            <StatCard title="Smoke Counties" value="—" icon={Wind} color="purple" />
          </div>
          {!hasLiveFireData && !statsLoading && (
            <p className="text-[10px] text-[#444] mt-2">
              Live fire stats require a NASA FIRMS API key (FIRMS_MAP_KEY). Showing placeholder data.
            </p>
          )}
        </section>

        {/* Main content */}
        <section className="max-w-screen-2xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {location.status === "granted" ? (
                  <>
                    <AQIWidget lat={location.lat} lon={location.lng} city="Your Location" />
                    <AQIWidget lat={34.0522} lon={-118.2437} city="Los Angeles, CA" />
                  </>
                ) : (
                  <>
                    <AQIWidget lat={37.7749} lon={-122.4194} city={location.status === "denied" ? "San Francisco, CA (example)" : "San Francisco, CA"} />
                    <AQIWidget lat={34.0522} lon={-118.2437} city="Los Angeles, CA" />
                  </>
                )}
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
            Data sources: NASA FIRMS (VIIRS/MODIS) · Open-Meteo · NOAA · CAL FIRE · NWCG.{" "}
            {!hasLiveFireData && !statsLoading && "Configure FIRMS_MAP_KEY for live fire data."}
          </p>
        </section>
      </main>
    </div>
  );
}
