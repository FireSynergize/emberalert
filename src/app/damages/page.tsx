import { Navbar } from "@/components/layout/Navbar";
import { DamageCalculator } from "@/components/damages/DamageCalculator";
import { HistoricalComparison } from "@/components/damages/HistoricalComparison";
import { Calculator } from "lucide-react";

export default function DamagesPage() {
  return (
    <div className="min-h-screen bg-fire-gradient">
      <Navbar />
      <main className="pt-20 md:pt-16 pb-16">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[rgba(255,69,0,0.15)]">
                <Calculator className="h-5 w-5 text-[#ff4500]" />
              </div>
              <h1
                className="text-3xl font-bold text-[#f5f0ea]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Damage Assessment
              </h1>
            </div>
            <p className="text-[rgba(245,240,234,0.5)] ml-[52px]">
              Estimate economic impact using FEMA methodology and state-level property valuation data.
            </p>
          </div>

          <DamageCalculator />

          <div className="mt-10">
            <HistoricalComparison />
          </div>
        </div>
      </main>
    </div>
  );
}
