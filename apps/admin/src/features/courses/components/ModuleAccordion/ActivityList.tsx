import type {
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import { Pencil, Trash2 } from "lucide-react";
import type {
  ModuleAccordionMode,
  ModuleActivityHandlers,
} from "../../types/activity";
import { ActionButton } from "./ActionButton";
import { ActivityIcon } from "./ActivityIcon";

interface ActivityListProps extends ModuleActivityHandlers {
  module: ProgramClassroomModule;
  lessons: ProgramClassroomLesson[];
  mode: ModuleAccordionMode;
}

export function ActivityList({
  module,
  lessons,
  mode,
  onEditActivity,
  onDeleteActivity,
}: ActivityListProps) {
  const isEdit = mode === "edit";

  return (
    <div className="space-y-2">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="flex items-center gap-3 border-b border-[#EEF2F6] bg-white py-3 last:border-b-0"
        >
          <ActivityIcon lessonType={lesson.lessonType} />
          <span className="min-w-0 flex-1 truncate text-[14px] font-normal text-[#1D1D1D]">
            {lesson.title}
          </span>
          {isEdit && (
            <div className="flex items-center gap-2">
              <ActionButton
                label="Edit activity"
                onClick={() => onEditActivity?.(module, lesson)}
              >
                <Pencil className="h-4 w-4" strokeWidth={1.75} />
              </ActionButton>
              <ActionButton
                label="Delete activity"
                tone="danger"
                onClick={() => onDeleteActivity?.(module, lesson)}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </ActionButton>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
