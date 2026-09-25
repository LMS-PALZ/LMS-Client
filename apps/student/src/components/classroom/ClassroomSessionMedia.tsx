"use client";

import { parseMeetingTarget } from "@/lib/classroom/meeting-url";
import { AlertBanner, DashboardEmptyState, LiveIndicator } from "@ssu/ui";
import { cn } from "@ssu/utils";
import dynamic from "next/dynamic";
import { Video } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { MeetingIframeEmbed } from "./MeetingIframeEmbed";

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
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
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
