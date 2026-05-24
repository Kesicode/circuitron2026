"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CircuitBackground from "@/components/CircuitBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConfigProvider, usePhaseTheme } from "@/lib/ConfigContext";
import RegistrationForm from "@/components/RegistrationForm";

function NotifyForm() {
  const { color } = usePhaseTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-28 pb-16 relative z-10 px-4 sm:px-6">
      <div className="w-full flex flex-col items-center justify-center">
        {/* Back button */}
        <div className="mb-6 w-full max-w-[450px] text-left">
          <Link
            href="/"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo(0, 0);
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-orbitron font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} style={{ color }} />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        {/* Registration Card */}
        <div
          className="w-full max-w-[450px] p-6 sm:p-8 rounded-2xl border"
          style={{
            background: "var(--modal-bg)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: "var(--border)",
            boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 30px -10px ${color}20`,
          }}
        >
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
}

export default function NotifyPage() {
  return (
    <ConfigProvider>
      <CircuitBackground />
      <Navbar />
      <NotifyForm />
      <Footer />
    </ConfigProvider>
  );
}
