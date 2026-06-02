"use client";

import { LiveIndicator } from "@ssu/ui";
import { cn } from "@ssu/utils";
import { Video } from "lucide-react";

export interface MeetLivePanelProps {
  meetUrl: string;
  className?: string;
}

export function MeetLivePanel({ meetUrl, className }: MeetLivePanelProps) {
  const openMeet = () => {
    window.open(meetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={cn(
        "flex min-h-[360px] flex-col items-center justify-center rounded-[18px] bg-[#202124] px-6 py-10 text-center",
        className,
      )}
    >
      <div className="rounded-full bg-[#3c4043] p-5">
        <Video className="h-10 w-10 text-white" aria-hidden />
      </div>
      <div className="mt-6 flex flex-col items-center gap-3">
        <LiveIndicator label="Live" size="md" tone="overlay" />
        <h2 className="text-[22px] font-medium text-white md:text-[24px]">
          Class is ready
        </h2>
      </div>
      <p className="mt-3 max-w-md text-[14px] leading-6 text-[#9aa0a6]">
        Google Meet cannot run inside this page for security reasons. Select
        below to open the class in Google Meet and join with your camera and
        microphone.
      </p>
      <button
        type="button"
        onClick={openMeet}
        className="mt-8 rounded-full bg-[#1a73e8] px-8 py-3 text-[15px] font-medium text-white transition hover:bg-[#1765cc]"
      >
        Join live class
      </button>
      <p className="mt-4 text-[12px] text-[#9aa0a6]">
        Opens Google Meet in a new browser tab
      </p>
    </div>
  );
}
