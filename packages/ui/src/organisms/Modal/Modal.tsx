"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@ssu/utils";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  const handleClose = () => {
    onOpenChange(false);
    onClose?.(); // ← call onClose if provided
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-modal focus:outline-none",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-h3 text-neutral-900">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-small text-neutral-500 mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              onClick={handleClose}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <div className="mt-4">{children}</div>
          {footer && (
            <div className="mt-6 flex justify-end gap-2">{footer}</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
