import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, phone, email } = data;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { status: "error", message: "Name, phone, and email are required." },
        { status: 400 }
      );
    }

    // Get the script URL from environment variables or site config
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || SITE_CONFIG.googleScriptUrl;

    // Check if it's still the default placeholder
    if (!scriptUrl || scriptUrl.includes("placeholder")) {
      console.warn("⚠️ Google Apps Script URL is not configured. Logging submission to console:", data);
      
      // In local development, we return a mock success so the UI doesn't break
      return NextResponse.json({
        status: "success",
        message: "Submission logged successfully (mock/dev mode)."
      });
    }

    // Forward the POST request to the Google Apps Script Web App
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      // Let fetch follow redirect since Apps Script redirects (302) on success
      redirect: "follow",
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Google Apps Script returned status ${response.status}: ${errText}`);
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error submitting notification signup:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to submit request." },
      { status: 500 }
    );
  }
}
