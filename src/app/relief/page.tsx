import { Navbar } from "@/components/layout/Navbar";
import { ReliefResources } from "@/components/relief/ReliefResources";
import { Heart } from "lucide-react";

export default function ReliefPage() {
  return (
    <div className="min-h-screen bg-fire-gradient">
      <Navbar />
      <main className="pt-20 md:pt-16 pb-16">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[rgba(255,69,0,0.15)]">
                <Heart className="h-5 w-5 text-[#ff4500]" />
              </div>
              <h1
                className="text-3xl font-bold text-[#f5f0ea]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Relief & Recovery Resources
              </h1>
            </div>
            <p className="text-[rgba(245,240,234,0.5)] ml-[52px]">
              FEMA assistance, disaster relief organizations, mental health support, and rebuilding resources.
            </p>
          </div>
          <ReliefResources />
        </div>
      </main>
    </div>
  );
}
