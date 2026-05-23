"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePhaseTheme } from "@/lib/ConfigContext";
import RegistrationForm from "./RegistrationForm";

let notifyDismissed = false;
let notifySubmitted = false;

export default function NotifyPopup({ loaded = true }: { loaded?: boolean }) {
  const { color } = usePhaseTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollTriggered, setScrollTriggered] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // 1. Global event listener to open popup manually
    const handleOpenEvent = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-pre-register", handleOpenEvent);

    // 2. Scroll trigger auto-opening
    if (!loaded) return;
    if (notifyDismissed || notifySubmitted) return;

    let isReady = false;
    const timer = setTimeout(() => {
      isReady = true;
    }, 600);

    const handleScroll = () => {
      if (isReady && window.scrollY > 300 && !scrollTriggered) {
        setScrollTriggered(true);
        setIsOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-pre-register", handleOpenEvent);
    };
  }, [scrollTriggered, loaded, notifyDismissed, notifySubmitted]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    notifyDismissed = true;
  };

  const handleSuccess = () => {
    setSuccess(true);
    notifySubmitted = true;
    localStorage.setItem("circuitron_notify_success", "true");
    // Auto close modal after 5 seconds to let them click the WhatsApp link
    setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />

          <div
            className="flex min-h-full items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleClose();
              }
            }}
          >
            {/* Modal Container Card */}
            <motion.div
              className="relative w-full max-w-[450px] p-6 sm:p-8 rounded-2xl border my-8"
              style={{
                background: "rgba(10, 15, 30, 0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: success ? "#10b98160" : "rgba(255, 255, 255, 0.08)",
                boxShadow: `0 20px 40px -15px rgba(0, 0, 0, 0.9), 0 0 35px -5px ${color}22`,
              }}
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Top Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white transition-colors hover:bg-white/5 active:scale-90 z-20 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <RegistrationForm onSuccessCallback={handleSuccess} />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
