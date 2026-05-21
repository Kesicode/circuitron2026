"use client";
import { useState, useEffect } from "react";
import CircuitBackground   from "@/components/CircuitBackground";
import LoadingScreen       from "@/components/LoadingScreen";
import Navbar              from "@/components/Navbar";
import HeroSection         from "@/components/HeroSection";

import Footer              from "@/components/Footer";
import NotifyPopup          from "@/components/NotifyPopup";

import { ConfigProvider } from "@/lib/ConfigContext";

// Module-level variable: resets on every full page reload/refresh,
// but persists during client-side navigation (e.g. back from /notify)
let hasLoadedOnce = false;

export default function Home() {
  // If already loaded via client-side nav, start as true (skip loader)
  const [loaded, setLoaded] = useState(hasLoadedOnce);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <ConfigProvider>
      <CircuitBackground />
      <LoadingScreen onComplete={() => {
        hasLoadedOnce = true;
        setLoaded(true);
        window.scrollTo(0, 0);
      }} />
      <div className={`transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}>
        <Navbar />
        <main>
          <HeroSection />

        </main>
        <Footer />
        <NotifyPopup />
      </div>
    </ConfigProvider>
  );
}
