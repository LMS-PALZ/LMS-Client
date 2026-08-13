"use client";

import { parseMeetingTarget } from "@/lib/classroom/meeting-url";
import { cn } from "@ssu/utils";
import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface ZoomLiveEmbedClientProps {
  meetUrl: string;
  displayName?: string;
  /** Fallback when meetUrl does not contain a meeting id (e.g. only zoomMeetingId from API). */
  meetingNumber?: string;
  className?: string;
  /** Called when the user leaves or the meeting ends. */
  onLeave?: () => void;
}

function zoomErrorMessage(error: unknown): string {
  if (!error) return "Unable to join the Zoom meeting.";

  const text =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : typeof error === "object"
          ? [
              (error as { reason?: string }).reason,
              (error as { errorMessage?: string }).errorMessage,
              (error as { message?: string }).message,
              (error as { type?: string }).type,
              (error as { errorCode?: number | string }).errorCode != null
                ? `code ${(error as { errorCode?: number | string }).errorCode}`
                : null,
            ]
              .filter(Boolean)
              .join(" — ")
          : "";

  const normalized = text || "Unable to join the Zoom meeting.";
  const isSignatureInvalid =
    /signature is invalid/i.test(normalized) ||
    /\b3712\b/.test(normalized) ||
    /\b3172\b/.test(normalized);

  if (isSignatureInvalid) {
    return `${normalized}. In Zoom Marketplace → your app → Features → Embed, enable Meeting SDK, then use that app’s Client ID/Secret in ZOOM_MEETING_SDK_CLIENT_ID and ZOOM_MEETING_SDK_CLIENT_SECRET.`;
  }

  return normalized;
}

/**
 * Runs Zoom inside an iframe so Zoom's CDN React/vendor scripts cannot
 * overwrite the host Next.js React tree (which was logging students out).
 */
export function ZoomLiveEmbedClient({
  meetUrl,
  displayName,
  meetingNumber: meetingNumberProp,
  className,
  onLeave,
}: ZoomLiveEmbedClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onLeaveRef = useRef(onLeave);
  const [status, setStatus] = useState<"loading" | "joined" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    onLeaveRef.current = onLeave;
  }, [onLeave]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  async function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      // Browser may block fullscreen without a user gesture or policy.
    }
  }

  useEffect(() => {
    const target = parseMeetingTarget(meetUrl);
    const meetingNumber =
      (meetingNumberProp || "").replace(/\D/g, "") ||
      (target?.kind === "zoom" ? target.meetingNumber : "");
    const password = target?.kind === "zoom" ? (target.password ?? "") : "";

    if (!meetingNumber) {
      setStatus("error");
      setErrorMessage("Invalid Zoom meeting link.");
      return;
    }

    let cancelled = false;
    let iframeReady = false;
    let joinSent = false;
    let joinPayload: {
      signature: string;
      sdkKey: string;
      meetingNumber: string;
      password: string;
      userName: string;
      viewWidth: number;
      viewHeight: number;
    } | null = null;

    const pingIframe = () => {
      iframeRef.current?.contentWindow?.postMessage(
        { source: "ssu-zoom-embed-parent", type: "ping" },
        window.location.origin,
      );
    };

    const readEmbedSize = () => {
      const el = containerRef.current;
      const width = Math.floor(el?.clientWidth || 960);
      const height = Math.floor(el?.clientHeight || 560);
      return {
        viewWidth: Math.max(720, width),
        viewHeight: Math.max(405, height),
      };
    };

    const postJoin = () => {
      if (
        cancelled ||
        joinSent ||
        !iframeReady ||
        !joinPayload ||
        !iframeRef.current?.contentWindow
      ) {
        return;
      }
      joinSent = true;
      iframeRef.current.contentWindow.postMessage(
        {
          source: "ssu-zoom-embed-parent",
          type: "join",
          payload: joinPayload,
        },
        window.location.origin,
      );
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as {
        source?: string;
        type?: string;
        message?: string;
      } | null;
      if (!data || data.source !== "ssu-zoom-embed") return;

      if (data.type === "ready") {
        iframeReady = true;
        postJoin();
        return;
      }

      if (data.type === "joined") {
        if (!cancelled) setStatus("joined");
        return;
      }

      if (data.type === "left") {
        if (cancelled) return;
        if (document.fullscreenElement) {
          void document.exitFullscreen().catch(() => undefined);
        }
        onLeaveRef.current?.();
        return;
      }

      if (data.type === "error") {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(zoomErrorMessage(data.message || data));
      }
    };

    window.addEventListener("message", onMessage);
    pingIframe();

    async function prepareJoin() {
      try {
        setStatus("loading");
        setErrorMessage("");

        const signatureRes = await fetch("/api/zoom/signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingNumber,
            role: 0,
          }),
        });

        const signatureBody = (await signatureRes.json().catch(() => ({}))) as {
          signature?: string;
          sdkKey?: string;
          message?: string;
        };

        if (!signatureRes.ok) {
          throw new Error(
            signatureBody.message ||
              "Unable to authorize the Zoom meeting. Check SDK credentials.",
          );
        }

        if (!signatureBody.signature || !signatureBody.sdkKey) {
          throw new Error("Zoom signature response was incomplete.");
        }

        if (cancelled) return;

        joinPayload = {
          signature: signatureBody.signature,
          sdkKey: signatureBody.sdkKey,
          meetingNumber,
          password,
          userName: displayName?.trim() || "Student",
          ...readEmbedSize(),
        };
        postJoin();
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(zoomErrorMessage(error));
      }
    }

    void prepareJoin();

    return () => {
      cancelled = true;
      window.removeEventListener("message", onMessage);
    };
  }, [meetUrl, displayName, meetingNumberProp]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full bg-[#202124]",
        isFullscreen ? "h-full" : className,
      )}
    >
      <iframe
        ref={iframeRef}
        title="Live class"
        src="/zoom-embed.html?v=14"
        className={cn(
          "w-full overflow-hidden border-0 bg-[#202124]",
          isFullscreen
            ? "h-full min-h-0 rounded-none"
            : "min-h-[560px] rounded-[18px]",
        )}
        allow="camera; microphone; display-capture; autoplay; clipboard-write; fullscreen"
        allowFullScreen
      />

      {status !== "error" && (
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      )}

      {status === "loading" && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center bg-[#202124]/90",
            !isFullscreen && "rounded-[18px]",
          )}
        >
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="mt-4 text-[14px] text-[#E8EAED]">
              Connecting to live class...
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-[#202124] px-6 text-center",
            !isFullscreen && "rounded-[18px]",
          )}
        >
          <div>
            <p className="text-[16px] font-semibold text-white">
              Could not join live class
            </p>
            <p className="mt-2 max-w-md text-[14px] leading-6 text-[#BDC1C6]">
              {errorMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
