import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  input: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
): string {
  const d =
    typeof input === "string" || typeof input === "number"
      ? new Date(input)
      : input;
  return new Intl.DateTimeFormat(undefined, options).format(d);
}

export function formatDateDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function googleDriveFileId(url: URL): string | null {
  const fromPath = url.pathname.match(/\/file\/d\/([^/]+)/);
  if (fromPath?.[1]) return fromPath[1];

  if (url.pathname.includes("/folders/")) return null;

  return url.searchParams.get("id");
}

function withAutoplay(embedUrl: string, muted = false): string {
  const url = new URL(embedUrl);
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("playsinline", "1");
  if (muted) url.searchParams.set("mute", "1");
  return url.toString();
}

/** Turns a public video link into an embeddable player URL that starts when it loads. */
export function toVideoEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id
        ? withAutoplay(`https://www.youtube.com/embed/${id}`, true)
        : trimmed;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/"))
        return withAutoplay(trimmed, true);
      const fromQuery = parsed.searchParams.get("v");
      const fromPath = parsed.pathname.split("/").filter(Boolean).at(-1);
      const id = fromQuery || fromPath;
      return id
        ? withAutoplay(`https://www.youtube.com/embed/${id}`, true)
        : trimmed;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (!id) return trimmed;
      const vimeo = new URL(`https://player.vimeo.com/video/${id}`);
      vimeo.searchParams.set("autoplay", "1");
      vimeo.searchParams.set("muted", "1");
      return vimeo.toString();
    }

    if (host === "drive.google.com" || host === "docs.google.com") {
      const id = googleDriveFileId(parsed);
      return id
        ? withAutoplay(`https://drive.google.com/file/d/${id}/preview`)
        : trimmed;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, Math.max(0, maxLength - 1))}…`;
}

export function getInitials(firstName?: string, lastName?: string): string {
  const a = firstName?.trim()?.charAt(0) ?? "";
  const b = lastName?.trim()?.charAt(0) ?? "";

  return (a + b).toUpperCase() || "?";
}

const units = ["B", "KB", "MB", "GB"] as const;

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  let n = bytes;
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u += 1;
  }
  return `${u === 0 ? n : n.toFixed(1)} ${units[u]}`;
}
