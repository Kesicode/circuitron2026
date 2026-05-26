"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, Building, Layers, ArrowLeft, ArrowRight, Check, AlertCircle, QrCode, ShieldCheck, UploadCloud, FileImage } from "lucide-react";
import { usePhaseTheme, useSiteConfig } from "@/lib/ConfigContext";
import { submitNotification } from "@/lib/notifyAction";

// Helper to determine active pricing period and price
const getRegistrationStateAndPrice = (date: Date, isIeee: boolean) => {
  const time = date.getTime();
  
  // Dates in IST (UTC+5:30)
  const preStart = new Date("2026-05-24T00:00:00+05:30").getTime();
  const preEnd = new Date("2026-05-25T23:59:59+05:30").getTime();
  const regStart = new Date("2026-05-26T00:00:00+05:30").getTime();
  const regEnd = new Date("2026-05-30T23:59:59+05:30").getTime();

  if (time < preStart) {
    // Before pre-registration starts, let them pre-register at the discounted rate for early access testing
    return {
      period: "Pre-Registration",
      label: "Pre-Registration (Early Access Discount Applied)",
      price: isIeee ? 90 : 180,
      status: "open"
    };
  } else if (time >= preStart && time <= preEnd) {
    return {
      period: "Pre-Registration",
      label: "Pre-Registration (10% Discount Applied)",
      price: isIeee ? 90 : 180,
      status: "open"
    };
  } else if (time >= regStart && time <= regEnd) {
    return {
      period: "Normal Registration",
      label: "Normal Registration Phase",
      price: isIeee ? 100 : 200,
      status: "open"
    };
  } else if (time > preEnd && time < regStart) {
    // Grace transition period
    return {
      period: "Normal Registration",
      label: "Normal Registration Phase",
      price: isIeee ? 100 : 200,
      status: "open"
    };
  } else {
    return {
      period: "Closed",
      label: "Registration Closed",
      price: isIeee ? 100 : 200,
      status: "closed"
    };
  }
};

interface RegistrationFormProps {
  onSuccessCallback?: () => void;
}

export default function RegistrationForm({ onSuccessCallback }: RegistrationFormProps) {
  const { color } = usePhaseTheme();
  const { config } = useSiteConfig();
  
  // Step: 1 = Details, 2 = Payment, 3 = Success
  const [step, setStep] = useState(1);
  
  // Form Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [year, setYear] = useState("1st Year");
  const [isIeee, setIsIeee] = useState(false);
  const [ieeeId, setIeeeId] = useState("");
  
  // Payment Screenshot Upload States
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotBase64, setScreenshotBase64] = useState<string>("");
  const [screenshotMimeType, setScreenshotMimeType] = useState<string>("");
  const [screenshotFileName, setScreenshotFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Limit to 5MB
        setError("File is too large. Max size is 5MB.");
        return;
      }
      setError("");
      setScreenshot(file);
      setScreenshotFileName(file.name);
      setScreenshotMimeType(file.type);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip the data:image/xxx;base64, prefix
        const base64Data = base64String.split(",")[1];
        setScreenshotBase64(base64Data);
        setScreenshotPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // States for dynamic price
  const [priceInfo, setPriceInfo] = useState({
    period: "Pre-Registration",
    label: "Pre-Registration (Early Access Discount Applied)",
    price: 90,
    status: "open"
  });

  const [loading, setLoading] = useState(false);
  const [validatingIeee, setValidatingIeee] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(/Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent));
    }
  }, []);

  // Update dynamic price based on isIeee and current date/time
  useEffect(() => {
    const info = getRegistrationStateAndPrice(new Date(), isIeee);
    setPriceInfo(info);
  }, [isIeee]);

  // Prevent refresh when loading
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [loading]);

  const validateStep1 = () => {
    if (!name.trim()) return "Name is required.";
    
    const phoneClean = phone.replace(/\D/g, "");
    if (phoneClean.length !== 10) return "Provide a valid 10-digit phone number.";
    if (!/^[6-9]\d{9}$/.test(phoneClean)) return "Provide a valid Indian mobile number.";
    if (/^(\d)\1{9}$/.test(phoneClean)) return "Phone number cannot be all the same digit.";
    if (/^(0123456789|1234567890|9876543210)$/.test(phoneClean)) return "Provide a real phone number.";

    if (!/\S+@\S+\.\S+/.test(email)) return "Provide a valid email address.";
    if (!college.trim()) return "College/Institution name is required.";
    if (isIeee) {
      const idClean = ieeeId.trim();
      if (!idClean) return "IEEE Membership ID is required for IEEE members.";
      // Basic IEEE ID format check: typically 7 to 9 digits
      if (!/^\d{7,9}$/.test(idClean)) return "Invalid IEEE Membership ID format. It should be 7 to 9 digits.";
    }
    return null;
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError("");

    // Asynchronous check for IEEE ID uniqueness
    if (isIeee && ieeeId.trim()) {
      setValidatingIeee(true);
      try {
        const response = await fetch(`/api/validate-ieee?id=${encodeURIComponent(ieeeId.trim())}`);
        const resultText = await response.text();
        let result;
        try {
          result = JSON.parse(resultText);
        } catch (e) {
          throw new Error("Invalid response from validation server.");
        }
        
        if (!response.ok || result.status === "error") {
          throw new Error(result.message || "Failed to validate IEEE Membership ID.");
        }
        
        if (result.registered) {
          setError("This IEEE Membership ID has already been registered. IDs cannot be reused.");
          setValidatingIeee(false);
          return;
        }
      } catch (err: any) {
        setError(err.message || "Network error. Failed to verify IEEE ID uniqueness.");
        setValidatingIeee(false);
        return;
      }
      setValidatingIeee(false);
    }

    setStep(2);
  };

  const handlePrevStep = () => {
    setError("");
    setStep(1);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (priceInfo.status === "closed") {
      setError("Registration has closed.");
      return;
    }

    // Screenshot validation
    if (!screenshotBase64) {
      setError("Please upload the payment screenshot to complete registration.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await submitNotification({
        name,
        phone,
        email,
        college,
        department,
        year,
        isIeee,
        ieeeId: isIeee ? ieeeId : "N/A",
        regType: priceInfo.period,
        amount: priceInfo.price,
        screenshotBase64,
        screenshotMimeType,
        screenshotFileName,
      });

      setStep(3);
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    } catch (err: any) {
      setError(err.message || "Submission failed. Please verify your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  // UPI configuration
  const upiId = config.upiId || "paytm.s1wsfli@pty";
  const payeeName = encodeURIComponent("Circuitron");
  const txnNote = encodeURIComponent("Circuitron Tech Bootcamp");
  const upiPayload = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${priceInfo.price}&cu=INR&tn=${txnNote}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPayload)}`;

  // Copy UPI ID state
  const [copied, setCopied] = useState(false);
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // WhatsApp join state — true once user has clicked the link
  const [whatsappClicked, setWhatsappClicked] = useState(false);

  const handleWhatsAppClick = () => {
    setWhatsappClicked(true); // reveal the confirm button
  };

  const handleJoinedConfirm = () => {
    // User says they joined — close the modal now
    if (onSuccessCallback) onSuccessCallback();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: Personal and College Details */}
        {step === 1 && (
          <motion.form
            key="step1"
            onSubmit={handleNextStep}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-1">
              <h2 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider uppercase mb-1" style={{ color }}>
                Registration Details
              </h2>
              <p className="font-exo text-xs text-slate-400">
                Enter your details to reserve your spot in Phase 1: Tech Bootcamp
              </p>
            </div>


            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-exo text-xs">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Name */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <User size={16} />
              </span>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/60 border rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all border-white/5"
                style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
                onFocus={(e) => (e.target.style.borderColor = color)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.06)")}
              />
            </div>

            {/* Phone & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  placeholder="WhatsApp Number"
                  required
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setPhone(val);
                  }}
                  className="w-full bg-slate-950/60 border rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all border-white/5"
                  style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
                  onFocus={(e) => (e.target.style.borderColor = color)}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.06)")}
                />
              </div>

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
                  className="w-full bg-slate-950/60 border rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all border-white/5"
                  style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
                  onFocus={(e) => (e.target.style.borderColor = color)}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.06)")}
                />
              </div>
            </div>

            {/* College */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Building size={16} />
              </span>
              <input
                type="text"
                placeholder="College / Institution Name"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-950/60 border rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all border-white/5"
                style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
                onFocus={(e) => (e.target.style.borderColor = color)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.06)")}
              />
            </div>

            {/* Department & Year Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Layers size={16} />
                </span>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950/90 border rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all border-white/5 cursor-pointer appearance-none"
                  style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Computer Science & Engineering (Cyber Security)">CSE (Cyber Security)</option>
                  <option value="Computer Science & Engineering (AI & ML)">CSE (AI & ML)</option>
                  <option value="Artificial Intelligence & Data Science">AI & DS</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication Engineering">ECE</option>
                  <option value="Electrical & Electronics Engineering">EEE</option>
                  <option value="Electrical & Computer Engineering">Electrical & Computer Eng</option>
                  <option value="Robotics & Automation">Robotics & Automation</option>
                  <option value="Civil Engineering">Civil Eng</option>
                  <option value="Mechanical Engineering">Mech Eng</option>
                  <option value="Biomedical Engineering">Biomedical Eng</option>
                  <option value="Chemical Engineering">Chemical Eng</option>
                  <option value="Safety & Fire Engineering">Safety & Fire Eng</option>
                  <option value="Other">Other Dept</option>
                </select>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Layers size={16} />
                </span>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-950/90 border rounded-xl pl-10 pr-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all border-white/5 cursor-pointer appearance-none"
                  style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            {/* IEEE Membership Selection */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="font-rajdhani text-xs tracking-wider text-slate-400 font-bold uppercase">
                IEEE Membership Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsIeee(true)}
                  className="py-2 rounded-xl text-xs font-orbitron font-semibold transition-all cursor-pointer border"
                  style={{
                    background: isIeee ? `${color}12` : "rgba(255,255,255,0.02)",
                    borderColor: isIeee ? color : "rgba(255,255,255,0.05)",
                    color: isIeee ? color : "#94a3b8",
                    boxShadow: isIeee ? `0 0 15px -3px ${color}35` : "none",
                  }}
                >
                  IEEE Member
                </button>
                <button
                  type="button"
                  onClick={() => setIsIeee(false)}
                  className="py-2 rounded-xl text-xs font-orbitron font-semibold transition-all cursor-pointer border"
                  style={{
                    background: !isIeee ? `${color}12` : "rgba(255,255,255,0.02)",
                    borderColor: !isIeee ? color : "rgba(255,255,255,0.05)",
                    color: !isIeee ? color : "#94a3b8",
                    boxShadow: !isIeee ? `0 0 15px -3px ${color}35` : "none",
                  }}
                >
                  Non-IEEE Member
                </button>
              </div>
            </div>

            {/* Sliding IEEE ID Input */}
            <motion.div
              initial={false}
              animate={{ height: isIeee ? "auto" : 0, opacity: isIeee ? 1 : 0 }}
              style={{ overflow: "hidden" }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="IEEE Membership ID"
                  required={isIeee}
                  value={ieeeId}
                  onChange={(e) => setIeeeId(e.target.value)}
                  className="w-full bg-slate-950/60 border rounded-xl px-4 py-2.5 font-exo text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all border-white/5"
                  style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
                  onFocus={(e) => (e.target.style.borderColor = color)}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.06)")}
                />
              </div>
            </motion.div>

            {/* Next button */}
            <button
              type="submit"
              disabled={validatingIeee}
              className="w-full py-3 rounded-full font-orbitron font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-950 active:scale-[0.98] transition-all disabled:opacity-50 select-none cursor-pointer flex items-center justify-center gap-2 mt-4"
              style={{
                background: `linear-gradient(135deg, #ffffff 0%, ${color} 100%)`,
                boxShadow: `0 4px 15px ${color}33`,
              }}
            >
              {validatingIeee ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying IEEE ID...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* STEP 2: Checkout and Payment Gate */}
        {step === 2 && (
          <motion.form
            key="step2"
            onSubmit={handleFinalSubmit}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header / Back */}
            <div className="flex items-center justify-between mb-1">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-xs font-orbitron font-semibold cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>BACK</span>
              </button>
              <span className="text-[10px] font-orbitron font-bold tracking-widest text-slate-500 uppercase bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                STEP 02 OF 02
              </span>
            </div>

            <div className="text-center mb-1">
              <h2 className="font-orbitron font-bold text-lg sm:text-xl tracking-wider uppercase mb-1" style={{ color }}>
                Secure Payment
              </h2>
              <p className="font-exo text-xs text-slate-400">
                Scan or click button below to make your payment
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-exo text-xs">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Price breakdown */}
            <div className="bg-slate-950/80 border border-white/5 rounded-xl p-3 flex flex-col gap-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Registration Type:</span>
                <span className="text-slate-200 font-medium font-orbitron">{priceInfo.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Selected:</span>
                <span className="text-slate-200 font-medium font-orbitron">
                  {isIeee ? "IEEE Member" : "Non-IEEE Member"}
                </span>
              </div>
              <div className="h-px bg-white/5 my-1.5" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-semibold">Total Amount:</span>
                <span className="font-bold font-orbitron" style={{ color }}>₹{priceInfo.price}</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-exo mt-1 leading-normal text-center">
                ✓ {priceInfo.label}
              </p>
            </div>

            {/* Payment Details QR */}
            <div className="flex flex-col items-center justify-center bg-slate-950/40 rounded-xl p-4 border border-white/5">
              <div
                className="relative block bg-white p-2 rounded-lg border-2 select-none"
                style={{ borderColor: `${color}40` }}
              >
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className="w-[140px] h-[140px]"
                />
              </div>

              <div className="w-full mt-4 flex flex-col gap-2">
                <div className="w-full px-3 py-2 rounded-xl text-center" style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
                  <span className="font-exo text-[10px] text-slate-300 block leading-normal">
                    Please pay the exact amount: <strong className="font-orbitron" style={{ color }}>₹{priceInfo.price}</strong>
                  </span>
                </div>
                <div className="w-full px-2 py-1.5 rounded-xl bg-slate-950/40 border border-white/5 text-center">
                  <span className="font-exo text-[10px] text-slate-400 leading-relaxed block">
                    Scan this QR code (or take a screenshot and scan from gallery) to pay.
                  </span>
                </div>
              </div>

                    {/* Screenshot Upload */}
            <div className="flex flex-col gap-2">
              <label className="font-rajdhani text-xs tracking-wider text-slate-400 font-bold uppercase">
                Payment Screenshot (Proof of Payment)
              </label>
              
              <div className="relative group">
                <input
                  type="file"
                  id="screenshot-upload"
                  accept="image/png, image/jpeg, image/jpg"
                  required
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all bg-[#020617]/40 group-hover:bg-[#020617]/70 relative overflow-hidden"
                  style={{
                    borderColor: screenshotPreview ? color : "rgba(255, 255, 255, 0.06)",
                    boxShadow: screenshotPreview ? `0 0 15px -3px ${color}25` : "none"
                  }}
                >
                  {screenshotPreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center">
                        <img
                          src={screenshotPreview}
                          alt="Screenshot preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <span className="font-exo text-[11px] text-slate-300 font-medium truncate max-w-[200px]">
                        {screenshotFileName}
                      </span>
                      <span className="font-orbitron text-[9px] uppercase tracking-wider font-bold text-slate-500 hover:text-white transition-colors">
                        Tap to change
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 group-hover:scale-105 transition-transform duration-300">
                        <UploadCloud size={18} style={{ color }} />
                      </div>
                      <div>
                        <span className="font-orbitron text-xs font-bold text-slate-200 block">
                          Upload Screenshot
                        </span>
                        <span className="font-exo text-[10px] text-slate-500 mt-1 block">
                          JPEG, JPG or PNG (max 5MB)
                        </span>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>      </div>

            {/* Final Submit button */}
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
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing... Do not refresh</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Verify & Register</span>
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* STEP 3: Registration Success and WhatsApp Redirection */}
        {step === 3 && (
          <motion.div
            key="step3"
            className="flex flex-col items-center justify-center py-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{
                background: `${color}15`,
                border: `1px solid ${color}40`,
                boxShadow: `0 0 20px ${color}1a`,
              }}
            >
              <Check size={32} style={{ color }} />
            </div>

            <h3 className="font-orbitron font-extrabold text-lg sm:text-xl tracking-wider uppercase mb-1.5" style={{ color }}>
              Registration Confirmed!
            </h3>
            
            <p className="font-exo text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed mb-6 font-light">
              Congratulations! Your spots in the <strong style={{ color }}>Circuitron Tech Bootcamp</strong> are confirmed. Your transaction has been recorded.
            </p>

            {/* WhatsApp Box */}
            <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 mb-6 max-w-sm w-full flex flex-col items-center text-center">
              <span className="font-rajdhani text-[10px] tracking-wider text-emerald-400 font-bold uppercase mb-1">
                ACTION REQUIRED
              </span>
              <h4 className="font-orbitron font-bold text-sm text-slate-100 mb-1.5">
                Join the Official Class Group
              </h4>
              <p className="font-exo text-[11px] text-slate-400 leading-normal mb-4">
                Please join the WhatsApp group now to receive schedule details, links to classes, software downloads, and updates.
              </p>

              {/* WhatsApp link + confirm button */}
              <AnimatePresence mode="wait">
                {!whatsappClicked ? (

                  /* ── Step 1: Join link ── */
                  <motion.a
                    key="wa-btn"
                    href={config.whatsappLink || "https://chat.whatsapp.com/I6C7QPjdoEs55ptG1J1RkT"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="w-full py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider text-white active:scale-[0.98] bg-emerald-600 hover:bg-emerald-500 cursor-pointer flex items-center justify-center gap-2 select-none"
                    style={{ transition: "background 0.2s, transform 0.15s" }}
                  >
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>JOIN WHATSAPP GROUP</span>
                  </motion.a>

                ) : (

                  /* ── Step 2: Confirm after joining ── */
                  <motion.div
                    key="wa-confirm"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex flex-col items-center gap-3"
                  >
                    {/* Hint text */}
                    <p className="font-exo text-[11px] text-slate-400 leading-snug text-center">
                      WhatsApp opened — tap <span className="text-emerald-400 font-semibold">Join Group</span> there, then come back and confirm below.
                    </p>

                    {/* Confirm button */}
                    <button
                      type="button"
                      onClick={handleJoinedConfirm}
                      className="w-full py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 select-none active:scale-[0.98]"
                      style={{
                        background: "rgba(74,222,128,0.12)",
                        border: "1px solid rgba(74,222,128,0.35)",
                        color: "#4ade80",
                        transition: "background 0.2s, transform 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(74,222,128,0.22)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(74,222,128,0.12)")}
                    >
                      <Check size={14} />
                      <span>I&apos;ve Joined!</span>
                    </button>

                    {/* Re-open link in case they missed it */}
                    <a
                      href={config.whatsappLink || "https://chat.whatsapp.com/I6C7QPjdoEs55ptG1J1RkT"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-exo text-[10px] text-slate-500 hover:text-emerald-400 underline underline-offset-2 transition-colors"
                    >
                      Didn&apos;t open? Click here again
                    </a>
                  </motion.div>

                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
