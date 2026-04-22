import { cn, formatDate } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";

export interface NotificationItemProps {
  icon: LucideIcon;
  message: string;
  createdAt: string;
  read: boolean;
  onClick?: () => void;
  className?: string;
}

const inner = (
  Icon: LucideIcon,
  message: string,
  createdAt: string,
  read: boolean,
) => (
  <>
    <div className="mt-0.5 rounded-lg bg-white p-2 shadow-card">
      <Icon className="h-4 w-4 text-brand-green" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-body text-neutral-800">{message}</p>
      <p className="text-small text-neutral-500 mt-1">
        {formatDate(createdAt)}
      </p>
    </div>
    {!read && (
      <span
        className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-amber"
        aria-label="Unread"
      />
    )}
  </>
);

export function NotificationItem({
  icon: Icon,
  message,
  createdAt,
  read,
  onClick,
  className,
}: NotificationItemProps) {
  const shell =
    "flex w-full gap-3 rounded-lg border border-transparent p-3 text-left transition-colors";
  const state = read ? "bg-white" : "bg-brand-green-50 border-brand-green-200";
  const interactive = onClick ? "hover:bg-neutral-50 cursor-pointer" : "";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(shell, state, interactive, className)}
      >
        {inner(Icon, message, createdAt, read)}
      </button>
    );
  }

  return (
    <div className={cn(shell, state, className)}>
      {inner(Icon, message, createdAt, read)}
    </div>
  );
}
