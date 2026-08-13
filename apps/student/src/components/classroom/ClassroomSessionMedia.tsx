"use client";

import { LiveIndicator } from "@ssu/ui";
import { cn } from "@ssu/utils";
import dynamic from "next/dynamic";
import { CalendarClock, VideoOff } from "lucide-react";
import type { ReactNode } from "react";
import { MeetingIframeEmbed } from "./MeetingIframeEmbed";
import { parseMeetingTarget } from "@/lib/classroom/meeting-url";

const ZoomLiveEmbed = dynamic(
  () => import("./ZoomLiveEmbed").then((module) => module.ZoomLiveEmbed),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[4/3] max-h-[85vh] min-h-[420px] items-center justify-center rounded-[18px] bg-[#242424]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    ),
  },
);

// The app is cross-origin isolated (COEP) for Zoom, which blocks third-party
// iframes unless they opt in. Loading them credentialless keeps them working.
const CREDENTIALLESS = { credentialless: "" } as Record<string, string>;

export type ClassroomMediaMode =
  | "live-meet"
  | "recording-embed"
  | "ended-placeholder"
  | "upcoming-placeholder";

export interface ClassroomSessionMediaProps {
  mode: ClassroomMediaMode;
  meetUrl?: string;
  meetingNumber?: string;
  displayName?: string;
  recordingEmbedUrl?: string | null;
  className?: string;
  onLeaveMeeting?: () => void;
}

function LiveMediaShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <LiveIndicator
        label="LIVE"
        size="sm"
        tone="overlay"
        uppercase
        className="pointer-events-none absolute left-3 top-3 z-10"
      />
    </div>
  );
}

export function ClassroomSessionMedia({
  mode,
  meetUrl,
  meetingNumber,
  displayName,
  recordingEmbedUrl,
  className,
  onLeaveMeeting,
}: ClassroomSessionMediaProps) {
  if (mode === "live-meet") {
    const meetingTarget = meetUrl ? parseMeetingTarget(meetUrl) : null;

    if (
      meetingTarget?.kind === "zoom" ||
      (meetUrl && /zoom\.(us|com)/i.test(meetUrl))
    ) {
      // The Zoom embed renders its own live header, so it skips LiveMediaShell.
      return (
        <ZoomLiveEmbed
          meetUrl={meetUrl!}
          meetingNumber={meetingNumber}
          displayName={displayName}
          className={className}
          onLeave={onLeaveMeeting}
        />
      );
    }

    if (meetUrl) {
      return (
        <LiveMediaShell className={className}>
          <MeetingIframeEmbed meetUrl={meetUrl} />
        </LiveMediaShell>
      );
    }

    return (
      <LiveMediaShell className={className}>
        <div
          className={cn(
            "flex min-h-[360px] flex-col items-center justify-center rounded-[18px] bg-[#F4F7FA] px-6 text-center",
            className,
          )}
        >
          <p className="text-[18px] font-semibold text-[#1D1D1D]">
            Meeting link not available
          </p>
          <p className="mt-2 max-w-md text-[14px] leading-6 text-[#6B7280]">
            This session is live, but no join link was provided. Please contact
            your instructor or check back shortly.
          </p>
        </div>
      </LiveMediaShell>
    );
  }

  if (mode === "recording-embed" && recordingEmbedUrl) {
    return (
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-[18px] bg-black",
          className,
        )}
      >
        <iframe
          {...CREDENTIALLESS}
          title="Class recording"
          src={recordingEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  if (mode === "ended-placeholder") {
    return (
      <div
        className={cn(
          "flex min-h-[360px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[#C5D2E1] bg-[#F4F7FA] px-6 text-center",
          className,
        )}
      >
        <div className="rounded-full bg-[#ECF0F7] p-4">
          <VideoOff className="h-8 w-8 text-[#7A8594]" />
        </div>
        <p className="mt-4 text-[18px] font-semibold text-[#1D1D1D]">
          This class has ended
        </p>
        <p className="mt-2 max-w-md text-[14px] leading-6 text-[#6B7280]">
          Open the Recording tab below to watch the session replay.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[360px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[#C5D2E1] bg-[#F8FAFC] px-6 text-center",
        className,
      )}
    >
      <div className="rounded-full bg-[#ECF0F7] p-4">
        <CalendarClock className="h-8 w-8 text-[#7A8594]" />
      </div>
      <p className="mt-4 text-[18px] font-semibold text-[#1D1D1D]">
        Classroom appears here
      </p>
      <p className="mt-2 max-w-sm text-[14px] leading-6 text-[#6B7280]">
        This session is scheduled for a later date. Join when the class is live.
      </p>
    </div>
  );
}
