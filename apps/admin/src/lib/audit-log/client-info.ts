function readBrowserName(userAgent: string): string {
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/Chrome\//i.test(userAgent)) return "Chrome";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) {
    return "Safari";
  }
  return "Browser";
}

function readOperatingSystem(userAgent: string): string {
  if (/Windows NT/i.test(userAgent)) return "Windows";
  if (/Mac OS X/i.test(userAgent)) return "macOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Unknown OS";
}

export function collectClientInfo() {
  if (typeof window === "undefined") {
    return {
      device: "Unknown device",
      userAgent: "",
      platform: "",
      language: "",
      timezone: "",
      screenResolution: "",
    };
  }

  const userAgent = navigator.userAgent;
  const browser = readBrowserName(userAgent);
  const os = readOperatingSystem(userAgent);

  return {
    device: `${browser} on ${os}`,
    userAgent,
    platform: navigator.platform || "Unknown",
    language: navigator.language || "Unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    screenResolution:
      typeof window.screen !== "undefined"
        ? `${window.screen.width}x${window.screen.height}`
        : "Unknown",
  };
}

export async function resolveApproxLocation(): Promise<string> {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) return "Unavailable";

    const data = (await response.json()) as {
      city?: string;
      region?: string;
      country_name?: string;
    };

    const parts = [data.city, data.region, data.country_name].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Unavailable";
  } catch {
    return "Unavailable";
  }
}
