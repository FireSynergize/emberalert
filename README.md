# EmberAlert

A wildfire awareness and preparedness dashboard for the United States. EmberAlert combines live satellite fire detections, air quality data, an AI assistant, and planning tools in one Next.js app.

## Features

- **Dashboard** – live stats from NASA FIRMS hotspots, air quality, and historical fires
- **Fire map** – interactive map of active fire detections (Mapbox GL / Leaflet)
- **Escape planner** – evacuation route planning
- **Damage calculator** – estimate wildfire damages and compare against historical fires
- **Relief resources** – assistance and recovery information
- **AI chatbot** – wildfire Q&A powered by Claude via the Vercel AI SDK

## Tech stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix UI, Recharts, Framer Motion, Zustand, Turf.js, Vercel AI SDK (`@ai-sdk/anthropic`, with OpenAI and Google providers installed).

## Getting started

### Prerequisites

- Node.js and [pnpm](https://pnpm.io)
- Optionally [Nix](https://nixos.org) – `flake.nix` provides a dev shell

### Setup

```bash
pnpm install
cp .env.local.example .env.local   # then fill in your keys
pnpm dev
```

Or, with Nix: `./dev.sh` (runs `pnpm dev` inside `nix develop`).

The app runs at http://localhost:3000.

### Environment variables

| Variable | Purpose | Where to get it |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Chatbot (currently the active provider) | https://console.anthropic.com |
| `OPENAI_API_KEY`, `GOOGLE_AI_API_KEY` | Optional alternate AI providers | – |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Map rendering | https://account.mapbox.com |
| `FIRMS_MAP_KEY` | NASA FIRMS fire hotspots | https://firms.modaps.eosdis.nasa.gov/api/map_key/ |
| `AIRNOW_API_KEY` | AirNow air quality | https://docs.airnowapi.org/account/request/ |
| `XWEATHER_CLIENT_ID`, `XWEATHER_CLIENT_SECRET` | Optional weather data | https://www.xweather.com/docs/weather-api |

Open-Meteo is used as a free, keyless air quality source.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

## Project structure

```
src/
  app/          Pages (dashboard, map, escape, damages, relief) and API routes
    api/        air-quality, aqi-grid, chat, damages, fire-stats, fires
  components/   chat, damages, dashboard, escape, layout, map, relief, ui
  lib/
    ai/         Model provider and chatbot system prompt
    api/        FIRMS, AirNow, and Open-Meteo clients
    utils/      Damage calculator, helpers
  types/        Shared TypeScript types
public/         Static assets (US land GeoJSON)
```

## Data sources

- [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov) – satellite fire detections (VIIRS / MODIS)
- [AirNow](https://www.airnow.gov) – U.S. air quality observations
- [Open-Meteo](https://open-meteo.com) – air quality forecasts and fallback data
