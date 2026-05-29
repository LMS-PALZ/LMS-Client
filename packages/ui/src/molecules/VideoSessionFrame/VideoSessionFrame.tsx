import { cn } from "@ssu/utils";
import { Play } from "lucide-react";
import type { ReactNode } from "react";
import { CountdownBlocks } from "../CountdownBlocks";

export type VideoSessionFrameState = "countdown" | "live" | "ended";

export interface VideoSessionFrameProps {
  state: VideoSessionFrameState;
  embedUrl?: string;
  countdown?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  endedMessage?: string;
  footer?: ReactNode;
  className?: string;
}

export function VideoSessionFrame({
  state,
  embedUrl,
  countdown,
  endedMessage = "This live session has ended. You can check the recording to watch again.",
  footer,
  className,
}: VideoSessionFrameProps) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full rounded-2xl bg-neutral-100 overflow-hidden flex flex-col items-center justify-center",
        className,
      )}
    >
      {state === "live" && embedUrl ? (
        <iframe
          title="Live session"
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          allow="camera; microphone; fullscreen"
        />
      ) : state === "countdown" && countdown ? (
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="rounded-full bg-brand-green-100 p-4">
            <Play className="h-8 w-8 text-brand-green" />
          </div>
          <p className="text-body font-medium text-neutral-700">
            Session starts in
          </p>
          <CountdownBlocks {...countdown} />
          {footer}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8 text-center max-w-md">
          <Play className="h-10 w-10 text-neutral-400" />
          <p className="text-body text-neutral-600">{endedMessage}</p>
        </div>
      )}
    </div>
  );
}
