export interface FireHotspot {
  latitude: number;
  longitude: number;
  brightness: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
  satellite: string;
  confidence: number | string;
  version: string;
  bright_t31: number;
  frp: number;
  daynight: "D" | "N";
}

export interface FireIncident {
  id: string;
  name: string;
  state: string;
  county: string;
  latitude: number;
  longitude: number;
  acresBurned: number;
  containment: number;
  startDate: string;
  updatedDate: string;
  cause: string;
  injuries: number;
  fatalities: number;
  structuresDestroyed: number;
  structuresThreatened: number;
  status: "active" | "contained" | "controlled";
  perimeter?: GeoJSON.Geometry;
}

export interface AirQualityReading {
  stationId: string;
  stationName: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  aqi: number;
  category: string;
  parameter: string;
  value: number;
  unit: string;
}

export interface WeatherConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  precipitation: number;
  fireWeatherIndex: number;
}

export interface HistoricalFireEvent {
  year: number;
  name: string;
  state: string;
  acresBurned: number;
  structuresDestroyed: number;
  fatalities: number;
  estimatedDamage: number;
  cause: string;
  startDate: string;
  endDate: string;
  containment: number;
}

export type AIProvider = "openai" | "anthropic" | "google";

export interface DamageEstimate {
  propertyDamage: number;
  agriculturalDamage: number;
  infrastructureDamage: number;
  environmentalDamage: number;
  economicImpact: number;
  totalEstimate: number;
  confidence: "low" | "medium" | "high";
  methodology: string;
  inputs: DamageInputs;
}

export interface DamageInputs {
  acresBurned: number;
  structuresDestroyed: number;
  structuresThreatened: number;
  state: string;
  landType: LandType[];
  fireIntensity: "low" | "moderate" | "high" | "extreme";
  urbanProximity: number;
}

export type LandType =
  | "residential"
  | "commercial"
  | "agricultural"
  | "forest"
  | "grassland"
  | "wildland-urban";
