"use client";

import { useClassroomPlayback } from "@/contexts/ClassroomPlaybackContext";
import type { ClassroomCourseDetail } from "@/lib/classroom/types";
import { cn } from "@ssu/utils";
import { DashboardEmptyState } from "@ssu/ui";
import { Video } from "lucide-react";
import { useState } from "react";

export function ClassroomRecordingPage({
  course,
}: {
  course: ClassroomCourseDetail;
}) {
  const { playRecording } = useClassroomPlayback();

  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(
    null,
  );

  if (course.sessionPhase === "live") {
    return (
      <DashboardEmptyState
        icon={Video}
        title="Class is live"
        description="Join the live session from the player above."
      />
    );
  }

  if (!course.recordings || course.recordings.length === 0) {
    return (
      <DashboardEmptyState
        icon={Video}
        title="No recording available"
        description="A recording for this class is not available yet."
      />
    );
  }

  return (
    <div className="space-y-3">
      {course.recordings.map((recording) => {
        const isActive = activeRecordingId === recording.id;

        return (
          <button
            key={recording.id}
            type="button"
            onClick={() => {
              setActiveRecordingId(recording.id);
              playRecording(recording.recordingUrl);
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-[12px] border px-4 py-3 text-left transition",
              isActive
                ? "border-[#D4E2D8] bg-[#F3FAF5]"
                : "border-[#E8EDF5] bg-white hover:border-[#D4E2D8] hover:bg-[#FAFBFD]",
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ECF0F7] text-[#4E845F]">
              <Video className="h-4 w-4" />
            </span>

            <div className="flex flex-col">
              <span className="text-[14px] font-medium text-[#1D1D1D]">
                {recording.title}
              </span>

              {recording.duration ? (
                <span className="text-[12px] text-[#6B7280]">
                  {recording.duration} mins
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
