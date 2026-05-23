import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/config";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID parameter is required." },
        { status: 400 }
      );
    }

    const idClean = id.trim();
    if (!idClean) {
      return NextResponse.json(
        { status: "error", message: "ID parameter cannot be empty." },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || SITE_CONFIG.googleScriptUrl;

    // Check if the script URL is not configured or is a placeholder
    if (!scriptUrl || scriptUrl.includes("placeholder")) {
      console.warn("⚠️ Google Apps Script URL is not configured. Mocking validation success.");
      return NextResponse.json({
        registered: false,
        message: "IEEE ID is unique (mock/dev mode)."
      });
    }

    // Call the Google Apps Script Web App to verify uniqueness against the Google Sheet
    const checkUrl = `${scriptUrl}?action=checkIeee&id=${encodeURIComponent(idClean)}`;
    
    const response = await fetch(checkUrl, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script returned status ${response.status}`);
    }

    const resultText = await response.text();
    let result;
    try {
      result = JSON.parse(resultText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${resultText.substring(0, 50)}...`);
    }

    if (result.status === "error") {
      throw new Error(result.message || "Failed to validate IEEE ID in Google Sheet.");
    }

    return NextResponse.json({
      registered: !!result.registered,
      message: result.registered
        ? "This IEEE Membership ID is already registered."
        : "IEEE ID is unique."
    });

  } catch (error: any) {
    console.error("Error validating IEEE ID uniqueness via Google Sheet REST call:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to validate IEEE ID." },
      { status: 500 }
    );
  }
}
