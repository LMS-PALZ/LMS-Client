"use client";

import type {
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import { cn } from "@ssu/utils";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Pencil,
  Radio,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import { AddItemLink } from "./AddItemLink";

interface ModuleAccordionProps {
  modules: ProgramClassroomModule[];
  expandedModuleId: string | null;
  onToggleModule: (moduleId: string) => void;
  mode?: "view" | "edit";
  onEditModule?: (module: ProgramClassroomModule) => void;
  onDeleteModule?: (module: ProgramClassroomModule) => void;
  onEditActivity?: (
    module: ProgramClassroomModule,
    lesson: ProgramClassroomLesson,
  ) => void;
  onDeleteActivity?: (
    module: ProgramClassroomModule,
    lesson: ProgramClassroomLesson,
  ) => void;
  onAddActivity?: (module: ProgramClassroomModule) => void;
}

function ActivityIcon({ lessonType }: { lessonType: string }) {
  const className = "h-[18px] w-[18px] shrink-0 text-[#4C7D5B]";
  if (lessonType === "live_session") {
    return <Radio className={className} aria-hidden />;
  }
  return <FileText className={className} aria-hidden />;
}

function ActionButton({
  label,
  onClick,
  tone = "default",
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "p-0.5 transition",
        tone === "danger"
          ? "text-[#64748B] hover:text-[#C62828]"
          : "text-[#64748B] hover:text-[#1D1D1D]",
      )}
    >
      {children}
    </button>
  );
}

function ExpandToggle({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={expanded ? "Collapse module" : "Expand module"}
      aria-expanded={expanded}
      onClick={onToggle}
      className="shrink-0 p-1 text-[#64748B] transition hover:text-[#1D1D1D]"
    >
      {expanded ? (
        <ChevronUp className="h-5 w-5" strokeWidth={3} />
      ) : (
        <ChevronDown className="h-5 w-5" strokeWidth={3} />
      )}
    </button>
  );
}

function ModuleHeader({
  module,
  expanded,
  lessons,
  isEdit,
  onToggleModule,
  onEditModule,
  onDeleteModule,
}: {
  module: ProgramClassroomModule;
  expanded: boolean;
  lessons: ProgramClassroomLesson[];
  isEdit: boolean;
  onToggleModule: (moduleId: string) => void;
  onEditModule?: (module: ProgramClassroomModule) => void;
  onDeleteModule?: (module: ProgramClassroomModule) => void;
}) {
  return (
    <div className="flex items-center gap-3 bg-white px-5 py-[18px]">
      <button
        type="button"
        onClick={() => onToggleModule(module.id)}
        className="min-w-0 flex-1 text-left"
      >
        <p className="truncate text-[15px] font-normal text-[#1D1D1D]">
          {module.title}
        </p>
        {!isEdit && expanded && lessons.length > 0 && (
          <p className="mt-0.5 text-[13px] text-[#64748B]">
            {lessons.length} activit{lessons.length === 1 ? "y" : "ies"}
          </p>
        )}
      </button>

      {isEdit && (
        <div className="flex items-center gap-2">
          <ActionButton
            label="Edit module"
            onClick={() => onEditModule?.(module)}
          >
            <Pencil className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </ActionButton>
          <ActionButton
            label="Delete module"
            tone="danger"
            onClick={() => onDeleteModule?.(module)}
          >
            <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </ActionButton>
        </div>
      )}

      <ExpandToggle
        expanded={expanded}
        onToggle={() => onToggleModule(module.id)}
      />
    </div>
  );
}

function ActivityList({
  module,
  lessons,
  isEdit,
  onEditActivity,
  onDeleteActivity,
}: {
  module: ProgramClassroomModule;
  lessons: ProgramClassroomLesson[];
  isEdit: boolean;
  onEditActivity?: (
    module: ProgramClassroomModule,
    lesson: ProgramClassroomLesson,
  ) => void;
  onDeleteActivity?: (
    module: ProgramClassroomModule,
    lesson: ProgramClassroomLesson,
  ) => void;
}) {
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

function ModuleList({
  modules,
  expandedModuleId,
  onToggleModule,
  mode,
  onEditModule,
  onDeleteModule,
  onEditActivity,
  onDeleteActivity,
  onAddActivity,
}: ModuleAccordionProps) {
  const isEdit = mode === "edit";

  return (
    <div className="overflow-hidden rounded-[14px] bg-[#EEF2F6]">
      {modules.map((module, index) => {
        const expanded = expandedModuleId === module.id;
        const lessons = module.lessons ?? [];
        const isLast = index === modules.length - 1;

        return (
          <div
            key={module.id}
            className={cn(!isLast && "border-b border-[#E2E8F0]")}
          >
            <ModuleHeader
              module={module}
              expanded={expanded}
              lessons={lessons}
              isEdit={isEdit}
              onToggleModule={onToggleModule}
              onEditModule={onEditModule}
              onDeleteModule={onDeleteModule}
            />

            {expanded && (
              <div className="border-t border-[#E2E8F0] bg-white px-5 py-4">
                {lessons.length === 0 && !isEdit ? (
                  <p className="text-[14px] text-[#94A3B8]">
                    No activities yet.
                  </p>
                ) : null}

                {lessons.length > 0 && (
                  <div className={cn(isEdit && onAddActivity && "mb-3")}>
                    <ActivityList
                      module={module}
                      lessons={lessons}
                      isEdit={isEdit}
                      onEditActivity={onEditActivity}
                      onDeleteActivity={onDeleteActivity}
                    />
                  </div>
                )}

                {isEdit && onAddActivity && (
                  <AddItemLink
                    label="Add activity"
                    onClick={() => onAddActivity(module)}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ModuleAccordion(props: ModuleAccordionProps) {
  return <ModuleList {...props} />;
}
