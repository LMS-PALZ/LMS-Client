"use client";

import { cn } from "@ssu/utils";

function toZoomWebClientUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  // If the API already returns a web-client URL, keep it.
  if (trimmed.includes("/wc/")) return trimmed;

  // Convert common Zoom join URL to the web client join URL.
  // Example: https://zoom.us/j/123456789?pwd=XYZ -> https://zoom.us/wc/join/123456789?pwd=XYZ
  const match = trimmed.match(/zoom\.us\/j\/(\d+)/);
  if (match?.[1]) {
    const meetingId = match[1];
    const hasQuery = trimmed.includes("?");
    const query = hasQuery ? trimmed.slice(trimmed.indexOf("?")) : "";
    const origin = trimmed.startsWith("http")
      ? new URL(trimmed).origin
      : "https://zoom.us";
    return `${origin}/wc/join/${meetingId}${query}`;
  }

  return trimmed;
}

export interface ZoomLiveEmbedProps {
  meetUrl: string;
  className?: string;
}

export function ZoomLiveEmbed({ meetUrl, className }: ZoomLiveEmbedProps) {
  const src = toZoomWebClientUrl(meetUrl);
  if (!src) {
    return (
      <div
        className={cn(
          "flex min-h-[360px] items-center justify-center rounded-[18px] bg-[#202124] px-6 text-center text-[14px] text-[#e8eaed]",
          className,
        )}
      >
        Meeting link not available.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-[18px] bg-black",
        className,
      )}
    >
      <iframe
        title="Live class"
        src={src}
        className="absolute inset-0 h-full w-full border-0"
        allow="camera; microphone; autoplay; fullscreen; display-capture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
