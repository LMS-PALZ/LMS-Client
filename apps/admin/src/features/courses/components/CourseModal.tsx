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
  footer: ReactNode;
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
            "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-visible rounded-[20px] bg-white shadow-modal focus:outline-none",
            className,
          )}
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

          <div className="relative z-10 min-h-0 flex-1 overflow-visible px-6 py-4">
            {children}
          </div>

          <div className="relative z-0 shrink-0 border-t border-[#EEF2F6] px-6 py-4">
            {footer}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
