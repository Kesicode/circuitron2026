import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Circuitron — Embedded Systems Innovation Ecosystem",
  description: "A Bootcamp focused on Embedded Systems, IoT, and Intelligent Devices, designed to foster innovation and industry-ready skills by IEEE IAS & IEEE RAS.",
  keywords: ["Circuitron","IEEE","embedded systems","IoT","Arduino","ESP32","Raspberry Pi","hackathon","bootcamp"],
  openGraph: {
    title: "Circuitron — Embedded Systems Innovation Ecosystem",
    description: "A Bootcamp focused on Embedded Systems, IoT, and Intelligent Devices, designed to foster innovation and industry-ready skills.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* DNS pre-connect — tells browser to establish connection early */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Single font request (was duplicated in globals.css @import AND here).
          display=optional tells browser to use a fallback if font isn't cached,
          eliminating layout shift from font-swap flicker on repeat visits.
          We include 'display=swap' for first-time visitors so text shows immediately.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Viewport meta — already set by Next.js but explicit is safer */}
        <meta name="theme-color" content="#060912" />
      </head>
      <body>
        {/* Film grain — hidden on mobile via CSS, no JS cost */}
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
