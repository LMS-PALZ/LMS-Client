"use client";

import { useClassroomPlayback } from "@/contexts/ClassroomPlaybackContext";
import type { ClassroomCourseDetail } from "@/lib/classroom-data";
import { isRecordingAvailable } from "@/lib/classroom-data";
import { cn } from "@ssu/utils";
import { DashboardEmptyState } from "@ssu/ui";
import { Video } from "lucide-react";

export function ClassroomRecordingPage({
  course,
}: {
  course: ClassroomCourseDetail;
}) {
  const { recordingEmbedUrl, playRecording } = useClassroomPlayback();

  if (!isRecordingAvailable(course.sessionPhase)) {
    return (
      <DashboardEmptyState
        icon={Video}
        title="No recording available"
        description={
          course.sessionPhase === "live"
            ? "This class is in session. Join live from the player above."
            : "This class has not started yet. Recordings appear here after the session ends."
        }
      />
    );
  }

  const embedUrl = course.recordingEmbedUrl;
  if (!embedUrl) {
    return (
      <DashboardEmptyState
        icon={Video}
        title="No recording available"
        description="A recording for this class is not available yet."
      />
    );
  }

  const recordingTitle = course.recordingTitle ?? course.title;
  const isActive = recordingEmbedUrl === embedUrl;

  return (
    <button
      type="button"
      onClick={() => playRecording(embedUrl)}
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
      <span className="text-[14px] font-medium text-[#1D1D1D]">
        {recordingTitle}
      </span>
    </button>
  );
}
