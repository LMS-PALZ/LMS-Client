import type {
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import { Pencil } from "lucide-react";
// import { Trash2 } from "lucide-react"; // restore with delete module button
import type { ModuleAccordionMode } from "../../types/activity";
import { ActionButton } from "./ActionButton";
import { ExpandToggle } from "./ExpandToggle";

interface ModuleHeaderProps {
  module: ProgramClassroomModule;
  expanded: boolean;
  lessons: ProgramClassroomLesson[];
  mode: ModuleAccordionMode;
  onToggleModule: (moduleId: string) => void;
  onEditModule?: (module: ProgramClassroomModule) => void;
  /** Hidden until module DELETE exists. */
  onDeleteModule?: (module: ProgramClassroomModule) => void;
}

export function ModuleHeader({
  module,
  expanded,
  lessons,
  mode,
  onToggleModule,
  onEditModule,
}: ModuleHeaderProps) {
  const isEdit = mode === "edit";

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
          {/* Module DELETE is not available yet — hide until backend supports it.
          <ActionButton
            label="Delete module"
            tone="danger"
            onClick={() => onDeleteModule?.(module)}
          >
            <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </ActionButton>
          */}
        </div>
      )}

      <ExpandToggle
        expanded={expanded}
        onToggle={() => onToggleModule(module.id)}
      />
    </div>
  );
}
