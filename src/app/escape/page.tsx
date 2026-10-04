import { Navbar } from "@/components/layout/Navbar";
import { EscapeRoutePlanner } from "@/components/escape/EscapeRoutePlanner";
import { Navigation } from "lucide-react";

export default function EscapePage() {
  return (
    <div className="min-h-screen bg-[#111]">
      <Navbar />
      <main className="pt-14 pb-16">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="h-4 w-4 text-[#e84c1a]" />
              <h1 className="text-xl font-semibold text-[#e0e0e0]">Escape Route Planner</h1>
            </div>
            <p className="text-sm text-[#666] ml-6">
              Plan evacuation routes, identify safe zones, and locate emergency resources near active fires.
            </p>
          </div>
          <EscapeRoutePlanner />
        </div>
      </main>
    </div>
  );
}
