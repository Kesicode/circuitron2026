"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, User, Check, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CircuitBackground from "@/components/CircuitBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConfigProvider, usePhaseTheme } from "@/lib/ConfigContext";
import { submitNotification } from "@/lib/notifyAction";

function NotifyForm() {
  const { color } = usePhaseTheme();
  
  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
      localStorage.setItem("circuitron_notify_success", "true");
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pt-24 pb-8 relative z-10 px-4 sm:px-6">
      <div className="flex-grow flex flex-col items-center justify-center py-12">
        {/* Back button */}
        <div className="mb-6 w-full max-w-[420px] text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-orbitron font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} style={{ color }} />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        {/* Signup card */}
        <motion.div
          className="w-full max-w-[420px] p-6 sm:p-8 rounded-2xl border"
          style={{
            background: "rgba(10, 15, 30, 0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: success ? `${color}60` : "rgba(255, 255, 255, 0.07)",
            boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 30px -10px ${color}20`,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {!success ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
              {/* Header */}
              <div className="text-center mb-2">
                <h2 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider uppercase mb-1.5" style={{ color }}>
                  Join the List
                </h2>
                <p className="font-exo text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Be the first to know when official registrations open for Circuitron.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-exo text-xs">
                  <AlertCircle size={15} className="shrink-0" />
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
                  className="w-full bg-slate-950/60 border rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
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
                  className="w-full bg-slate-950/60 border rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
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
                  className="w-full bg-slate-950/60 border rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all"
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
                className="w-full py-3 rounded-full font-orbitron font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-950 active:scale-[0.98] transition-all disabled:opacity-50 select-none cursor-pointer flex items-center justify-center gap-1.5 mt-2"
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
              className="flex flex-col items-center justify-center py-10 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}40`,
                }}
              >
                <Check size={32} style={{ color }} />
              </div>
              <h3 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider uppercase mb-2" style={{ color }}>
                Pre-Registration Set!
              </h3>
              <p className="font-exo text-xs sm:text-sm text-slate-400 max-w-xs leading-relaxed">
                Thank you for signing up. You have been successfully added to our Google Sheets mailing list.
              </p>
              <Link
                href="/"
                className="mt-6 px-5 py-2.5 rounded-xl font-orbitron text-xs tracking-wider uppercase border border-slate-700 hover:border-white transition-colors"
              >
                Return to Home
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default function NotifyPage() {
  return (
    <ConfigProvider>
      <CircuitBackground />
      <Navbar />
      <NotifyForm />
    </ConfigProvider>
  );
}
