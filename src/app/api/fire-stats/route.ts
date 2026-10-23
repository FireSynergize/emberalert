import { NextResponse } from "next/server";
import { fetchFIRMSHotspots } from "@/lib/api/firms";

function approxState(lat: number, lng: number): string {
  if (lat > 32 && lat < 42 && lng > -124.5 && lng < -114) return lat > 38 ? "N. California" : "S. California";
  if (lat > 42 && lat < 46.5 && lng > -124.5 && lng < -116.5) return "Oregon";
  if (lat > 45.5 && lat < 49 && lng > -124.8 && lng < -116.9) return "Washington";
  if (lat > 42 && lat < 49 && lng > -117.2 && lng < -111) return "Idaho";
  if (lat > 44.4 && lat < 49 && lng > -116.1 && lng < -104) return "Montana";
  if (lat > 41 && lat < 45.1 && lng > -111.1 && lng < -104) return "Wyoming";
  if (lat > 37 && lat < 42 && lng > -114.1 && lng < -109) return "Utah";
  if (lat > 35 && lat < 42 && lng > -120.1 && lng < -114) return "Nevada";
  if (lat > 31.3 && lat < 37.1 && lng > -114.8 && lng < -109) return "Arizona";
  if (lat > 31.3 && lat < 37 && lng > -109.1 && lng < -103) return "New Mexico";
  if (lat > 37 && lat < 41.1 && lng > -109.1 && lng < -102) return "Colorado";
  if (lat > 25.8 && lat < 36.6 && lng > -106.7 && lng < -93.5) return "Texas";
  if (lat > 28.9 && lat < 33.1 && lng > -94.1 && lng < -88.8) return "Louisiana";
  if (lat > 30.1 && lat < 35.1 && lng > -91.7 && lng < -88.1) return "Mississippi";
  if (lat > 30.1 && lat < 35.1 && lng > -88.5 && lng < -84.9) return "Alabama";
  if (lat > 30.4 && lat < 35.1 && lng > -85.7 && lng < -80.8) return "Georgia";
  if (lat > 24.4 && lat < 31.1 && lng > -87.7 && lng < -79.9) return "Florida";
  if (lat > 33.8 && lat < 36.6 && lng > -84.4 && lng < -75.4) return "N. Carolina";
  if (lat > 36.5 && lat < 39.5 && lng > -83.7 && lng < -75.2) return "Virginia";
  return "CONUS";
}

export interface FireZone {
  lat: number;
  lng: number;
  frp: number;
  hotspots: number;
  label: string;
}

export interface FireStats {
  hotspotCount: number | null;
  peakFrp: number | null;
  topZones: FireZone[];
}

export async function GET() {
  const mapKey = process.env.FIRMS_MAP_KEY;
  if (!mapKey) {
    return NextResponse.json<FireStats>({ hotspotCount: null, peakFrp: null, topZones: [] });
  }

  try {
    const hotspots = await fetchFIRMSHotspots(mapKey, "VIIRS_SNPP_NRT", 1);

    // Cluster by 1° grid cell
    const cells = new Map<string, { lat: number; lng: number; frp: number; count: number; label: string }>();
    for (const h of hotspots) {
      const key = `${Math.round(h.latitude)},${Math.round(h.longitude)}`;
      const existing = cells.get(key);
      if (existing) {
        existing.frp += h.frp;
        existing.count += 1;
      } else {
        cells.set(key, {
          lat: h.latitude,
          lng: h.longitude,
          frp: h.frp,
          count: 1,
          label: approxState(h.latitude, h.longitude),
        });
      }
    }

    const sorted = [...cells.values()].sort((a, b) => b.frp - a.frp);
    const topZones: FireZone[] = sorted
      .slice(0, 5)
      .map((z) => ({ lat: z.lat, lng: z.lng, frp: Math.round(z.frp), hotspots: z.count, label: z.label }));
    const peakFrp = sorted.length > 0 ? Math.round(sorted[0].frp) : null;

    return NextResponse.json<FireStats>({ hotspotCount: hotspots.length, peakFrp, topZones }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (err) {
    console.error("fire-stats error:", err);
    return NextResponse.json<FireStats>({ hotspotCount: null, peakFrp: null, topZones: [] });
  }
}
