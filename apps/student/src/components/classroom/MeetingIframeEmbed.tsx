"use client";

import { cn } from "@ssu/utils";
import { parseMeetingTarget } from "@/lib/classroom/meeting-url";

export interface MeetingIframeEmbedProps {
  meetUrl: string;
  className?: string;
}

// The app is cross-origin isolated (COEP) for Zoom, which blocks third-party
// iframes unless they opt in. Loading them credentialless keeps them working.
const CREDENTIALLESS = { credentialless: "" } as Record<string, string>;

export function MeetingIframeEmbed({
  meetUrl,
  className,
}: MeetingIframeEmbedProps) {
  const target = parseMeetingTarget(meetUrl);

  if (!target || !("embedUrl" in target) || !target.embedUrl) {
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
        {...CREDENTIALLESS}
        title="Live class"
        src={target.embedUrl}
        className="absolute inset-0 h-full w-full border-0"
        allow="camera; microphone; autoplay; fullscreen; display-capture; clipboard-read; clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
