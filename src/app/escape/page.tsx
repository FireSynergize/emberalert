import { Navbar } from "@/components/layout/Navbar";
import { EscapeRoutePlanner } from "@/components/escape/EscapeRoutePlanner";
import { Navigation } from "lucide-react";

export default function EscapePage() {
  return (
    <div className="min-h-screen bg-fire-gradient">
      <Navbar />
      <main className="pt-20 md:pt-16 pb-16">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[rgba(255,69,0,0.15)]">
                <Navigation className="h-5 w-5 text-[#ff4500]" />
              </div>
              <h1
                className="text-3xl font-bold text-[#f5f0ea]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Escape Route Planner
              </h1>
            </div>
            <p className="text-[rgba(245,240,234,0.5)] ml-[52px]">
              Plan evacuation routes, identify safe zones, and locate emergency resources near active fires.
            </p>
          </div>
          <EscapeRoutePlanner />
        </div>
      </main>
    </div>
  );
}
