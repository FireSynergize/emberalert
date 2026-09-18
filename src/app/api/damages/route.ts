import { NextRequest } from "next/server";
import { calculateDamages } from "@/lib/utils/damage-calculator";
import type { DamageInputs } from "@/types/fire";

export async function POST(req: NextRequest) {
  const inputs: DamageInputs = await req.json();

  if (!inputs.acresBurned || inputs.acresBurned < 0) {
    return Response.json({ error: "Invalid acres burned value" }, { status: 400 });
  }

  const estimate = calculateDamages(inputs);
  return Response.json(estimate);
}
