"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { Layers, Satellite, Flame, Wind, Eye, EyeOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getAQICategory } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";

const DEMO_FIRE_INCIDENTS: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: 1,
      properties: { name: "Pine Ridge Fire", acres: 45230, containment: 35, state: "CA", cause: "Lightning", status: "active" },
      geometry: { type: "Point", coordinates: [-120.5443, 38.9171] },
    },
    {
      type: "Feature",
      id: 2,
      properties: { name: "Cascade Complex", acres: 128900, containment: 18, state: "OR", cause: "Lightning", status: "active" },
      geometry: { type: "Point", coordinates: [-122.1430, 43.8041] },
    },
    {
      type: "Feature",
      id: 3,
      properties: { name: "Dry Creek Fire", acres: 8700, containment: 75, state: "WA", cause: "Human", status: "active" },
      geometry: { type: "Point", coordinates: [-120.3020, 47.2529] },
    },
    {
      type: "Feature",
      id: 4,
      properties: { name: "Mesa Verde Fire", acres: 22400, containment: 50, state: "CO", cause: "Unknown", status: "active" },
      geometry: { type: "Point", coordinates: [-108.4920, 37.2309] },
    },
    {
      type: "Feature",
      id: 5,
      properties: { name: "High Desert Blaze", acres: 67000, containment: 5, state: "NM", cause: "Wind", status: "active" },
      geometry: { type: "Point", coordinates: [-106.6504, 35.0853] },
    },
  ],
};

const LAYERS = [
  { id: "fires", label: "Fire Hotspots", icon: Flame, color: "#ff4500" },
  { id: "aqi", label: "Air Quality", icon: Wind, color: "#4ade80" },
  { id: "perimeters", label: "Fire Perimeters", icon: Layers, color: "#fbbf24" },
];

interface FireMapProps {
  height?: string;
  showControls?: boolean;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export function FireMap({
  height = "100%",
  showControls = true,
  initialCenter = [-98.5795, 39.8283],
  initialZoom = 4,
}: FireMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(["fires"]));
  const [fireCount, setFireCount] = useState<number>(0);
  const [loadingFires, setLoadingFires] = useState(false);

  const toggleLayer = useCallback((layerId: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layerId)) next.delete(layerId);
      else next.add(layerId);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.warn("No Mapbox token — map disabled");
      return;
    }

    if (!mapboxgl.supported()) {
      setWebglError(true);
      return;
    }

    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    map.current.on("load", () => {
      const m = map.current!;

      m.addSource("demo-fires", { type: "geojson", data: DEMO_FIRE_INCIDENTS });
      m.addSource("nasa-fires", { type: "geojson", data: { type: "FeatureCollection", features: [] } });

      m.addLayer({
        id: "fire-heat",
        type: "heatmap",
        source: "nasa-fires",
        maxzoom: 9,
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["get", "frp"], 0, 0, 500, 1],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
          "heatmap-color": [
            "interpolate", ["linear"], ["heatmap-density"],
            0, "rgba(0,0,0,0)",
            0.1, "rgba(255,255,0,0.2)",
            0.3, "rgba(255,140,0,0.5)",
            0.6, "rgba(255,69,0,0.8)",
            1.0, "rgba(180,0,0,1)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 8, 9, 20],
          "heatmap-opacity": 0.85,
        },
      });

      m.addLayer({
        id: "fire-points",
        type: "circle",
        source: "nasa-fires",
        minzoom: 7,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["get", "frp"], 0, 4, 500, 14],
          "circle-color": ["interpolate", ["linear"], ["get", "frp"], 0, "#ffee00", 200, "#ff6600", 500, "#cc0000"],
          "circle-opacity": 0.9,
          "circle-stroke-width": 1,
          "circle-stroke-color": "rgba(255,255,255,0.3)",
        },
      });

      m.addLayer({
        id: "demo-fire-circles",
        type: "circle",
        source: "demo-fires",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["get", "acres"], 0, 8, 150000, 24],
          "circle-color": [
            "case",
            ["<", ["get", "containment"], 25], "#ff1500",
            ["<", ["get", "containment"], 60], "#ff6600",
            "#ffcc00",
          ],
          "circle-opacity": 0.9,
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255,255,255,0.5)",
        },
      });

      m.addLayer({
        id: "demo-fire-pulse",
        type: "circle",
        source: "demo-fires",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["get", "acres"], 0, 14, 150000, 36],
          "circle-color": "#ff4500",
          "circle-opacity": 0.25,
          "circle-stroke-width": 0,
        },
      });

      m.addLayer({
        id: "demo-fire-labels",
        type: "symbol",
        source: "demo-fires",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [0, 1.8],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#f5f0ea",
          "text-halo-color": "rgba(0,0,0,0.8)",
          "text-halo-width": 1.5,
        },
      });

      m.on("click", "demo-fire-circles", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const p = feature.properties as Record<string, unknown>;
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

        new mapboxgl.Popup({ closeButton: true, maxWidth: "260px" })
          .setLngLat(coords)
          .setHTML(`
            <div style="font-family: 'Space Grotesk', sans-serif; padding: 4px;">
              <div style="font-size: 14px; font-weight: 700; color: #ff7b35; margin-bottom: 8px;">🔥 ${p.name}</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                <div><span style="color: rgba(245,240,234,0.5)">State</span><br/><span style="color: #f5f0ea; font-weight: 600">${p.state}</span></div>
                <div><span style="color: rgba(245,240,234,0.5)">Acres</span><br/><span style="color: #f5f0ea; font-weight: 600">${Number(p.acres).toLocaleString()}</span></div>
                <div><span style="color: rgba(245,240,234,0.5)">Containment</span><br/><span style="color: ${Number(p.containment) < 25 ? "#ff4444" : Number(p.containment) < 60 ? "#ff9900" : "#4ade80"}; font-weight: 700">${p.containment}%</span></div>
                <div><span style="color: rgba(245,240,234,0.5)">Cause</span><br/><span style="color: #f5f0ea; font-weight: 600">${p.cause}</span></div>
              </div>
            </div>
          `)
          .addTo(m);
      });

      m.on("mouseenter", "demo-fire-circles", () => { m.getCanvas().style.cursor = "pointer"; });
      m.on("mouseleave", "demo-fire-circles", () => { m.getCanvas().style.cursor = ""; });

      setLoaded(true);
      loadNASAFires();
    });

    return () => { map.current?.remove(); map.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNASAFires = useCallback(async () => {
    setLoadingFires(true);
    try {
      const res = await fetch("/api/fires?days=1");
      const data = await res.json();
      if (data.geojson && map.current?.getSource("nasa-fires")) {
        (map.current.getSource("nasa-fires") as mapboxgl.GeoJSONSource).setData(data.geojson);
        setFireCount(data.count ?? 0);
      }
    } catch (e) {
      console.error("Failed to load NASA fires:", e);
    } finally {
      setLoadingFires(false);
    }
  }, []);

  useEffect(() => {
    if (!loaded || !map.current) return;
    const m = map.current;
    const fireLayerIds = ["fire-heat", "fire-points", "demo-fire-circles", "demo-fire-pulse", "demo-fire-labels"];
    fireLayerIds.forEach((id) => {
      if (m.getLayer(id)) {
        m.setLayoutProperty(id, "visibility", activeLayers.has("fires") ? "visible" : "none");
      }
    });
  }, [activeLayers, loaded]);

  return (
    <div className={height === "100%" ? "absolute inset-0" : "relative w-full"} style={height !== "100%" ? { height } : undefined}>
      {(!process.env.NEXT_PUBLIC_MAPBOX_TOKEN || webglError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111] rounded-lg border border-[#2e2e2e] z-10">
          <div className="text-center p-8">
            <Flame className="h-8 w-8 text-[#e84c1a] mx-auto mb-3" />
            <p className="text-[#e0e0e0] font-medium mb-1">{webglError ? "WebGL Required" : "Mapbox Token Required"}</p>
            <p className="text-[#666] text-sm">
              {webglError
                ? "Enable hardware acceleration in your browser settings."
                : "Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local"}
            </p>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />

      {showControls && loaded && (
        <>
          <div className="absolute top-3 left-3 bg-[rgba(20,20,20,0.9)] border border-[#2e2e2e] rounded p-2.5 space-y-1">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1.5">Layers</p>
            {LAYERS.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => toggleLayer(id)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 rounded text-xs w-full text-left transition-colors",
                  activeLayers.has(id) ? "text-[#e0e0e0]" : "text-[#555] hover:text-[#888]"
                )}
              >
                {activeLayers.has(id)
                  ? <Eye className="h-3 w-3" style={{ color }} />
                  : <EyeOff className="h-3 w-3" />
                }
                {label}
              </button>
            ))}
          </div>

          <div className="absolute top-3 right-12 bg-[rgba(20,20,20,0.9)] border border-[#2e2e2e] rounded px-2.5 py-1.5 flex items-center gap-1.5">
            <Satellite className="h-3 w-3 text-[#666]" />
            <span className="text-xs text-[#666]">Satellite</span>
          </div>

          <div className="absolute bottom-10 left-3 bg-[rgba(20,20,20,0.9)] border border-[#2e2e2e] rounded p-2.5">
            <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1.5">Intensity</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 rounded-full" style={{ background: "linear-gradient(90deg, #ffff00, #ff6600, #cc0000)" }} />
              <div className="flex justify-between w-20 text-[9px] text-[#555]">
                <span>Low</span><span>High</span>
              </div>
            </div>
          </div>

          {fireCount > 0 && (
            <Badge variant="fire" pulse className="absolute bottom-10 right-12">
              {fireCount.toLocaleString()} hotspots
            </Badge>
          )}

          <button
            onClick={loadNASAFires}
            disabled={loadingFires}
            className="absolute bottom-3 right-12 bg-[rgba(20,20,20,0.9)] border border-[#2e2e2e] rounded p-1.5 hover:border-[#444] transition-colors disabled:opacity-40"
            title="Refresh fire data"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 text-[#888]", loadingFires && "animate-spin")} />
          </button>
        </>
      )}
    </div>
  );
}
