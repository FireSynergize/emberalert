import { Navbar } from "@/components/layout/Navbar";
import { ReliefResources } from "@/components/relief/ReliefResources";
import { Heart } from "lucide-react";

export default function ReliefPage() {
  return (
    <div className="min-h-screen bg-[#111]">
      <Navbar />
      <main className="pt-14 pb-16">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-4 w-4 text-[#e84c1a]" />
              <h1 className="text-xl font-semibold text-[#e0e0e0]">Relief & Recovery Resources</h1>
            </div>
            <p className="text-sm text-[#666] ml-6">
              FEMA assistance, disaster relief organizations, mental health support, and rebuilding resources.
            </p>
          </div>
          <ReliefResources />
        </div>
      </main>
    </div>
  );
}
