export type RegState = "coming_soon" | "pre_open" | "open" | "closed";

export const SITE_CONFIG = {
  workshopName:   "Circuitron",
  tagline:        "Embedded Systems Innovation Ecosystem",
  subtitle:       "Master Embedded Systems & IoT Through Innovation",
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
};

// Stub for future Firebase integration
export async function getSiteConfig() {
  return SITE_CONFIG;
}
