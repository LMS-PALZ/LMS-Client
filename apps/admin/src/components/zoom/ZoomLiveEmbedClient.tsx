"use client";

import { parseMeetingTarget } from "@/lib/classroom/meeting-url";
import { markLiveSessionEnded, markLiveSessionStarted } from "@ssu/queries";
import { cn } from "@ssu/utils";
import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface ZoomLiveEmbedClientProps {
  meetUrl: string;
  displayName?: string;
  role?: 0 | 1;
  meetingNumber?: string;
  className?: string;
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

const GALLERY_CANVAS_RATIO = 1 / 1.85;
const SINGLE_VIDEO_CANVAS_RATIO = 274 / 250;
const ZOOM_CHROME_HEIGHT = 150;

function canRenderGallery(): boolean {
  if (typeof window === "undefined") return false;
  return (
    typeof SharedArrayBuffer !== "undefined" &&
    window.crossOriginIsolated !== false
  );
}

export function ZoomLiveEmbedClient({
  meetUrl,
  displayName,
  role = 0,
  meetingNumber: meetingNumberProp,
  className,
  onLeave,
}: ZoomLiveEmbedClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onLeaveRef = useRef(onLeave);
  const [status, setStatus] = useState<"loading" | "joined" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stageHeight, setStageHeight] = useState(0);
  const [galleryMode, setGalleryMode] = useState<boolean | null>(null);

  useEffect(() => {
    onLeaveRef.current = onLeave;
  }, [onLeave]);

  useEffect(() => {
    if (status !== "joined") return;
    markLiveSessionStarted();
    return () => {
      markLiveSessionEnded();
    };
  }, [status]);

  const notifyEmbedResize = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { source: "ssu-zoom-embed-parent", type: "resize" },
      window.location.origin,
    );
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
      notifyEmbedResize();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      notifyEmbedResize();
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) return;
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const width = el.clientWidth;
      if (!width) return;

      const canvasRatio = canRenderGallery()
        ? GALLERY_CANVAS_RATIO
        : SINGLE_VIDEO_CANVAS_RATIO;
      const maxHeight = Math.min(window.innerHeight * 0.85, 900);
      const idealHeight = width * canvasRatio + ZOOM_CHROME_HEIGHT;

      setStageHeight(Math.round(Math.min(idealHeight, maxHeight)));
    };

    compute();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(compute);
    observer?.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [isFullscreen]);

  async function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {}
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
      const el = stageRef.current;
      const width = Math.floor(el?.clientWidth || 960);
      const height = Math.floor(el?.clientHeight || 560);
      return {
        viewWidth: Math.max(320, width),
        viewHeight: Math.max(240, height),
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
        gallery?: boolean;
      } | null;
      if (!data || data.source !== "ssu-zoom-embed") return;

      if (data.type === "ready") {
        iframeReady = true;
        postJoin();
        return;
      }

      if (data.type === "mode") {
        if (!cancelled) setGalleryMode(Boolean(data.gallery));
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

    async function fetchSignature(joinRole: 0 | 1) {
      const signatureRes = await fetch("/api/zoom/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingNumber,
          role: joinRole,
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

      return {
        signature: signatureBody.signature,
        sdkKey: signatureBody.sdkKey,
      };
    }

    async function prepareJoin() {
      try {
        setStatus("loading");
        setErrorMessage("");

        let auth: { signature: string; sdkKey: string };
        try {
          auth = await fetchSignature(role);
        } catch (hostError) {
          if (role === 1) {
            auth = await fetchSignature(0);
          } else {
            throw hostError;
          }
        }

        if (cancelled) return;

        joinPayload = {
          signature: auth.signature,
          sdkKey: auth.sdkKey,
          meetingNumber,
          password,
          userName: displayName?.trim() || "Host",
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
  }, [meetUrl, displayName, role, meetingNumberProp]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden bg-[#242424]",
        isFullscreen
          ? "h-full rounded-none"
          : cn("mx-auto rounded-[18px]", className),
      )}
    >
      <div
        ref={stageRef}
        style={
          !isFullscreen && stageHeight
            ? { height: `${stageHeight}px` }
            : undefined
        }
        className={cn("relative w-full", isFullscreen && "h-full")}
      >
        <iframe
          ref={iframeRef}
          title="Live session"
          src="/zoom-embed.html?v=38"
          className="h-full w-full border-0 bg-[#242424]"
          allow="camera; microphone; display-capture; autoplay; clipboard-write; fullscreen; cross-origin-isolated"
          allowFullScreen
        />

        {status === "loading" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#242424]/90">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <p className="mt-4 text-[14px] text-[#E8EAED]">
                Connecting to live session...
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#242424] px-6 text-center">
            <div>
              <p className="text-[16px] font-semibold text-white">
                Could not join live session
              </p>
              <p className="mt-2 max-w-md text-[14px] leading-6 text-[#BDC1C6]">
                {errorMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 px-3 pt-11">
        <div className="pointer-events-auto flex min-w-0 items-center gap-2 rounded-full bg-black/55 py-1 pl-1.5 pr-3 backdrop-blur-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5484D]/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#FF7A7A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E5484D]" />
            Live
          </span>
          <p className="truncate text-[12px] text-white/70">
            {status === "joined"
              ? ""
              : status === "error"
                ? "Not connected"
                : "Connecting..."}
          </p>
          {galleryMode === false && (
            <span
              className="shrink-0 rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-medium text-amber-300"
              title="This browser cannot use SharedArrayBuffer, so Zoom shows one video at a time instead of the gallery."
            >
              Single video
            </span>
          )}
        </div>

        {status !== "error" && (
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="pointer-events-auto inline-flex h-8 items-center gap-1.5 rounded-full bg-black/55 px-3 text-[12px] font-medium text-white backdrop-blur-sm transition hover:bg-black/75"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
