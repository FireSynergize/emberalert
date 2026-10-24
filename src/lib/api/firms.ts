import type { FireHotspot } from "@/types/fire";

const FIRMS_BASE = "https://firms.modaps.eosdis.nasa.gov/api";

export async function fetchFIRMSHotspots(
  mapKey: string,
  source: "VIIRS_SNPP_NRT" | "MODIS_NRT" | "VIIRS_NOAA20_NRT" = "VIIRS_SNPP_NRT",
  days: number = 1,
  region: string = "-165,18,-66,50"
): Promise<FireHotspot[]> {
  // FIRMS "days" counts UTC calendar days ending today, so days=1 is empty just
  // after UTC midnight. Fetch one extra day and trim to a rolling window.
  const url = `${FIRMS_BASE}/area/csv/${mapKey}/${source}/${region}/${Math.min(days + 1, 5)}`;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`FIRMS API error: ${res.status}`);

  const text = await res.text();
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",");
  const all = lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h.trim()] = values[i]?.trim() ?? ""; });
    return {
      latitude: parseFloat(obj.latitude),
      longitude: parseFloat(obj.longitude),
      brightness: parseFloat(obj.bright_ti4 ?? obj.brightness ?? "0"),
      scan: parseFloat(obj.scan ?? "0"),
      track: parseFloat(obj.track ?? "0"),
      acq_date: obj.acq_date,
      acq_time: obj.acq_time,
      satellite: obj.satellite,
      confidence: obj.confidence,
      version: obj.version,
      bright_t31: parseFloat(obj.bright_ti5 ?? obj.bright_t31 ?? "0"),
      frp: parseFloat(obj.frp ?? "0"),
      daynight: (obj.daynight ?? "D") as "D" | "N",
    };
  });

  return all.filter((h) => {
    const t = (h.acq_time ?? "").padStart(4, "0");
    const ts = Date.parse(`${h.acq_date}T${t.slice(0, 2)}:${t.slice(2)}:00Z`);
    return Number.isNaN(ts) || ts >= cutoff;
  });
}

export function hotspotsToGeoJSON(hotspots: FireHotspot[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: hotspots.map((h, i) => ({
      type: "Feature",
      id: i,
      geometry: {
        type: "Point",
        coordinates: [h.longitude, h.latitude],
      },
      properties: {
        brightness: h.brightness,
        frp: h.frp,
        confidence: h.confidence,
        acq_date: h.acq_date,
        acq_time: h.acq_time,
        satellite: h.satellite,
        daynight: h.daynight,
      },
    })),
  };
}

export async function fetchFIRMSStatus(mapKey: string): Promise<{
  transactionCount: number;
  transactionLimit: number;
}> {
  const url = `${FIRMS_BASE}/transaction/${mapKey}`;
  const res = await fetch(url);
  if (!res.ok) return { transactionCount: 0, transactionLimit: 5000 };
  const data = await res.json();
  return {
    transactionCount: data.current_transactions ?? 0,
    transactionLimit: data.transaction_limit ?? 5000,
  };
}
