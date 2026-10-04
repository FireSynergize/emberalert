"use client";
import { ExternalLink, Phone, Globe, DollarSign, Home, Heart, Brain, Wrench, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const RELIEF_ORGS = [
  {
    category: "Federal Assistance",
    icon: ShieldCheck,
    color: "#ff4500",
    resources: [
      {
        name: "FEMA Disaster Assistance",
        desc: "Apply for federal assistance for housing, personal property, and other disaster-related needs after a presidential disaster declaration.",
        url: "https://www.disasterassistance.gov",
        phone: "1-800-621-3362",
        badge: "Primary Resource",
        badgeVariant: "fire" as const,
      },
      {
        name: "SBA Disaster Loans",
        desc: "Low-interest loans for businesses, homeowners, and renters to repair or replace disaster-damaged property.",
        url: "https://www.sba.gov/funding-programs/disaster-assistance",
        phone: "1-800-659-2955",
        badge: "Loans",
        badgeVariant: "amber" as const,
      },
      {
        name: "IRS Disaster Tax Relief",
        desc: "Casualty loss deductions and extended filing deadlines for taxpayers in presidentially declared disaster areas.",
        url: "https://www.irs.gov/newsroom/tax-relief-in-disaster-situations",
        badge: "Tax Relief",
        badgeVariant: "smoke" as const,
      },
    ],
  },
  {
    category: "Emergency Relief",
    icon: Heart,
    color: "#ef4444",
    resources: [
      {
        name: "American Red Cross",
        desc: "Immediate disaster relief including emergency shelter, food, and recovery support for wildfire survivors.",
        url: "https://www.redcross.org/get-help/disaster-relief-and-recovery-services/find-an-open-shelter.html",
        phone: "1-800-733-2767",
        badge: "Shelter Available",
        badgeVariant: "green" as const,
      },
      {
        name: "United Way 211",
        desc: "24/7 helpline connecting survivors to local community resources, food banks, shelters, and crisis support.",
        phone: "211",
        url: "https://www.211.org",
        badge: "24/7",
        badgeVariant: "green" as const,
      },
      {
        name: "Salvation Army",
        desc: "Feeding programs, emergency financial assistance, and emotional and spiritual care for disaster survivors.",
        url: "https://www.salvationarmyusa.org/usn/disaster-relief",
        phone: "1-800-725-2769",
        badge: "Food & Shelter",
        badgeVariant: "amber" as const,
      },
    ],
  },
  {
    category: "Housing & Rebuilding",
    icon: Home,
    color: "#f59e0b",
    resources: [
      {
        name: "HUD Disaster Resources",
        desc: "Housing assistance programs, mortgage relief, and guidance for renters and homeowners after disasters.",
        url: "https://www.hud.gov/info/dsasters",
        badge: "Housing",
        badgeVariant: "amber" as const,
      },
      {
        name: "Rebuilding Together",
        desc: "Safe and healthy home repairs for low-income wildfire survivors, often at no cost through volunteer programs.",
        url: "https://rebuildingtogether.org",
        badge: "Free Repairs",
        badgeVariant: "green" as const,
      },
      {
        name: "CAL FIRE Recovery",
        desc: "California-specific debris removal, fire-adapted community programs, and rebuilding permit guidance.",
        url: "https://www.fire.ca.gov/what-we-do/emergency-preparedness-and-planning",
        badge: "CA Only",
        badgeVariant: "smoke" as const,
      },
    ],
  },
  {
    category: "Mental Health",
    icon: Brain,
    color: "#8b5cf6",
    resources: [
      {
        name: "SAMHSA Disaster Distress",
        desc: "Free, confidential mental health crisis counseling for people experiencing emotional distress from disasters.",
        url: "https://www.samhsa.gov/find-help/disaster-distress-helpline",
        phone: "1-800-985-5990",
        badge: "Crisis Line",
        badgeVariant: "purple" as const,
      },
      {
        name: "Crisis Text Line",
        desc: "Text HOME to 741741 to connect with a trained crisis counselor. Available 24/7 for free.",
        phone: "Text HOME to 741741",
        badge: "Text Available",
        badgeVariant: "purple" as const,
      },
      {
        name: "FEMA Coping with Disasters",
        desc: "Resources for survivors, first responders, and children on coping with the psychological impact of wildfires.",
        url: "https://www.ready.gov/mental-health-resources",
        badge: "Resources",
        badgeVariant: "smoke" as const,
      },
    ],
  },
  {
    category: "Insurance & Financial",
    icon: DollarSign,
    color: "#10b981",
    resources: [
      {
        name: "CA Dept. of Insurance",
        desc: "Help understanding your homeowner's policy, filing claims, and resolving insurance disputes after wildfires.",
        url: "https://www.insurance.ca.gov/01-consumers/140-catastrophes",
        phone: "1-800-927-4357",
        badge: "CA Only",
        badgeVariant: "smoke" as const,
      },
      {
        name: "NAIC Consumer Guides",
        desc: "State insurance department contacts and guides on understanding disaster insurance for all 50 states.",
        url: "https://content.naic.org/article/consumer_insight_natural_disasters",
        badge: "All States",
        badgeVariant: "green" as const,
      },
      {
        name: "United Policyholders",
        desc: "Nonprofit providing free insurance claim help, documentation tools, and advocacy for disaster survivors.",
        url: "https://uphelp.org",
        badge: "Free Help",
        badgeVariant: "green" as const,
      },
    ],
  },
  {
    category: "Clean-up & Safety",
    icon: Wrench,
    color: "#6b7280",
    resources: [
      {
        name: "EPA After the Fire",
        desc: "Guidance on safely cleaning up ash, debris, and hazardous materials left by wildfire. Includes PPE requirements.",
        url: "https://www.epa.gov/wildfires/wildfire-cleanup",
        badge: "Safety Guide",
        badgeVariant: "smoke" as const,
      },
      {
        name: "CDC Wildfire Smoke Guide",
        desc: "Health guidance on wildfire smoke exposure, air filtration, and when to return home safely.",
        url: "https://www.cdc.gov/niosh/topics/emres/welder.html",
        badge: "Health",
        badgeVariant: "amber" as const,
      },
      {
        name: "OSHA Emergency Cleanup",
        desc: "Worker safety standards for fire cleanup crews, including asbestos, lead paint, and mold hazards.",
        url: "https://www.osha.gov/emergency-preparedness/wildfires",
        badge: "Worker Safety",
        badgeVariant: "smoke" as const,
      },
    ],
  },
];

export function ReliefResources() {
  return (
    <div className="space-y-8">
      {/* Emergency banner */}
      <div className="glass-fire rounded-xl p-5 border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.06)]">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🚨</div>
          <div>
            <p className="text-base font-bold text-[#f87171] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              If You Are in Immediate Danger
            </p>
            <p className="text-sm text-[rgba(245,240,234,0.7)] leading-relaxed">
              Call <strong className="text-white">911</strong> immediately. Follow evacuation orders from local authorities.
              Do not wait to gather belongings — your life is the priority. Return only when authorities confirm it is safe.
            </p>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { phase: "Immediate (0-72hrs)", items: ["Emergency shelter", "Medical attention", "Family communication", "Document safety"], color: "#ff4500" },
          { phase: "Short-term (1-4 weeks)", items: ["FEMA registration", "Insurance claims", "Temporary housing", "Mental health support"], color: "#ff8c00" },
          { phase: "Long-term (months+)", items: ["SBA disaster loans", "Home rebuilding", "Community programs", "Financial recovery"], color: "#10b981" },
        ].map(({ phase, items, color }) => (
          <div key={phase} className="glass-fire rounded-xl p-4 border" style={{ borderColor: `${color}33` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full" style={{ background: color }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color, fontFamily: "'Inter', sans-serif" }}>{phase}</p>
            </div>
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li key={item} className="text-xs text-[rgba(245,240,234,0.6)] flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Resource cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {RELIEF_ORGS.map(({ category, icon: Icon, color, resources }) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg" style={{ background: `${color}15` }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <CardTitle className="text-sm">{category}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources.map((r) => (
                  <div key={r.name} className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,69,0,0.15)] transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-[#f5f0ea]">{r.name}</p>
                      <Badge variant={r.badgeVariant} className="flex-shrink-0 text-[9px]">{r.badge}</Badge>
                    </div>
                    <p className="text-[11px] text-[rgba(245,240,234,0.5)] leading-relaxed mb-2">{r.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {"url" in r && r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[10px] text-[rgba(245,240,234,0.4)] hover:text-[#ff7b35] transition-colors"
                        >
                          <Globe className="h-3 w-3" />
                          Website
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                      {"phone" in r && r.phone && (
                        <a
                          href={`tel:${r.phone?.replace(/[^0-9]/g, "")}`}
                          className="flex items-center gap-1.5 text-[10px] text-[rgba(245,240,234,0.4)] hover:text-[#ff7b35] transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                          {r.phone}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
