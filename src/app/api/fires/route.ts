import { NextRequest } from "next/server";
import { fetchFIRMSHotspots, hotspotsToGeoJSON } from "@/lib/api/firms";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "1");
  const source = (searchParams.get("source") ?? "VIIRS_SNPP_NRT") as Parameters<typeof fetchFIRMSHotspots>[1];
  const mapKey = process.env.FIRMS_MAP_KEY;

  if (!mapKey) {
    return Response.json(
      { error: "FIRMS_MAP_KEY not configured", geojson: { type: "FeatureCollection", features: [] } },
      { status: 200 }
    );
  }

  try {
    const hotspots = await fetchFIRMSHotspots(mapKey, source, days);
    const geojson = hotspotsToGeoJSON(hotspots);
    return Response.json({ geojson, count: hotspots.length }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (err) {
    console.error("FIRMS error:", err);
    return Response.json({ error: "Failed to fetch fire data", geojson: { type: "FeatureCollection", features: [] } }, { status: 500 });
  }
}
