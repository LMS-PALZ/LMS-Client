import { cn } from "@ssu/utils";
import type { ApplicantStatusDisplay } from "../../types/ui";

interface StudentStatusBadgeProps {
  status: ApplicantStatusDisplay;
}

export function StudentStatusBadge({ status }: StudentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        status.className,
      )}
    >
      {status.label}
    </span>
  );
}
