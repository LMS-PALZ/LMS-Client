import { useEffect, useRef, useState } from "react";
import type { ProgramClassroomModule } from "@ssu/types";

export function useExpandedModule(modules: ProgramClassroomModule[]) {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const hasInitializedExpand = useRef(false);

  useEffect(() => {
    if (modules.length === 0 || hasInitializedExpand.current) return;
    setExpandedModuleId(modules[0].id);
    hasInitializedExpand.current = true;
  }, [modules]);

  const toggleModule = (moduleId: string) => {
    setExpandedModuleId((current) => (current === moduleId ? null : moduleId));
  };

  return {
    expandedModuleId,
    setExpandedModuleId,
    toggleModule,
  };
}
