import { NextResponse } from "next/server";
import { fetchCurrentAQI } from "@/lib/api/openmeteo";

const GRID_POINTS = [
  { lat: 47.6, lng: -122.3 }, { lat: 45.5, lng: -122.7 }, { lat: 41.9, lng: -124.2 },
  { lat: 37.8, lng: -122.4 }, { lat: 35.4, lng: -119.0 }, { lat: 34.1, lng: -118.2 },
  { lat: 32.7, lng: -117.2 }, { lat: 43.6, lng: -116.2 }, { lat: 46.9, lng: -114.1 },
  { lat: 48.3, lng: -114.3 }, { lat: 40.8, lng: -111.9 }, { lat: 36.2, lng: -115.1 },
  { lat: 33.4, lng: -112.1 }, { lat: 46.9, lng: -110.5 }, { lat: 39.7, lng: -104.9 },
  { lat: 35.1, lng: -106.7 }, { lat: 31.8, lng: -106.4 }, { lat: 46.9, lng:  -96.8 },
  { lat: 44.4, lng: -100.4 }, { lat: 41.3, lng: -105.6 }, { lat: 39.1, lng:  -94.6 },
  { lat: 35.5, lng:  -97.5 }, { lat: 32.8, lng:  -97.3 }, { lat: 29.7, lng:  -95.4 },
  { lat: 29.4, lng:  -98.5 }, { lat: 44.0, lng:  -92.5 }, { lat: 41.9, lng:  -87.6 },
  { lat: 39.8, lng:  -86.2 }, { lat: 38.3, lng:  -85.8 }, { lat: 44.0, lng:  -83.7 },
  { lat: 42.7, lng:  -78.8 }, { lat: 30.3, lng:  -89.0 }, { lat: 32.4, lng:  -86.3 },
  { lat: 33.8, lng:  -84.4 }, { lat: 36.2, lng:  -81.7 }, { lat: 27.9, lng:  -82.5 },
  { lat: 25.8, lng:  -80.2 }, { lat: 38.9, lng:  -77.0 }, { lat: 40.7, lng:  -74.0 },
  { lat: 42.4, lng:  -71.1 }, { lat: 44.8, lng:  -68.8 },
];

export async function GET() {
  const results = await Promise.allSettled(
    GRID_POINTS.map(async (pt) => {
      const data = await fetchCurrentAQI(pt.lat, pt.lng);
      return { lat: pt.lat, lng: pt.lng, aqi: data.aqi };
    })
  );

  const points = results.map((r, i) => ({
    lat: GRID_POINTS[i].lat,
    lng: GRID_POINTS[i].lng,
    aqi: r.status === "fulfilled" ? (r.value.aqi ?? null) : null,
  }));

  return NextResponse.json({ points }, {
    headers: { "Cache-Control": "public, s-maxage=1800" },
  });
}
