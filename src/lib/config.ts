export type RegState = "coming_soon" | "pre_open" | "open" | "closed";

export const SITE_CONFIG = {
  workshopName:   "Circuitron",
  tagline:        "Embedded Systems Innovation Ecosystem",
  subtitle:       "A transformative program designed to take you from a student to an industry-ready innovator. The details are classified. The impact is guaranteed.",
  venue:          "College of Engineering, Kidangoor",
  organization:   "IEEE",
  chapters:       ["IEEE IAS", "IEEE RAS"],

  // --- UPI & WhatsApp ---
  upiId:         "paytm.s1wsfli@pty",
  whatsappLink:  "https://chat.whatsapp.com/I6C7QPjdoEs55ptG1J1RkT",

  // --- Registration ---
  registrationState: "pre_open" as RegState,
  registrationLink:  "https://forms.gle/9tj9dDzYkGn4AgjRA",

  // --- Registration Period Dates ---
  preRegStart:   "2026-05-24T00:00:00",
  preRegEnd:     "2026-05-25T23:59:59",
  regStart:      "2026-05-26T00:00:00",
  regEnd:        "2026-05-30T23:59:59",

  // --- Event Dates ---
  bootcampDateStart: "2026-06-01T00:00:00",
  bootcampDateEnd:   "2026-06-14T23:59:59",

  // --- Legacy Key Dates (kept for compatibility) ---
  registrationOpenDate: "2026-05-24T00:00:00",
  bootcampDate:         "2026-06-01T09:00:00",
  internshipDate:       "2026-08-01T09:00:00",
  hackathonDate:        "2026-08-15T09:00:00",

  // --- Announcements ---
  announcement:     "🚀 Circuitron Pre-Registration is now open! Secure your spot in the ecosystem.",
  showAnnouncement: true,

  // --- Google Sheets Integration ---
  googleScriptUrl: process.env.GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyaE1NZP-MAMnsn4zYng7ms2NlFp7j-MFASFVsE7YmHwo5BstCLnM7fjbXOYRd5DsvVIg/exec",
};

// Stub for future Firebase integration
export async function getSiteConfig() {
  return SITE_CONFIG;
}

