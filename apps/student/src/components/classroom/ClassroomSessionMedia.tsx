"use client";

import { DashboardEmptyState } from "@ssu/ui";
import {
  CLASS_ENDED_LABEL,
  CLASS_NOT_STARTED_LABEL,
  cn,
  isGoogleDriveUrl,
  JOIN_LIVE_CLASS_LABEL,
  toGoogleDriveOpenUrl,
} from "@ssu/utils";
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

function openExternalWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

// The embedded Drive player can't see the student's Google sign-in, so Drive
// may refuse to play it. We can't read the player to detect that, so always
// offer a full-tab fallback where sign-in works.
function DriveOpenFallback({ url }: { url: string }) {
  return (
    <div className="mt-3 grid grid-cols-[3fr_2fr] items-center gap-4 rounded-[12px] bg-[#F3F6F8] px-4 py-3">
      <p className="text-[16px] font-medium text-[#4B5563]">
        Video not playing? Open it in a new chrome tab.
      </p>
      <button
        type="button"
        onClick={() => openExternalWindow(toGoogleDriveOpenUrl(url))}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#4E845F]/15 px-6 py-3 text-[16px] font-semibold text-[#4E845F] transition hover:bg-[#3D6E4D] hover:text-white"
      >
        Open in new tab (Pop out)
      </button>
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

  const isDrive = isGoogleDriveUrl(url);

  if (status === "error") {
    return (
      <VideoFrame className={className}>
        <DashboardEmptyState
          icon={Video}
          title="Something went wrong"
          description="Open the recording in a new tab."
        />
        <button
          type="button"
          onClick={() =>
            openExternalWindow(isDrive ? toGoogleDriveOpenUrl(url) : url)
          }
          className="mt-4 inline-flex items-center rounded-full bg-[#4E845F] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#3D6E4D]"
        >
          Open in new tab
        </button>
      </VideoFrame>
    );
  }

  return (
    <div className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-[18px] bg-[#1D1D1D]">
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
      {isDrive ? <DriveOpenFallback url={url} /> : null}
    </div>
  );
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
        title={JOIN_LIVE_CLASS_LABEL}
        description="Opens in a new window."
      />
      <button
        type="button"
        onClick={() => openExternalWindow(meetUrl)}
        className="mt-4 inline-flex items-center rounded-full bg-[#4E845F] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#3D6E4D]"
      >
        {JOIN_LIVE_CLASS_LABEL}
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
          title="Not available"
          description="Go back and try again."
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
            title="Not available"
            description="Go back and try again."
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
          title={CLASS_ENDED_LABEL}
          description="Nothing to play right now."
        />
      </VideoFrame>
    );
  }

  return (
    <VideoFrame className={className}>
      <DashboardEmptyState
        icon={Video}
        title={CLASS_NOT_STARTED_LABEL}
        description="Session has ended or not started yet."
      />
    </VideoFrame>
  );
}
