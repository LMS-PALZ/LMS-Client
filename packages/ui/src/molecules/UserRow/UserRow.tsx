import { cn } from "@ssu/utils";
import type { ReactNode } from "react";
import { Avatar } from "../../atoms/Avatar";
import { Badge } from "../../atoms/Badge";
import type { BadgeProps } from "../../atoms/Badge";

export interface UserRowProps {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  roleVariant: NonNullable<BadgeProps["variant"]>;
  roleLabel: string;
  statusVariant: NonNullable<BadgeProps["variant"]>;
  statusLabel: string;
  actions?: ReactNode;
  className?: string;
}

export function UserRow({
  firstName,
  lastName,
  email,
  avatarUrl,
  roleVariant,
  roleLabel,
  statusVariant,
  statusLabel,
  actions,
  className,
}: UserRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-lg border bg-white p-3 shadow-card",
        className,
      )}
    >
      <Avatar src={avatarUrl} firstName={firstName} lastName={lastName} />
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-neutral-900 truncate">
          {firstName} {lastName}
        </p>
        <p className="text-small text-neutral-500 truncate">{email}</p>
      </div>
      <Badge variant={roleVariant}>{roleLabel}</Badge>
      <Badge variant={statusVariant}>{statusLabel}</Badge>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
