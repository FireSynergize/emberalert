import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function formatAcres(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M acres`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K acres`;
  return `${n.toFixed(0)} acres`;
}

export function getAQICategory(aqi: number): {
  label: string;
  color: string;
  bg: string;
  description: string;
} {
  if (aqi <= 50)
    return {
      label: "Good",
      color: "#00e400",
      bg: "rgba(0,228,0,0.1)",
      description: "Air quality is satisfactory",
    };
  if (aqi <= 100)
    return {
      label: "Moderate",
      color: "#ffff00",
      bg: "rgba(255,255,0,0.1)",
      description: "Acceptable air quality",
    };
  if (aqi <= 150)
    return {
      label: "Unhealthy for Sensitive Groups",
      color: "#ff7e00",
      bg: "rgba(255,126,0,0.1)",
      description: "Sensitive groups may experience health effects",
    };
  if (aqi <= 200)
    return {
      label: "Unhealthy",
      color: "#ff0000",
      bg: "rgba(255,0,0,0.1)",
      description: "Everyone may experience health effects",
    };
  if (aqi <= 300)
    return {
      label: "Very Unhealthy",
      color: "#8f3f97",
      bg: "rgba(143,63,151,0.1)",
      description: "Health warnings of emergency conditions",
    };
  return {
    label: "Hazardous",
    color: "#7e0023",
    bg: "rgba(126,0,35,0.15)",
    description: "Health alert: everyone is affected",
  };
}

export function getFireSeverity(frp: number): "low" | "moderate" | "high" | "extreme" {
  if (frp < 50) return "low";
  if (frp < 200) return "moderate";
  if (frp < 500) return "high";
  return "extreme";
}

export function getContainmentColor(pct: number): string {
  if (pct >= 100) return "#00e400";
  if (pct >= 75) return "#7ed321";
  if (pct >= 50) return "#f5a623";
  if (pct >= 25) return "#ff7e00";
  return "#ff4500";
}
