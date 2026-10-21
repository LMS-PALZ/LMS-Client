import { Radio, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ClassroomLessonType } from "@ssu/types";

/** UI choice on the activity page. Both save as `live_session` to the API. */
export type ActivitySessionMode = "live_class" | "prerecorded" | "reading";

export interface ActivitySessionOption {
  id: Exclude<ActivitySessionMode, "reading">;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const ACTIVITY_SESSION_OPTIONS: ActivitySessionOption[] = [
  {
    id: "live_class",
    label: "Live class",
    description:
      "Schedule a Zoom session. Students join when the class starts.",
    icon: Radio,
  },
  {
    id: "prerecorded",
    label: "Pre-recorded video",
    description: "Paste a recording URL. No Zoom link is created for students.",
    icon: Video,
  },
];

export function sessionModeToLessonType(
  mode: ActivitySessionMode,
): ClassroomLessonType {
  return mode === "reading" ? "reading" : "live_session";
}

export function lessonToSessionMode(lesson: {
  lessonType?: string;
  recordingUrl?: string | null;
}): ActivitySessionMode {
  if (lesson.lessonType === "reading") return "reading";
  if (lesson.recordingUrl?.trim()) return "prerecorded";
  return "live_class";
}

export function sessionModeLabel(mode: ActivitySessionMode): string {
  switch (mode) {
    case "live_class":
      return "Live class";
    case "prerecorded":
      return "Pre-recorded video";
    case "reading":
      return "Reading";
  }
}
