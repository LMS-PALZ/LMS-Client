"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@ssu/ui";

interface DeleteCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  courseTitle?: string;
}

export function DeleteCourseModal({
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
  courseTitle,
}: DeleteCourseModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-white shadow-modal focus:outline-none">
          <div className="flex items-center justify-between border-b border-[#EEF2F6] px-6 py-4">
            <Dialog.Title className="text-[18px] font-semibold text-[#1D1D1D]">
              Delete this course
            </Dialog.Title>
            <Dialog.Close
              className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F7F9FB] hover:text-[#1D1D1D]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="px-6 py-5">
            <p className="text-[14px] leading-6 text-[#6B7280]">
              {courseTitle
                ? `Please confirm that you want to delete "${courseTitle}". It will be removed from the course list.`
                : "Please confirm that you want to delete this course. It will be removed from the course list."}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isDeleting}
                className="h-11 rounded-full bg-[#ECF0F6] px-6 text-[14px] font-medium text-[#1D1D1D] hover:bg-[#E2E8F0]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="h-11 rounded-full bg-[#C62828] px-6 text-[14px] font-medium text-white hover:bg-[#A61F1F]"
              >
                {isDeleting ? "Deleting..." : "Yes, delete"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
