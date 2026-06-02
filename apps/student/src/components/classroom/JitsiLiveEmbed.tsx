"use client";

import { cn } from "@ssu/utils";
import { useEffect, useRef, useState } from "react";

const JITSI_SCRIPT = "https://meet.jit.si/external_api.js";
const EMBED_HEIGHT_PX = 560;

type JitsiApi = { dispose: () => void };

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (
      domain: string,
      options: Record<string, unknown>,
    ) => JitsiApi;
  }
}

function loadJitsiScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.JitsiMeetExternalAPI) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${JITSI_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = JITSI_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Jitsi Meet"));
    document.body.appendChild(script);
  });
}

export interface JitsiLiveEmbedProps {
  roomName: string;
  domain?: string;
  displayName?: string;
  className?: string;
}

export function JitsiLiveEmbed({
  roomName,
  domain = "meet.jit.si",
  displayName,
  className,
}: JitsiLiveEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !roomName) return;

    let cancelled = false;
    setError(null);

    const mount = () => {
      const node = containerRef.current;
      if (!node || cancelled || !window.JitsiMeetExternalAPI) return;

      const height = node.clientHeight || EMBED_HEIGHT_PX;

      apiRef.current?.dispose();
      node.replaceChildren();

      apiRef.current = new window.JitsiMeetExternalAPI(domain, {
        roomName,
        parentNode: node,
        width: "100%",
        height,
        userInfo: displayName ? { displayName } : undefined,
        configOverwrite: {
          prejoinPageEnabled: true,
          startWithAudioMuted: true,
        },
        interfaceConfigOverwrite: {
          MOBILE_APP_PROMO: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
        },
      });
    };

    loadJitsiScript()
      .then(() => {
        if (cancelled) return;
        mount();
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load the live classroom. Try again in a moment.");
        }
      });

    return () => {
      cancelled = true;
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [roomName, domain, displayName]);

  if (error) {
    return (
      <div
        className={cn(
          "flex h-[560px] items-center justify-center rounded-[18px] bg-[#202124] px-6 text-center text-[14px] text-[#e8eaed]",
          className,
        )}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-[18px] bg-[#202124]",
        className,
      )}
      style={{ height: EMBED_HEIGHT_PX }}
    />
  );
}
