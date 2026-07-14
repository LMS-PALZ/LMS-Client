"use client";

import { parseMeetingTarget } from "@/lib/classroom/meeting-url";
import { loadZoomEmbeddedSdk } from "@/lib/zoom/load-embedded-sdk";
import { cn } from "@ssu/utils";
import { useEffect, useRef, useState } from "react";

export interface ZoomLiveEmbedClientProps {
  meetUrl: string;
  displayName?: string;
  /** 0 = attendee, 1 = host/tutor */
  role?: 0 | 1;
  meetingNumber?: string;
  className?: string;
}

export function ZoomLiveEmbedClient({
  meetUrl,
  displayName,
  role = 1,
  meetingNumber: meetingNumberProp,
  className,
}: ZoomLiveEmbedClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomSdkRef = useRef<Awaited<
    ReturnType<typeof loadZoomEmbeddedSdk>
  > | null>(null);
  const [status, setStatus] = useState<"loading" | "joined" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

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

    async function joinMeeting() {
      try {
        setStatus("loading");
        setErrorMessage("");

        const signatureRes = await fetch("/api/zoom/signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingNumber,
            role,
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

        const zoomSdk = await loadZoomEmbeddedSdk();
        if (cancelled || !containerRef.current) return;

        zoomSdkRef.current = zoomSdk;
        const client = zoomSdk.createClient();

        await client.init({
          zoomAppRoot: containerRef.current,
          language: "en-US",
          patchJsMedia: true,
          leaveOnPageUnload: true,
        });

        if (cancelled) return;

        await client.join({
          signature: signatureBody.signature,
          sdkKey: signatureBody.sdkKey,
          meetingNumber,
          password,
          userName: displayName?.trim() || "Host",
        });

        if (!cancelled) {
          setStatus("joined");
        }
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to join the Zoom meeting.",
        );
      }
    }

    void joinMeeting();

    return () => {
      cancelled = true;
      try {
        zoomSdkRef.current?.destroyClient();
      } catch {
        /* ignore cleanup errors */
      }
      zoomSdkRef.current = null;
    };
  }, [meetUrl, displayName, role, meetingNumberProp]);

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={containerRef}
        className="min-h-[560px] w-full overflow-hidden rounded-[18px] bg-[#202124]"
      />

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[18px] bg-[#202124]/90">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="mt-4 text-[14px] text-[#E8EAED]">
              Connecting to live session...
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[18px] bg-[#202124] px-6 text-center">
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
  );
}
