"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { usePhaseTheme } from "@/lib/ConfigContext";

// Pre-compute epoch timestamps once — avoids Date parsing on every render
const REG_START = 1779733800000; // 2026-05-26T00:00:00+05:30
const REG_END   = 1780165799000; // 2026-05-30T23:59:59+05:30

function getButtonText(now: number): string | null {
  if (now < REG_START)  return "PRE-REGISTER";
  if (now <= REG_END)   return "REGISTER NOW";
  return null;
}

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [buttonText, setButtonText] = useState<string | null>(null);
  const { color }   = usePhaseTheme();
  const pathname    = usePathname();
  const isNotifyPage = pathname === "/notify";
  const rafRef      = useRef<number>(0);
  const lastSecRef  = useRef<number>(0);

  // RAF-driven button state — replaces setInterval(fn, 1000)
  // Only re-renders when the second boundary crosses AND the state actually changes
  const rafLoop = useCallback(() => {
    const now = Date.now();
    const sec = Math.floor(now / 1000);
    if (sec !== lastSecRef.current) {
      lastSecRef.current = sec;
      const next = getButtonText(now);
      setButtonText(prev => prev === next ? prev : next);
    }
    rafRef.current = requestAnimationFrame(rafLoop);
  }, []);

  useEffect(() => {
    // Set initial value synchronously to prevent SSR/client mismatch flicker
    setButtonText(getButtonText(Date.now()));
    rafRef.current = requestAnimationFrame(rafLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rafLoop]);

  // Scroll handler — passive listener, no RAF needed (browser already batches scroll events)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (!isNotifyPage) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const handleAboutClick = (e: React.MouseEvent) => {
    if (!isNotifyPage) { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }
  };
  const handleGuidelinesClick = (e: React.MouseEvent) => {
    if (!isNotifyPage) { e.preventDefault(); window.dispatchEvent(new CustomEvent("show-guidelines")); }
  };
  const handleContactClick = (e: React.MouseEvent) => {
    if (!isNotifyPage) { e.preventDefault(); document.getElementById("connect")?.scrollIntoView({ behavior: "smooth" }); }
  };
  const handleRegisterClick = (e: React.MouseEvent) => {
    if (pathname === "/") { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-pre-register")); }
  };

  const bg   = scrolled ? "rgba(6,9,18,.90)" : "transparent";
  const blur = scrolled ? "blur(22px)" : "none";
  const bdr  = scrolled ? "1px solid rgba(255,255,255,.07)" : "1px solid transparent";

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: bg, backdropFilter: blur, WebkitBackdropFilter: blur, borderBottom: bdr, transition: "background .35s, border-color .35s" }}
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .65, delay: .1, ease: [.16, 1, .3, 1] }}
    >
      <div className="cc-container px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo on Left */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
            className="flex items-center gap-1 cursor-pointer hover:opacity-90 active:scale-95 transition-transform text-left outline-none border-none bg-transparent"
          >
            <Logo size={44} />
            <span className="font-rostex text-sm font-bold tracking-widest hidden min-[480px]:inline-block"
              style={{
                ["--active-color" as any]: color,
                ["--active-color-dim" as any]: `${color}2e`
              }}>
              <span className="selection-swap-white" style={{ color: "#e2e8f0" }}>CIRCUIT</span>
              <span className="selection-swap-cyan" style={{ color }}>RON</span>
            </span>
          </a>

          {/* Navigation Links on Right */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" onClick={handleHomeClick} className="hidden sm:block font-orbitron text-[10px] min-[480px]:text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 hover:text-white transition-colors">HOME</Link>
            <Link href="/#about" onClick={handleAboutClick} className="hidden sm:block font-orbitron text-[10px] min-[480px]:text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 hover:text-white transition-colors">ABOUT</Link>
            <Link href="/#guidelines" onClick={handleGuidelinesClick} className="hidden sm:block font-orbitron text-[10px] min-[480px]:text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 hover:text-white transition-colors">GUIDELINES</Link>
            <Link href="/#connect" onClick={handleContactClick} className="hidden sm:block font-orbitron text-[10px] min-[480px]:text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 hover:text-white transition-colors">CONTACT</Link>
            {buttonText && (
              <Link
                href="/notify"
                onClick={handleRegisterClick}
                className="font-orbitron text-[10px] sm:text-[11px] font-bold tracking-wider px-3 min-[480px]:px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full uppercase text-slate-950 hover:scale-[1.03] active:scale-[0.98] transition-transform whitespace-nowrap"
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, ${color} 100%)`,
                  boxShadow: `0 0 15px -3px ${color}50`
                }}
              >
                {buttonText}
              </Link>
            )}
          </div>

        </div>
      </div>
    </motion.nav>
  );
}
