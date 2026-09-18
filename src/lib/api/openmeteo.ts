export interface AirQualityData {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    pm2_5: (number | null)[];
    pm10: (number | null)[];
    us_aqi: (number | null)[];
    us_aqi_pm2_5: (number | null)[];
    carbon_monoxide: (number | null)[];
    nitrogen_dioxide: (number | null)[];
    ozone: (number | null)[];
    dust: (number | null)[];
  };
}

export async function fetchAirQuality(
  lat: number,
  lon: number,
  days: number = 2
): Promise<AirQualityData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    hourly: "pm2_5,pm10,us_aqi,us_aqi_pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,dust",
    forecast_days: days.toString(),
    timezone: "America/New_York",
  });

  const res = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${params}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`Open-Meteo AQ error: ${res.status}`);
  return res.json();
}

export async function fetchCurrentAQI(lat: number, lon: number): Promise<{
  aqi: number | null;
  pm25: number | null;
  pm10: number | null;
  category: string;
}> {
  const data = await fetchAirQuality(lat, lon, 1);
  const now = new Date();
  const hourIndex = data.hourly.time.findIndex((t) => {
    const d = new Date(t);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate() &&
      d.getHours() === now.getHours()
    );
  });

  const idx = hourIndex >= 0 ? hourIndex : data.hourly.time.length - 1;
  const aqi = data.hourly.us_aqi[idx] ?? null;

  return {
    aqi,
    pm25: data.hourly.pm2_5[idx] ?? null,
    pm10: data.hourly.pm10[idx] ?? null,
    category: getAQILabel(aqi ?? 0),
  };
}

function getAQILabel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}
