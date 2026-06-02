"use client";

import { cn } from "@ssu/utils";
import { CheckCircle2, X } from "lucide-react";

export function AssessmentSuccessBanner({
  message,
  onDismiss,
  className,
}: {
  message: string;
  onDismiss: () => void;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 sm:px-5",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#16A34A]" aria-hidden />
        <p className="text-[13px] font-medium text-[#166534] sm:text-[14px]">
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-md p-1 text-[#166534] transition hover:bg-[#DCFCE7]"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
