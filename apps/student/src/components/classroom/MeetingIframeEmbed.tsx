"use client";

import { cn } from "@ssu/utils";
import { parseMeetingTarget } from "@/lib/classroom/meeting-url";

export interface MeetingIframeEmbedProps {
  meetUrl: string;
  className?: string;
}

export function MeetingIframeEmbed({
  meetUrl,
  className,
}: MeetingIframeEmbedProps) {
  const target = parseMeetingTarget(meetUrl);

  if (
    !target ||
    target.kind === "jitsi" ||
    !("embedUrl" in target) ||
    !target.embedUrl
  ) {
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
        src={target.embedUrl}
        className="absolute inset-0 h-full w-full border-0"
        allow="camera; microphone; autoplay; fullscreen; display-capture; clipboard-read; clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
