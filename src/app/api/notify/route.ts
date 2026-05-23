import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, phone, email, isIeee, ieeeId } = data;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { status: "error", message: "Name, phone, and email are required." },
        { status: 400 }
      );
    }

    // Get the script URL from environment variables or site config
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL || SITE_CONFIG.googleScriptUrl;

    // Check if the script URL is placeholder
    const isMockMode = !scriptUrl || scriptUrl.includes("placeholder");

    // Uniqueness validation for IEEE ID on server-side using Google Sheets Web App
    if (!isMockMode && isIeee && ieeeId && ieeeId !== "N/A" && ieeeId.trim()) {
      const idClean = ieeeId.trim();
      const checkUrl = `${scriptUrl}?action=checkIeee&id=${encodeURIComponent(idClean)}`;
      
      const checkRes = await fetch(checkUrl, {
        method: "GET",
        cache: "no-store",
        redirect: "follow",
        headers: {
          "Accept": "application/json"
        }
      });

      if (checkRes.ok) {
        const text = await checkRes.text();
        let checkResult;
        try {
          checkResult = JSON.parse(text);
        } catch(e) {}
        
        if (checkResult && checkResult.status === "success" && checkResult.registered) {
          return NextResponse.json(
            { status: "error", message: "This IEEE Membership ID has already been registered." },
            { status: 400 }
          );
        }
      }
    }

    // Mock response if Google Apps Script URL is placeholder/not configured
    if (isMockMode) {
      console.warn("⚠️ Google Apps Script URL is not configured. Logging submission to console:", data);
      return NextResponse.json({
        status: "success",
        message: "Submission logged successfully (mock/dev mode)."
      });
    }

    // Forward the POST request to the Google Apps Script Web App to append the row
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
