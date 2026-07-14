import type {
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import { adminPath } from "@ssu/config/portal-paths";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
  courseId?: string;
}

export function ActivityList({
  module,
  lessons,
  mode,
  courseId,
  onEditActivity,
  onDeleteActivity,
}: ActivityListProps) {
  const isEdit = mode === "edit";

  return (
    <div className="space-y-2">
      {lessons.map((lesson) => {
        const detailHref =
          courseId && !isEdit
            ? adminPath(
                `/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`,
              )
            : null;

        const rowContent = (
          <>
            <ActivityIcon lessonType={lesson.lessonType} />
            <span className="min-w-0 flex-1 truncate text-[14px] font-normal text-[#1D1D1D]">
              {lesson.title}
            </span>
            {detailHref ? (
              <ChevronRight className="h-4 w-4 shrink-0 text-[#94A3B8]" />
            ) : null}
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
          </>
        );

        if (detailHref) {
          return (
            <Link
              key={lesson.id}
              href={detailHref}
              className="flex items-center gap-3 border-b border-[#EEF2F6] bg-white py-3 last:border-b-0 transition-colors hover:bg-[#F8FAFC]"
            >
              {rowContent}
            </Link>
          );
        }

        return (
          <div
            key={lesson.id}
            className="flex items-center gap-3 border-b border-[#EEF2F6] bg-white py-3 last:border-b-0"
          >
            {rowContent}
          </div>
        );
      })}
    </div>
  );
}
