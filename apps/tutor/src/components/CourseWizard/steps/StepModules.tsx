import { Button } from "@ssu/ui";
import type { ReactNode } from "react";
import type { CourseModuleDraft } from "../types";

export interface StepModulesProps {
  modules: CourseModuleDraft[];
  onAdd: () => void;
  list: ReactNode;
}

export function StepModules({
  modules: _modules,
  onAdd,
  list,
}: StepModulesProps) {
  return (
    <div className="space-y-4">
      <p className="text-body text-neutral-600">
        Drag modules to reorder. Add live, recorded, or reading blocks.
      </p>
      {list}
      <Button type="button" variant="secondary" onClick={onAdd}>
        Add module
      </Button>
    </div>
  );
}
