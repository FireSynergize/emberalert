import { NextRequest } from "next/server";
import { fetchCurrentAQI } from "@/lib/api/openmeteo";
import { fetchAirNowObservations } from "@/lib/api/airnow";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "37.7749");
  const lon = parseFloat(searchParams.get("lon") ?? "-119.4179");
  const source = searchParams.get("source") ?? "openmeteo";

  try {
    if (source === "airnow" && process.env.AIRNOW_API_KEY) {
      const readings = await fetchAirNowObservations(
        process.env.AIRNOW_API_KEY,
        lat,
        lon
      );
      return Response.json({ source: "airnow", readings }, {
        headers: { "Cache-Control": "public, s-maxage=3600" },
      });
    }

    const data = await fetchCurrentAQI(lat, lon);
    return Response.json({ source: "openmeteo", ...data }, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  } catch (err) {
    console.error("Air quality error:", err);
    return Response.json({ error: "Failed to fetch air quality data" }, { status: 500 });
  }
}
