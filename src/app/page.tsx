"use client";
import { useState, useEffect } from "react";
import CircuitBackground   from "@/components/CircuitBackground";
import LoadingScreen       from "@/components/LoadingScreen";
import Navbar              from "@/components/Navbar";
import HeroSection         from "@/components/HeroSection";

import Footer              from "@/components/Footer";
import NotifyPopup          from "@/components/NotifyPopup";

import { ConfigProvider } from "@/lib/ConfigContext";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (sessionStorage.getItem("circuitron_loaded") === "true") {
      setLoaded(true);
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <ConfigProvider>
      <CircuitBackground />
      <LoadingScreen onComplete={() => {
        setLoaded(true);
        sessionStorage.setItem("circuitron_loaded", "true");
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
