"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, User, Check, AlertCircle } from "lucide-react";
import { usePhaseTheme } from "@/lib/ConfigContext";
import { submitNotification } from "@/lib/notifyAction";

// In-memory flags: reset on page refresh, stay set during client-side navigation
let notifyDismissed = false;
let notifySubmitted = false;

export default function NotifyPopup({ loaded = true }: { loaded?: boolean }) {
  const { color } = usePhaseTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollTriggered, setScrollTriggered] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loaded) return;

    // Skip if dismissed or submitted during this page lifecycle (resets on refresh)
    if (notifyDismissed || notifySubmitted) return;

    let isReady = false;
    const timer = setTimeout(() => {
      isReady = true;
    }, 600); // 600ms buffer to let scroll restoration and loading transition settle

    const handleScroll = () => {
      if (isReady && window.scrollY > 80 && !scrollTriggered) {
        setScrollTriggered(true);
        setIsOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollTriggered, loaded]);

  const handleClose = () => {
    setIsOpen(false);
    notifyDismissed = true; // Stay dismissed for rest of this page lifecycle
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await submitNotification({ name, phone, email });
      setSuccess(true);
      notifySubmitted = true;
      localStorage.setItem("circuitron_notify_success", "true");
      // Close after 2.5 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />

          {/* Modal Container Card */}
          <motion.div
            className="relative w-full max-w-[420px] p-6 sm:p-8 rounded-2xl border"
            style={{
              background: "rgba(10, 15, 30, 0.93)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: success ? `${color}60` : "rgba(255, 255, 255, 0.08)",
              boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.85), 0 0 35px -5px ${color}2e`,
            }}
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white transition-colors hover:bg-white/5 active:scale-90"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {!success ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Header */}
                <div className="text-center mb-1">
                  <h4 className="font-orbitron font-bold text-lg tracking-wider uppercase mb-1.5" style={{ color }}>
                    Stay Updated
                  </h4>
                  <p className="font-exo text-xs sm:text-sm text-slate-400/90 leading-relaxed">
                    Join the innovation journey. Get notified when registrations open!
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-exo text-[11px]">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name Input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.06)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = color)}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.06)")}
                  />
                </div>

                {/* Phone Input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.06)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = color)}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.06)")}
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.06)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = color)}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.06)")}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-orbitron font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-950 active:scale-[0.98] transition-all disabled:opacity-50 select-none cursor-pointer flex items-center justify-center gap-1.5 mt-1"
                  style={{
                    background: `linear-gradient(135deg, #ffffff 0%, ${color} 100%)`,
                    boxShadow: `0 4px 15px ${color}33`,
                  }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Notify Me"
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center py-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}40`,
                  }}
                >
                  <Check size={28} style={{ color }} />
                </div>
                <h4 className="font-orbitron font-bold text-base tracking-wider uppercase mb-1.5" style={{ color }}>
                  Awesome!
                </h4>
                <p className="font-exo text-xs sm:text-sm text-slate-400">
                  You're on the list. We will contact you soon!
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
