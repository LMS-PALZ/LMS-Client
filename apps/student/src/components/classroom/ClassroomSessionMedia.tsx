"use client";

import { AlertBanner, DashboardEmptyState } from "@ssu/ui";
import { cn } from "@ssu/utils";
import { Video } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

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

function VideoFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[360px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[#C5D2E1] bg-[#F8FAFC] px-6 text-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

function RecordingEmbed({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    setStatus("loading");
    const timer = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "error" : current));
    }, 20000);
    return () => window.clearTimeout(timer);
  }, [url]);

  if (status === "error") {
    return (
      <VideoFrame className={className}>
        <AlertBanner variant="error" title="Could not load this class">
          The class video did not load. Check your connection and try again.
        </AlertBanner>
      </VideoFrame>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-[18px] bg-[#1D1D1D]",
        className,
      )}
    >
      {status === "loading" ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-[14px] font-medium text-white">Please wait...</p>
        </div>
      ) : null}
      <iframe
        {...CREDENTIALLESS}
        title="Class recording"
        src={url}
        onLoad={() => setStatus("ready")}
        onError={() => setStatus("error")}
        className={cn(
          "absolute inset-0 h-full w-full border-0",
          status === "loading" && "opacity-0",
        )}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

function openMeetingWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function LiveMeetingLaunch({
  meetUrl,
  className,
}: {
  meetUrl: string;
  className?: string;
}) {
  return (
    <VideoFrame className={className}>
      <DashboardEmptyState
        icon={Video}
        title="Join the live class"
        description="The Zoom meeting opens in a new window so you can join outside this app."
      />
      <button
        type="button"
        onClick={() => openMeetingWindow(meetUrl)}
        className="mt-4 inline-flex items-center rounded-full bg-[#4E845F] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#3D6E4D]"
      >
        Join live session
      </button>
    </VideoFrame>
  );
}

export function ClassroomSessionMedia({
  mode,
  meetUrl,
  recordingEmbedUrl,
  className,
}: ClassroomSessionMediaProps) {
  if (mode === "live-meet") {
    if (meetUrl) {
      return <LiveMeetingLaunch meetUrl={meetUrl} className={className} />;
    }

    return (
      <VideoFrame className={className}>
        <DashboardEmptyState
          icon={Video}
          title="Meeting link not available"
          description="This session is live, but no join link was provided. Please contact your instructor or check back shortly."
        />
      </VideoFrame>
    );
  }

  if (mode === "recording-embed") {
    if (!recordingEmbedUrl) {
      return (
        <VideoFrame className={className}>
          <DashboardEmptyState
            icon={Video}
            title="No class video yet"
            description="A recording for this class is not available yet."
          />
        </VideoFrame>
      );
    }

    return <RecordingEmbed url={recordingEmbedUrl} className={className} />;
  }

  if (mode === "ended-placeholder") {
    return (
      <VideoFrame className={className}>
        <DashboardEmptyState
          icon={Video}
          title="This class has ended"
          description="A recording for this class is not available yet."
        />
      </VideoFrame>
    );
  }

  return (
    <VideoFrame className={className}>
      <DashboardEmptyState
        icon={Video}
        title="No class video yet"
        description="This session does not have a recording or a live meeting link."
      />
    </VideoFrame>
  );
}
