export interface NotifyData {
  name: string;
  phone: string;
  email: string;
}

export async function submitNotification(data: NotifyData) {
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
