"use client";
import { useState } from "react";
import { Calculator, DollarSign, Home, TreePine, Zap, Leaf, TrendingUp, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils/cn";
import { calculateDamages } from "@/lib/utils/damage-calculator";
import type { DamageInputs, DamageEstimate, LandType } from "@/types/fire";
import { DamageChart } from "./DamageChart";

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const LAND_TYPE_OPTIONS: { value: LandType; label: string; icon: React.ReactNode }[] = [
  { value: "residential", label: "Residential", icon: "🏘️" },
  { value: "commercial", label: "Commercial", icon: "🏢" },
  { value: "agricultural", label: "Agricultural", icon: "🌾" },
  { value: "forest", label: "Forest", icon: "🌲" },
  { value: "grassland", label: "Grassland", icon: "🌿" },
  { value: "wildland-urban", label: "Wildland-Urban", icon: "🏕️" },
];

const defaultInputs: DamageInputs = {
  acresBurned: 10000,
  structuresDestroyed: 50,
  structuresThreatened: 200,
  state: "CA",
  landType: ["forest", "wildland-urban"],
  fireIntensity: "high",
  urbanProximity: 10,
};

export function DamageCalculator() {
  const [inputs, setInputs] = useState<DamageInputs>(defaultInputs);
  const [result, setResult] = useState<DamageEstimate | null>(() => calculateDamages(defaultInputs));

  const handleCalculate = () => {
    const estimate = calculateDamages(inputs);
    setResult(estimate);
  };

  const toggleLandType = (type: LandType) => {
    setInputs((prev) => ({
      ...prev,
      landType: prev.landType.includes(type)
        ? prev.landType.filter((t) => t !== type)
        : [...prev.landType, type],
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <Card variant="default">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[rgba(255,69,0,0.15)]">
              <Calculator className="h-4 w-4 text-[#ff4500]" />
            </div>
            <CardTitle className="text-base">Fire Parameters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[rgba(245,240,234,0.5)] mb-1.5 uppercase tracking-wide">Acres Burned</label>
              <input
                type="number"
                min={0}
                value={inputs.acresBurned}
                onChange={(e) => setInputs((p) => ({ ...p, acresBurned: Number(e.target.value) }))}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,69,0,0.2)] rounded-lg px-3 py-2 text-sm text-[#f5f0ea] focus:outline-none focus:border-[rgba(255,69,0,0.5)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[rgba(245,240,234,0.5)] mb-1.5 uppercase tracking-wide">State</label>
              <select
                value={inputs.state}
                onChange={(e) => setInputs((p) => ({ ...p, state: e.target.value }))}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,69,0,0.2)] rounded-lg px-3 py-2 text-sm text-[#f5f0ea] focus:outline-none focus:border-[rgba(255,69,0,0.5)] transition-colors"
              >
                {US_STATES.map((s) => <option key={s} value={s} className="bg-[#1a0900]">{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[rgba(245,240,234,0.5)] mb-1.5 uppercase tracking-wide">Structures Destroyed</label>
              <input
                type="number"
                min={0}
                value={inputs.structuresDestroyed}
                onChange={(e) => setInputs((p) => ({ ...p, structuresDestroyed: Number(e.target.value) }))}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,69,0,0.2)] rounded-lg px-3 py-2 text-sm text-[#f5f0ea] focus:outline-none focus:border-[rgba(255,69,0,0.5)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[rgba(245,240,234,0.5)] mb-1.5 uppercase tracking-wide">Structures Threatened</label>
              <input
                type="number"
                min={0}
                value={inputs.structuresThreatened}
                onChange={(e) => setInputs((p) => ({ ...p, structuresThreatened: Number(e.target.value) }))}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,69,0,0.2)] rounded-lg px-3 py-2 text-sm text-[#f5f0ea] focus:outline-none focus:border-[rgba(255,69,0,0.5)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[rgba(245,240,234,0.5)] mb-2 uppercase tracking-wide">Fire Intensity</label>
            <div className="grid grid-cols-4 gap-2">
              {(["low", "moderate", "high", "extreme"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setInputs((p) => ({ ...p, fireIntensity: level }))}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${
                    inputs.fireIntensity === level
                      ? "border-[#ff4500] bg-[rgba(255,69,0,0.2)] text-[#ff7b35]"
                      : "border-[rgba(255,255,255,0.1)] text-[rgba(245,240,234,0.4)] hover:border-[rgba(255,69,0,0.3)] hover:text-[rgba(245,240,234,0.7)]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[rgba(245,240,234,0.5)] mb-2 uppercase tracking-wide">Land Types Affected</label>
            <div className="grid grid-cols-3 gap-2">
              {LAND_TYPE_OPTIONS.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => toggleLandType(value)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all border ${
                    inputs.landType.includes(value)
                      ? "border-[#ff4500] bg-[rgba(255,69,0,0.15)] text-[#ff7b35]"
                      : "border-[rgba(255,255,255,0.08)] text-[rgba(245,240,234,0.4)] hover:border-[rgba(255,69,0,0.25)]"
                  }`}
                >
                  <span>{icon}</span>
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[rgba(245,240,234,0.5)] mb-1.5 uppercase tracking-wide">
              Urban Proximity (miles)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={inputs.urbanProximity}
              onChange={(e) => setInputs((p) => ({ ...p, urbanProximity: Number(e.target.value) }))}
              className="w-full accent-[#ff4500]"
            />
            <div className="flex justify-between text-[10px] text-[rgba(245,240,234,0.3)] mt-1">
              <span>Urban Core</span>
              <span className="text-[rgba(245,240,234,0.5)] font-medium">{inputs.urbanProximity} mi</span>
              <span>Remote</span>
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full">
            <Calculator className="h-4 w-4" />
            Calculate Damage Estimate
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <Card variant="ember" glow>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="text-xs font-medium uppercase tracking-widest text-[rgba(245,240,234,0.4)] mb-1">Total Economic Impact</p>
                <p
                  className="text-4xl font-bold text-[#ff7b35] text-glow"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {formatNumber(result.totalEstimate)}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant={result.confidence === "high" ? "green" : result.confidence === "medium" ? "yellow" : "smoke"}>
                    {result.confidence} confidence
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Property Damage", value: result.propertyDamage, icon: Home, color: "#ff4500" },
                  { label: "Agricultural", value: result.agriculturalDamage, icon: TreePine, color: "#10b981" },
                  { label: "Infrastructure", value: result.infrastructureDamage, icon: Zap, color: "#f59e0b" },
                  { label: "Environmental", value: result.environmentalDamage, icon: Leaf, color: "#6366f1" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-[rgba(255,255,255,0.04)] rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                      <p className="text-[10px] text-[rgba(245,240,234,0.4)] uppercase tracking-wider">{label}</p>
                    </div>
                    <p className="text-sm font-bold" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>
                      {formatNumber(value)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-[rgba(245,240,234,0.4)] mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-[rgba(245,240,234,0.35)] leading-relaxed">{result.methodology}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DamageChart result={result} />
        </div>
      )}
    </div>
  );
}
