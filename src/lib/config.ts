export type RegState = "coming_soon" | "pre_open" | "open" | "closed";

export const SITE_CONFIG = {
  workshopName:   "Circuitron",
  tagline:        "Embedded Systems Innovation Ecosystem",
  subtitle:       "The ultimate innovation ecosystem is loading. Are you ready for what comes next?",
  venue:          "TBA",
  organization:   "IEEE",
  chapters:       ["IEEE IAS", "IEEE RAS"],

  // --- Registration ---
  registrationState: "pre_open" as RegState,
  registrationLink:  "https://forms.gle/9tj9dDzYkGn4AgjRA",

  // --- Key Dates ---
  registrationOpenDate: "2026-07-01T00:00:00",
  bootcampDate:         "2026-07-15T09:00:00",
  internshipDate:       "2026-08-01T09:00:00",
  hackathonDate:        "2026-08-15T09:00:00",

  // --- Announcements ---
  announcement:     "🚀 Circuitron Pre-Registration is now open! Secure your spot in the ecosystem.",
  showAnnouncement: true,

  // --- Google Sheets Integration ---
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbz350A2a5ggvNZ_zzkuPuJci2c936DZ4pqYUT7pocTco4n_tONob7v6V-Aeu8bVUP5o0g/exec",
};

// Stub for future Firebase integration
export async function getSiteConfig() {
  return SITE_CONFIG;
}
