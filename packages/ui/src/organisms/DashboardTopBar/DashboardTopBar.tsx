import { cn } from "@ssu/utils";
import { Bell } from "lucide-react";
import type { ReactNode } from "react";

export interface DashboardTopBarProps {
  title: string;
  className?: string;
  endSlot?: ReactNode;
  onNotificationsClick?: () => void;
}

export function DashboardTopBar({
  title,
  className,
  endSlot,
  onNotificationsClick,
}: DashboardTopBarProps) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-between gap-4 min-w-0",
        className,
      )}
    >
      <p className="text-small text-neutral-500">{title}</p>
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onNotificationsClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        {endSlot}
      </div>
    </div>
  );
}
