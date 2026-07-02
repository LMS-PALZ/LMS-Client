import type {
  ClassroomLessonType,
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type ModuleAccordionMode = "view" | "edit";

export type UploadSourceMode = "device" | "url";

export interface ActivityTypeOption {
  id: ClassroomLessonType;
  label: string;
  icon: LucideIcon;
}

export interface PendingLessonDelete {
  module: ProgramClassroomModule;
  lesson: ProgramClassroomLesson;
}

export type OnEditActivity = (
  module: ProgramClassroomModule,
  lesson: ProgramClassroomLesson,
) => void;

export type OnDeleteActivity = OnEditActivity;

export interface ModuleActivityHandlers {
  onEditActivity?: OnEditActivity;
  onDeleteActivity?: OnDeleteActivity;
}

export interface ModuleAccordionProps extends ModuleActivityHandlers {
  modules: ProgramClassroomModule[];
  expandedModuleId: string | null;
  onToggleModule: (moduleId: string) => void;
  mode?: ModuleAccordionMode;
  onEditModule?: (module: ProgramClassroomModule) => void;
  onDeleteModule?: (module: ProgramClassroomModule) => void;
  onAddActivity?: (module: ProgramClassroomModule) => void;
}

export interface CourseActivityShellProps {
  activityType: ClassroomLessonType;
  activityTypes: ActivityTypeOption[];
  onActivityTypeChange: (type: ClassroomLessonType) => void;
  children: ReactNode;
  disableTypeSwitch?: boolean;
}

export interface ReadingActivityFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  titlePlaceholder?: string;
}

export interface LiveSessionActivityFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  meetingLink: string;
  onMeetingLinkChange: (value: string) => void;
  sessionDate: Date | null;
  onSessionDateChange: (value: Date | null) => void;
  sessionTime: string | null;
  onSessionTimeChange: (value: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  recordingUrl: string;
  onRecordingUrlChange: (value: string) => void;
  titlePlaceholder?: string;
}

export interface ActivityFormState {
  activityType: ClassroomLessonType;
  title: string;
  overview: string;
  meetingLink: string;
  sessionDate: Date | null;
  sessionTime: string | null;
  description: string;
  recordingUrl: string;
}
