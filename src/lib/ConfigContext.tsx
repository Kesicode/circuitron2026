"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { SITE_CONFIG as DEFAULT_CONFIG, RegState } from "./config";

export type SiteConfig = typeof DEFAULT_CONFIG;

interface ConfigContextProps {
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => Promise<void>;
  loading: boolean;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const ConfigContext = createContext<ConfigContextProps>({
  config: DEFAULT_CONFIG,
  updateConfig: async () => {},
  loading: true,
  theme: "dark",
  toggleTheme: () => {},
});

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
      document.documentElement.classList.remove(savedTheme === "dark" ? "light" : "dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.add(nextTheme);
    document.documentElement.classList.remove(theme);
  };

  useEffect(() => {
    const configDoc = doc(db, "config", "main");
    
    const unsubscribe = onSnapshot(configDoc, (docSnap) => {
      if (docSnap.exists()) {
        setConfig({ ...DEFAULT_CONFIG, ...docSnap.data() } as SiteConfig);
      } else {
        // Seed the initial config if it doesn't exist
        setDoc(configDoc, DEFAULT_CONFIG).catch(console.error);
      }
      setLoading(false);
    }, (err) => {
      console.error("Failed to load config:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateConfig = async (newConfig: Partial<SiteConfig>) => {
    try {
      const configDoc = doc(db, "config", "main");
      await setDoc(configDoc, newConfig, { merge: true });
    } catch (err) {
      console.error("Failed to update config:", err);
      throw err;
    }
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, loading, theme, toggleTheme }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(ConfigContext);

export const usePhaseTheme = () => {
  const { config } = useContext(ConfigContext);
  const now = new Date();
  const iDate = new Date(config.internshipDate);
  const hDate = new Date(config.hackathonDate);

  if (now >= hDate) return { color: "#a855f7", phase: 3 };
  if (now >= iDate) return { color: "#6366f1", phase: 2 };
  return { color: "#38bdf8", phase: 1 };
};
