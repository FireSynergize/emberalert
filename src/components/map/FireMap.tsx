"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import type L from "leaflet";
import { Flame, Wind, Eye, EyeOff, RefreshCw, Layers } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";

const ESRI_SATELLITE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_LABELS =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTR =
  "Tiles &copy; <a href='https://www.esri.com/'>Esri</a> &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community";

// ~40 points spread across CONUS for IDW interpolation
const AQI_SAMPLE_POINTS = [
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

function aqiToRGBA(aqi: number): [number, number, number, number] {
  const v = Math.max(0, Math.min(500, aqi));

  // Good (0-50): subtle green tint at low opacity so it reads as "fine"
  if (v <= 50) {
    return [34, 197, 94, 75];
  }

  // Moderate and above: vivid colors at high opacity so they clearly pop
  const stops: [number, [number, number, number]][] = [
    [50,  [234, 210,   0]],  // bright yellow
    [100, [249, 130,   0]],  // amber-orange
    [150, [239,  60,  30]],  // orange-red
    [200, [210,  30,  30]],  // red
    [300, [168,  85, 247]],  // purple
    [500, [159,  18,  57]],  // maroon
  ];
  let rgb: [number, number, number] = [159, 18, 57];
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i], [b, cb] = stops[i + 1];
    if (v <= b) {
      const t = (v - a) / (b - a);
      rgb = [
        Math.round(ca[0] + t * (cb[0] - ca[0])),
        Math.round(ca[1] + t * (cb[1] - ca[1])),
        Math.round(ca[2] + t * (cb[2] - ca[2])),
      ];
      break;
    }
  }
  return [...rgb, 210];
}

const DEMO_FIRES = [
  { name: "Pine Ridge Fire", acres: 45230, containment: 35, state: "CA", cause: "Lightning", lat: 38.9171, lng: -120.5443 },
  { name: "Cascade Complex", acres: 128900, containment: 18, state: "OR", cause: "Lightning", lat: 43.8041, lng: -122.143 },
  { name: "Dry Creek Fire", acres: 8700, containment: 75, state: "WA", cause: "Human", lat: 47.2529, lng: -120.302 },
  { name: "Mesa Verde Fire", acres: 22400, containment: 50, state: "CO", cause: "Unknown", lat: 37.2309, lng: -108.492 },
  { name: "High Desert Blaze", acres: 67000, containment: 5, state: "NM", cause: "Wind", lat: 35.0853, lng: -106.6504 },
];

const LAYER_DEFS = [
  { id: "fires", label: "Fire Hotspots", icon: Flame, color: "#ff4500" },
  { id: "labels", label: "Place Labels", icon: Layers, color: "#4ade80" },
  { id: "wind", label: "Air Quality", icon: Wind, color: "#fbbf24" },
];

function containmentColor(pct: number) {
  if (pct < 25) return "#ff1500";
  if (pct < 60) return "#ff6600";
  return "#ffcc00";
}

function frpColor(frp: number) {
  if (frp > 200) return "#cc0000";
  if (frp > 50) return "#ff6600";
  return "#ffee00";
}

interface FireMapProps {
  height?: string;
  showControls?: boolean;
  initialCenter?: [number, number]; // [lng, lat] for API compat
  initialZoom?: number;
}

export function FireMap({
  height = "100%",
  showControls = true,
  initialCenter = [-98.5795, 39.8283],
  initialZoom = 4,
}: FireMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const firesLayerRef = useRef<L.LayerGroup | null>(null);
  const nasaLayerRef = useRef<L.LayerGroup | null>(null);
  const labelsTileRef = useRef<L.TileLayer | null>(null);
  const aqiLayerRef = useRef<L.Layer | null>(null);
  const aqiLookupRef = useRef<((lat: number, lng: number) => number) | null>(null);
  const aqiTooltipRef = useRef<HTMLDivElement | null>(null);
  const [aqiLoaded, setAqiLoaded] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(["fires", "labels"]));
  const [fireCount, setFireCount] = useState(0);
  const [loadingFires, setLoadingFires] = useState(false);

  const toggleLayer = useCallback((id: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const loadAQILayer = useCallback(async () => {
    if (!mapRef.current || !containerRef.current) return;
    const { default: L } = await import("leaflet");
    const map = mapRef.current;

    const res = await fetch("/api/aqi-grid");
    const { points } = await res.json() as { points: { lat: number; lng: number; aqi: number | null }[] };
    const samples = points.filter((p) => p.aqi != null) as { lat: number; lng: number; aqi: number }[];
    if (samples.length === 0) return;

    // Pre-compute IDW grid for all of CONUS — no distance cutoff
    const GRID_W = 256, GRID_H = 128;
    const LAT_MIN = 24, LAT_MAX = 50, LNG_MIN = -125, LNG_MAX = -66;
    const grid = new Float32Array(GRID_W * GRID_H);
    for (let gy = 0; gy < GRID_H; gy++) {
      const lat = LAT_MAX - (gy / GRID_H) * (LAT_MAX - LAT_MIN);
      const cosLat = Math.cos((lat * Math.PI) / 180);
      for (let gx = 0; gx < GRID_W; gx++) {
        const lng = LNG_MIN + (gx / GRID_W) * (LNG_MAX - LNG_MIN);
        let wSum = 0, aqiSum = 0;
        for (const s of samples) {
          const dlat = lat - s.lat, dlng = (lng - s.lng) * cosLat;
          const d2 = dlat * dlat + dlng * dlng;
          const w = d2 < 1e-6 ? 1e9 : 1 / d2;
          wSum += w; aqiSum += w * s.aqi;
        }
        grid[gy * GRID_W + gx] = aqiSum / wSum;
      }
    }

    const bilinear = (gx: number, gy: number): number => {
      const x0 = Math.floor(gx), x1 = Math.min(x0 + 1, GRID_W - 1);
      const y0 = Math.floor(gy), y1 = Math.min(y0 + 1, GRID_H - 1);
      const tx = gx - x0, ty = gy - y0;
      return (1-tx)*(1-ty)*grid[y0*GRID_W+x0] + tx*(1-ty)*grid[y0*GRID_W+x1] +
             (1-tx)*ty*grid[y1*GRID_W+x0] + tx*ty*grid[y1*GRID_W+x1];
    };

    // Load simplified CONUS land polygon for masking ocean areas
    const landPoly: [number, number][] = await fetch("/us-land.json").then((r) => r.json());

    const inLand = (lng: number, lat: number): boolean => {
      let inside = false;
      const n = landPoly.length;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const [xi, yi] = landPoly[i], [xj, yj] = landPoly[j];
        if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
          inside = !inside;
        }
      }
      return inside;
    };

    const lookupAQI = (lat: number, lng: number): number => {
      if (lat < LAT_MIN || lat > LAT_MAX || lng < LNG_MIN || lng > LNG_MAX) return -1;
      if (!inLand(lng, lat)) return -1;
      return bilinear(
        ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (GRID_W - 1),
        ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (GRID_H - 1)
      );
    };
    aqiLookupRef.current = lookupAQI;

    // Render full CONUS AQI image, then mask to land using destination-in compositing
    const W = 640, H = 352;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
      const lat = LAT_MAX - (y / H) * (LAT_MAX - LAT_MIN);
      for (let x = 0; x < W; x++) {
        const lng = LNG_MIN + (x / W) * (LNG_MAX - LNG_MIN);
        const aqi = bilinear(
          ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (GRID_W - 1),
          ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (GRID_H - 1)
        );
        const [r, g2, b, a] = aqiToRGBA(aqi);
        const p = (y * W + x) * 4;
        img.data[p] = r; img.data[p+1] = g2; img.data[p+2] = b; img.data[p+3] = a;
      }
    }
    ctx.putImageData(img, 0, 0);

    // Clip AQI image to the land polygon — erases ocean pixels
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    for (let i = 0; i < landPoly.length; i++) {
      const [lng, lat] = landPoly[i];
      const px = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
      const py = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    if (aqiLayerRef.current) map.removeLayer(aqiLayerRef.current);
    const overlay = L.imageOverlay(
      canvas.toDataURL(),
      [[LAT_MIN, LNG_MIN], [LAT_MAX, LNG_MAX]],
      { opacity: 1, interactive: false, zIndex: 200 }
    );
    // CSS blur blends any remaining hard edges and softens the overall boundary
    overlay.on("add", () => {
      const el = overlay.getElement();
      if (el) el.style.filter = "blur(10px)";
    });
    aqiLayerRef.current = overlay;

    // Tooltip div — positioned in map container, updated on mousemove
    if (!aqiTooltipRef.current) {
      const tip = document.createElement("div");
      tip.style.cssText = "position:absolute;pointer-events:none;z-index:1001;display:none;background:rgba(20,20,20,0.92);border:1px solid #2e2e2e;border-radius:8px;padding:8px 12px;color:#e0e0e0;font-family:system-ui,sans-serif;font-size:12px;min-width:150px;box-shadow:0 4px 16px rgba(0,0,0,0.5);";
      containerRef.current.appendChild(tip);
      aqiTooltipRef.current = tip;
    }
    const tip = aqiTooltipRef.current;

    const aqiLabel = (v: number) =>
      v <= 50 ? "Good" : v <= 100 ? "Moderate" : v <= 150 ? "Unhealthy for Sensitive Groups" : v <= 200 ? "Unhealthy" : v <= 300 ? "Very Unhealthy" : "Hazardous";
    const aqiGuidance = (v: number) =>
      v <= 50 ? "Air quality is satisfactory with little or no risk." :
      v <= 100 ? "Unusually sensitive people should consider reducing prolonged outdoor exertion." :
      v <= 150 ? "Sensitive groups should limit prolonged outdoor exertion." :
      v <= 200 ? "Everyone may begin to experience health effects." :
      v <= 300 ? "Health alert — everyone may experience serious effects." :
      "Health warning of emergency conditions.";

    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      if (!aqiLayerRef.current || !map.hasLayer(aqiLayerRef.current) || !aqiLookupRef.current) {
        tip.style.display = "none"; return;
      }
      const aqi = aqiLookupRef.current(e.latlng.lat, e.latlng.lng);
      if (aqi < 0) { tip.style.display = "none"; return; }

      const [r, g, b] = aqiToRGBA(aqi);
      const color = `rgb(${r},${g},${b})`;
      tip.innerHTML = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px"><div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0"></div><span style="font-weight:700;font-size:14px;color:${color}">${Math.round(aqi)} AQI</span></div><div style="font-weight:600;color:#e0e0e0;margin-bottom:3px;font-size:11px">${aqiLabel(aqi)}</div><div style="color:#888;font-size:10px;line-height:1.4">${aqiGuidance(aqi)}</div>`;

      const pt = map.latLngToContainerPoint(e.latlng);
      const cw = containerRef.current!.offsetWidth;
      const tipW = 160;
      const left = pt.x + 14 + tipW > cw ? pt.x - tipW - 14 : pt.x + 14;
      tip.style.left = `${left}px`;
      tip.style.top = `${pt.y - 20}px`;
      tip.style.display = "block";
    });

    map.on("mouseout", () => { tip.style.display = "none"; });

    setAqiLoaded(true);
  }, []);

  const loadNASAFires = useCallback(async () => {
    if (!nasaLayerRef.current) return;
    setLoadingFires(true);
    try {
      const res = await fetch("/api/fires?days=1");
      const data = await res.json();
      if (data.geojson && nasaLayerRef.current) {
        const { default: L } = await import("leaflet");
        nasaLayerRef.current.clearLayers();
        L.geoJSON(data.geojson as GeoJSON.FeatureCollection, {
          pointToLayer: (feature, latlng) => {
            const p = feature.properties ?? {};
            const frp: number = p.frp ?? 0;
            const intensity = frp > 1000 ? "Extreme" : frp > 300 ? "High" : frp > 50 ? "Moderate" : "Low";
            const intensityColor = frp > 1000 ? "#ef4444" : frp > 300 ? "#f97316" : frp > 50 ? "#eab308" : "#22c55e";
            const acqTime = p.acq_time ? `${String(p.acq_time).padStart(4,"0").slice(0,2)}:${String(p.acq_time).padStart(4,"0").slice(2)} UTC` : "—";
            return L.circleMarker(latlng, {
              radius: Math.max(4, Math.min(14, frp / 25)),
              color: "rgba(255,255,255,0.25)",
              weight: 1,
              fillColor: frpColor(frp),
              fillOpacity: 0.85,
            }).bindPopup(
              `<div style="font-family:system-ui,sans-serif;padding:4px;min-width:200px">
                <div style="font-size:13px;font-weight:700;color:#ff7b35;margin-bottom:8px">🛰 NASA FIRMS Hotspot</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px">
                  <div><span style="color:#888;display:block;font-size:10px;margin-bottom:2px">FRP</span><b style="color:#e0e0e0">${frp.toFixed(0)} MW</b></div>
                  <div><span style="color:#888;display:block;font-size:10px;margin-bottom:2px">Intensity</span><b style="color:${intensityColor}">${intensity}</b></div>
                  <div><span style="color:#888;display:block;font-size:10px;margin-bottom:2px">Confidence</span><b style="color:#e0e0e0">${p.confidence ?? "—"}</b></div>
                  <div><span style="color:#888;display:block;font-size:10px;margin-bottom:2px">Satellite</span><b style="color:#e0e0e0">${p.satellite ?? "—"}</b></div>
                  <div><span style="color:#888;display:block;font-size:10px;margin-bottom:2px">Date</span><b style="color:#e0e0e0">${p.acq_date ?? "—"}</b></div>
                  <div><span style="color:#888;display:block;font-size:10px;margin-bottom:2px">Time</span><b style="color:#e0e0e0">${acqTime}</b></div>
                </div>
              </div>`,
              { maxWidth: 260 }
            );
          },
        }).addTo(nasaLayerRef.current);
        setFireCount(data.count ?? 0);
      }
    } catch (e) {
      console.error("Failed to load NASA fires:", e);
    } finally {
      setLoadingFires(false);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    (async () => {
      const { default: L } = await import("leaflet");
      if (!containerRef.current || mapRef.current) return;

      const [lat, lng] = [initialCenter[1], initialCenter[0]];

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
      });
      mapRef.current = map;

      // Esri satellite base layer
      L.tileLayer(ESRI_SATELLITE, { maxZoom: 19, attribution: ESRI_ATTR }).addTo(map);

      // Labels overlay (toggleable)
      const labelsLayer = L.tileLayer(ESRI_LABELS, { maxZoom: 19, opacity: 0.85 });
      labelsLayer.addTo(map);
      labelsTileRef.current = labelsLayer;

      // Zoom + attribution controls
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.attribution({ position: "bottomright", prefix: "" }).addTo(map);

      // Demo fire incidents layer
      const firesLayer = L.layerGroup();
      DEMO_FIRES.forEach((fire) => {
        const color = containmentColor(fire.containment);
        const r = Math.max(8, Math.min(22, Math.sqrt(fire.acres) / 18));

        // outer pulse ring
        L.circleMarker([fire.lat, fire.lng], {
          radius: r * 1.7,
          color: "transparent",
          fillColor: color,
          fillOpacity: 0.18,
          interactive: false,
        }).addTo(firesLayer);

        // main marker
        L.circleMarker([fire.lat, fire.lng], {
          radius: r,
          color: "rgba(255,255,255,0.45)",
          weight: 1.5,
          fillColor: color,
          fillOpacity: 0.88,
        })
          .bindPopup(
            `<div style="font-family:system-ui,sans-serif;padding:4px;min-width:190px">
              <div style="font-size:13px;font-weight:700;color:#ff7b35;margin-bottom:8px">🔥 ${fire.name}</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px">
                <div><span style="color:#888;display:block;font-size:10px;margin-bottom:2px">State</span><b style="color:#e0e0e0">${fire.state}</b></div>
                <div><span style="color:#888;display:block;font-size:10px;margin-bottom:2px">Acres</span><b style="color:#e0e0e0">${fire.acres.toLocaleString()}</b></div>
                <div><span style="color:#888;display:block;font-size:10px;margin-bottom:2px">Containment</span><b style="color:${color}">${fire.containment}%</b></div>
                <div><span style="color:#888;display:block;font-size:10px;margin-bottom:2px">Cause</span><b style="color:#e0e0e0">${fire.cause}</b></div>
              </div>
            </div>`,
            { maxWidth: 260 }
          )
          .addTo(firesLayer);
      });
      firesLayer.addTo(map);
      firesLayerRef.current = firesLayer;

      // NASA FIRMS layer (filled by loadNASAFires)
      const nasaLayer = L.layerGroup();
      nasaLayer.addTo(map);
      nasaLayerRef.current = nasaLayer;


      setLoaded(true);
      // Force Leaflet to recalculate container size after async init + layout settle
      setTimeout(() => map.invalidateSize(), 100);
    })();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      firesLayerRef.current = null;
      nasaLayerRef.current = null;
      labelsTileRef.current = null;
      aqiLayerRef.current = null;
      aqiLookupRef.current = null;
      if (aqiTooltipRef.current) { aqiTooltipRef.current.remove(); aqiTooltipRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load NASA fires + AQI data once map is ready
  useEffect(() => {
    if (loaded) {
      loadNASAFires();
      loadAQILayer();
    }
  }, [loaded, loadNASAFires, loadAQILayer]);

  // Sync layer visibility
  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    const map = mapRef.current;

    if (firesLayerRef.current) {
      activeLayers.has("fires")
        ? map.addLayer(firesLayerRef.current)
        : map.removeLayer(firesLayerRef.current);
    }
    if (nasaLayerRef.current) {
      activeLayers.has("fires")
        ? map.addLayer(nasaLayerRef.current)
        : map.removeLayer(nasaLayerRef.current);
    }
    if (labelsTileRef.current) {
      activeLayers.has("labels")
        ? map.addLayer(labelsTileRef.current)
        : map.removeLayer(labelsTileRef.current);
    }
    if (aqiLayerRef.current) {
      activeLayers.has("wind")
        ? map.addLayer(aqiLayerRef.current)
        : map.removeLayer(aqiLayerRef.current);
    }
  }, [activeLayers, loaded, aqiLoaded]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden" />

      {showControls && loaded && (
        <>
          {/* Layer toggle panel */}
          <div className="absolute top-4 left-4 z-[1000] glass-smoke rounded-xl p-3 border border-[rgba(255,69,0,0.15)] space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[rgba(245,240,234,0.4)] mb-2">Layers</p>
            {LAYER_DEFS.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => toggleLayer(id)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium w-full text-left transition-all",
                  activeLayers.has(id)
                    ? "text-[#f5f0ea]"
                    : "text-[rgba(245,240,234,0.35)] hover:text-[rgba(245,240,234,0.6)]"
                )}
                style={{ background: activeLayers.has(id) ? `${color}18` : "transparent" }}
              >
                {activeLayers.has(id)
                  ? <Eye className="h-3.5 w-3.5" style={{ color }} />
                  : <EyeOff className="h-3.5 w-3.5 opacity-40" />}
                {label}
              </button>
            ))}
          </div>

          {/* Intensity legend */}
          <div className="absolute bottom-12 left-4 z-[1000] glass-smoke rounded-xl p-3 border border-[rgba(255,69,0,0.15)]">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-3.5 w-3.5 text-[#ff4500]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[rgba(245,240,234,0.4)]">Intensity Scale</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-2 w-28 rounded-full" style={{ background: "linear-gradient(90deg, #ffff00, #ff6600, #cc0000)" }} />
              <div className="flex justify-between w-28 text-[9px] text-[rgba(245,240,234,0.4)]">
                <span>Low</span><span>High</span>
              </div>
            </div>
          </div>

          {/* NASA hotspot count */}
          {fireCount > 0 && (
            <Badge variant="fire" pulse className="absolute bottom-12 right-4 z-[1000] cursor-pointer" onClick={loadNASAFires}>
              {fireCount.toLocaleString()} NASA hotspots
            </Badge>
          )}

          {/* Refresh button */}
          <button
            onClick={loadNASAFires}
            disabled={loadingFires}
            className="absolute bottom-4 right-4 z-[1000] glass-smoke rounded-lg p-2 border border-[rgba(255,69,0,0.15)] hover:border-[rgba(255,69,0,0.4)] transition-colors disabled:opacity-50"
            title="Refresh fire data"
          >
            <RefreshCw className={cn("h-4 w-4 text-[rgba(245,240,234,0.6)]", loadingFires && "animate-spin")} />
          </button>
        </>
      )}
    </div>
  );
}
