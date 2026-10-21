"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@ssu/utils";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface CourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function CourseModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className,
}: CourseModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[20px] bg-white shadow-modal focus:outline-none",
            className,
            // Keep after `className` so callers cannot clip date pickers with overflow-hidden.
            "overflow-visible",
          )}
          onInteractOutside={(event) => {
            // Portaled date-picker panels render outside Dialog.Content.
            const target = event.target as HTMLElement | null;
            if (target?.closest("[data-ssu-date-picker-panel]")) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest("[data-ssu-date-picker-panel]")) {
              event.preventDefault();
            }
          }}
          onFocusOutside={(event) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest("[data-ssu-date-picker-panel]")) {
              event.preventDefault();
            }
          }}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[#EEF2F6] px-6 py-4">
            <Dialog.Title className="text-[18px] font-semibold text-[#1D1D1D]">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F7F9FB] hover:text-[#1D1D1D]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* overflow-visible so absolute/portaled calendars are not clipped */}
          <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-visible px-6 py-4">
            {children}
          </div>

          {footer != null ? (
            <div className="relative z-0 shrink-0 border-t border-[#EEF2F6] px-6 py-4">
              {footer}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
