import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FireSynergize — Wildfire Intelligence Platform",
  description:
    "Real-time wildfire damage assessment, escape route planning, and AI-powered safety guidance for the United States.",
  keywords: ["wildfire", "fire safety", "damage assessment", "evacuation routes", "air quality"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-fire-gradient min-h-screen">{children}</body>
    </html>
  );
}
