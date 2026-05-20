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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
