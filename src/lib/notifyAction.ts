export interface RegistrationData {
  name: string;
  phone: string;
  email: string;
  college: string;
  department: string;
  year: string;
  isIeee: boolean;
  ieeeId?: string;
  regType: string;
  amount: number;
  utr?: string;
  screenshotBase64?: string;
  screenshotMimeType?: string;
  screenshotFileName?: string;
}

export async function submitNotification(data: RegistrationData) {
  const response = await fetch("/api/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok || result.status === "error") {
    throw new Error(result.message || "Something went wrong. Please try again.");
  }

  return result;
}

