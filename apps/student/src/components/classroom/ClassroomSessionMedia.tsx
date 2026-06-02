"use client";

import { cn } from "@ssu/utils";
import { CalendarClock, VideoOff } from "lucide-react";
import type { LiveVideoProvider } from "@/lib/classroom/live-video";
import { JitsiLiveEmbed } from "./JitsiLiveEmbed";
import { MeetLivePanel } from "./MeetLivePanel";

export type ClassroomMediaMode =
  | "live-meet"
  | "recording-embed"
  | "ended-placeholder"
  | "upcoming-placeholder";

export interface ClassroomSessionMediaProps {
  mode: ClassroomMediaMode;
  liveProvider?: LiveVideoProvider;
  meetUrl?: string;
  jitsiRoomName?: string;
  jitsiDomain?: string;
  displayName?: string;
  recordingEmbedUrl?: string | null;
  className?: string;
}

export function ClassroomSessionMedia({
  mode,
  liveProvider = "google-meet",
  meetUrl,
  jitsiRoomName,
  jitsiDomain,
  displayName,
  recordingEmbedUrl,
  className,
}: ClassroomSessionMediaProps) {
  if (mode === "live-meet") {
    if (liveProvider === "jitsi" && jitsiRoomName) {
      return (
        <JitsiLiveEmbed
          roomName={jitsiRoomName}
          domain={jitsiDomain}
          displayName={displayName}
          className={className}
        />
      );
    }

    if (meetUrl) {
      return <MeetLivePanel meetUrl={meetUrl} className={className} />;
    }
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
