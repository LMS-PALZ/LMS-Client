"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { StatusDialog } from "@/components/StatusDialog";
import { COURSE_SUCCESS_MESSAGES, type CourseStatus } from "../types";
import type { ModalControlProps } from "../types/ui";

interface CourseSuccessModalProps extends ModalControlProps {
  variant: CourseStatus;
}

export function CourseSuccessModal({
  open,
  onOpenChange,
  variant,
}: CourseSuccessModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-white shadow-modal focus:outline-none">
          <Dialog.Close
            className="absolute right-4 top-4 rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F7F9FB] hover:text-[#1D1D1D]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>

          <div className="px-6 pb-6 pt-8">
            <StatusDialog
              variant="success"
              title="Success"
              description={COURSE_SUCCESS_MESSAGES[variant]}
              onDismiss={() => onOpenChange(false)}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
