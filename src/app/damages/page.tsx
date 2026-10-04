import { Navbar } from "@/components/layout/Navbar";
import { DamageCalculator } from "@/components/damages/DamageCalculator";
import { HistoricalComparison } from "@/components/damages/HistoricalComparison";
import { Calculator } from "lucide-react";

export default function DamagesPage() {
  return (
    <div className="min-h-screen bg-[#111]">
      <Navbar />
      <main className="pt-14 pb-16">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="h-4 w-4 text-[#e84c1a]" />
              <h1 className="text-xl font-semibold text-[#e0e0e0]">Damage Assessment</h1>
            </div>
            <p className="text-sm text-[#666] ml-6">
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
