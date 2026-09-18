"use client";
import { useState } from "react";
import { MapPin, AlertTriangle, CheckCircle, Phone, ExternalLink, Navigation, Car, Footprints, Hospital, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

const EVACUATION_CHECKLIST = [
  { id: "documents", label: "ID, passports, insurance docs", category: "Documents" },
  { id: "medication", label: "Prescription medications (30-day supply)", category: "Medical" },
  { id: "water", label: "1 gallon water per person per day (3 days)", category: "Supplies" },
  { id: "food", label: "3-day supply of non-perishable food", category: "Supplies" },
  { id: "phone", label: "Phone charger and backup battery", category: "Electronics" },
  { id: "cash", label: "Cash in small bills ($100+)", category: "Financial" },
  { id: "clothes", label: "Change of clothes + sturdy shoes", category: "Clothing" },
  { id: "n95", label: "N95 masks for smoke protection", category: "Medical" },
  { id: "pets", label: "Pet carriers, food, medical records", category: "Pets" },
  { id: "harddrive", label: "External hard drive or USB with backups", category: "Electronics" },
  { id: "firstaid", label: "First aid kit", category: "Medical" },
  { id: "maps", label: "Paper maps (offline backup)", category: "Navigation" },
];

const EVACUATION_ZONES = [
  { level: "Warning Zone", color: "#ff4500", description: "Be prepared to leave immediately. Monitor official channels.", action: "Prepare now" },
  { level: "Watch Zone", color: "#ff8c00", description: "Conditions may change rapidly. Be ready to leave on short notice.", action: "Get ready" },
  { level: "Advisory Zone", color: "#ffd700", description: "Stay aware of fire conditions. Review your evacuation plan.", action: "Stay aware" },
];

const EMERGENCY_CONTACTS = [
  { name: "Emergency Services", number: "911", icon: Phone, always: true },
  { name: "FEMA Helpline", number: "1-800-621-3362", icon: ShieldCheck, always: false },
  { name: "Red Cross", number: "1-800-733-2767", icon: Hospital, always: false },
  { name: "CAL FIRE", number: "1-800-468-4408", icon: AlertTriangle, always: false },
  { name: "USFS Fire Info", number: "1-877-864-6985", icon: Navigation, always: false },
];

const ROUTE_TIPS = [
  { icon: Car, tip: "Keep gas tank at least half full during fire season", priority: "high" },
  { icon: MapPin, tip: "Know at least TWO routes out — fires can block primary roads", priority: "high" },
  { icon: Navigation, tip: "Pre-download offline maps for your area in Google Maps or Maps.me", priority: "high" },
  { icon: AlertTriangle, tip: "Never drive through smoke-filled areas — visibility can drop to zero", priority: "high" },
  { icon: Footprints, tip: "If your car is trapped, stay inside. Cover vents with clothing.", priority: "medium" },
  { icon: Phone, tip: "Register for your county's emergency alert system (Wireless Emergency Alerts)", priority: "medium" },
  { icon: MapPin, tip: "Identify two meeting points: near your home and outside your neighborhood", priority: "medium" },
  { icon: Car, tip: "Keep vehicle windows and air vents closed while driving through smoke zones", priority: "medium" },
];

export function EscapeRoutePlanner() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const toggleItem = (id: string) => setCheckedItems((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const completionPct = Math.round((checkedItems.size / EVACUATION_CHECKLIST.length) * 100);

  return (
    <div className="space-y-6">
      {/* Evacuation Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EVACUATION_ZONES.map((zone) => (
          <div
            key={zone.level}
            className="glass-fire rounded-xl p-5 border hover:scale-[1.02] transition-transform"
            style={{ borderColor: `${zone.color}33` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-3 w-3 rounded-full animate-pulse" style={{ background: zone.color, boxShadow: `0 0 8px ${zone.color}` }} />
              <span className="text-sm font-bold text-[#f5f0ea]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{zone.level}</span>
            </div>
            <p className="text-xs text-[rgba(245,240,234,0.6)] leading-relaxed mb-3">{zone.description}</p>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: `${zone.color}15`, color: zone.color, border: `1px solid ${zone.color}33` }}
            >
              {zone.action}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Go-Bag Checklist */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[rgba(255,69,0,0.1)]">
                  <CheckCircle className="h-4 w-4 text-[#ff4500]" />
                </div>
                <CardTitle className="text-base">Go-Bag Checklist</CardTitle>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#ff7b35]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{completionPct}%</p>
                <p className="text-[10px] text-[rgba(245,240,234,0.4)]">{checkedItems.size}/{EVACUATION_CHECKLIST.length} items</p>
              </div>
            </div>
            <div className="w-full bg-[rgba(255,255,255,0.06)] rounded-full h-1.5 mt-2">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${completionPct}%`,
                  background: `linear-gradient(90deg, #ff4500, ${completionPct > 75 ? "#4ade80" : "#ff8c00"})`,
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {EVACUATION_CHECKLIST.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all",
                    checkedItems.has(item.id)
                      ? "bg-[rgba(74,222,128,0.06)] border border-[rgba(74,222,128,0.15)]"
                      : "border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,69,0,0.2)] hover:bg-[rgba(255,69,0,0.03)]"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 h-4 w-4 rounded flex-shrink-0 flex items-center justify-center border transition-all",
                    checkedItems.has(item.id)
                      ? "bg-[#4ade80] border-[#4ade80]"
                      : "border-[rgba(255,255,255,0.2)]"
                  )}>
                    {checkedItems.has(item.id) && (
                      <svg className="h-2.5 w-2.5 text-[#0a0500]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={cn("text-xs font-medium", checkedItems.has(item.id) ? "text-[rgba(245,240,234,0.5)] line-through" : "text-[#f5f0ea]")}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-[rgba(245,240,234,0.3)]">{item.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Route tips + emergency contacts */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[rgba(255,69,0,0.1)]">
                  <Car className="h-4 w-4 text-[#ff4500]" />
                </div>
                <CardTitle className="text-base">Evacuation Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {ROUTE_TIPS.map(({ icon: Icon, tip, priority }) => (
                  <div key={tip} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                    <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", priority === "high" ? "text-[#ff4500]" : "text-[#ff8c00]")} />
                    <p className="text-xs text-[rgba(245,240,234,0.7)] leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="ember">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#ff4500]" />
                <CardTitle className="text-sm">Emergency Contacts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {EMERGENCY_CONTACTS.map(({ name, number, icon: Icon, always }) => (
                  <div key={name} className="flex items-center gap-3 p-2.5 rounded-lg border border-[rgba(255,255,255,0.06)]">
                    <Icon className="h-4 w-4 text-[#ff7b35] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[#f5f0ea]">{name}</p>
                      <p className="text-xs text-[rgba(245,240,234,0.5)]">{number}</p>
                    </div>
                    {always && <Badge variant="red">Emergency</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="glass-fire rounded-xl p-4 border border-[rgba(255,140,0,0.25)]">
            <div className="flex items-start gap-3">
              <ExternalLink className="h-4 w-4 text-[#ff8c00] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#f5f0ea] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Find Your Evacuation Zone
                </p>
                <p className="text-xs text-[rgba(245,240,234,0.5)] mb-3">
                  Evacuation zones vary by county. Look up your zone on your county's Office of Emergency Services website.
                </p>
                <Button variant="outline" size="sm" onClick={() => window.open("https://www.ready.gov/evacuation", "_blank")}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ready.gov Evacuation Guide
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
