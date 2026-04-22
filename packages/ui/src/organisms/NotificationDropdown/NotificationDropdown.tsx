"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@ssu/utils";
import { Bell } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../atoms/Button";

export interface NotificationDropdownProps {
  triggerLabel?: string;
  children: ReactNode;
  className?: string;
}

export function NotificationDropdown({
  triggerLabel = "Open notifications",
  children,
  className,
}: NotificationDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={triggerLabel}
        >
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "z-50 w-80 rounded-xl border bg-white p-2 shadow-modal data-[state=open]:animate-none",
            className,
          )}
          sideOffset={8}
          align="end"
        >
          <div className="max-h-80 overflow-y-auto">{children}</div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
