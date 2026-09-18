import type { AirQualityReading } from "@/types/fire";

const AIRNOW_BASE = "https://www.airnowapi.org/aq";

export async function fetchAirNowObservations(
  apiKey: string,
  lat: number,
  lon: number,
  date?: string
): Promise<AirQualityReading[]> {
  const params = new URLSearchParams({
    format: "application/json",
    latitude: lat.toString(),
    longitude: lon.toString(),
    distance: "25",
    API_KEY: apiKey,
  });

  const endpoint = date
    ? `${AIRNOW_BASE}/history/latLong/`
    : `${AIRNOW_BASE}/observation/latLong/current/`;

  if (date) params.set("date", date);

  const res = await fetch(`${endpoint}?${params}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`AirNow API error: ${res.status}`);

  const data = await res.json();
  return data.map((d: Record<string, unknown>) => ({
    stationId: String(d.ReportingArea ?? ""),
    stationName: String(d.ReportingArea ?? ""),
    latitude: Number(d.Latitude ?? lat),
    longitude: Number(d.Longitude ?? lon),
    dateTime: String(d.DateObserved ?? ""),
    aqi: Number(d.AQI ?? 0),
    category: String((d.Category as Record<string, unknown>)?.Name ?? ""),
    parameter: String(d.ParameterName ?? ""),
    value: Number(d.AQI ?? 0),
    unit: "AQI",
  }));
}

export async function fetchAirNowForecasts(
  apiKey: string,
  lat: number,
  lon: number,
  date: string
): Promise<AirQualityReading[]> {
  const params = new URLSearchParams({
    format: "application/json",
    latitude: lat.toString(),
    longitude: lon.toString(),
    distance: "25",
    date,
    API_KEY: apiKey,
  });

  const res = await fetch(
    `${AIRNOW_BASE}/forecast/latLong/?${params}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`AirNow forecast error: ${res.status}`);
  return res.json();
}
