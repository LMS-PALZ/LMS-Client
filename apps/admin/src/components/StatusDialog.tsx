"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@ssu/ui";

export interface StatusDialogProps {
  variant: "success" | "error" | "confirm";

  title: string;
  description?: string;
  children?: ReactNode;

  onDismiss?: () => void;
  dismissLabel?: string;

  onCancel?: () => void;
  onConfirm?: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  confirmDisabled?: boolean;
  confirmVariant?: "danger" | "primary";

  icon?: React.ReactNode;
}

export function StatusDialog({
  variant,
  title,
  description,
  children,
  onDismiss,
  dismissLabel = "Dismiss",
  onCancel,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel = "Suspend",
  isConfirming = false,
  confirmDisabled = false,
  confirmVariant = "danger",
  icon,
}: StatusDialogProps) {
  return (
    <div className="flex flex-col items-center px-2 py-4 text-center">
      {variant === "success" && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#39B44B]">
          {icon ?? <CheckCircle2 className="h-9 w-9 text-[#FFFFFF]" />}
        </div>
      )}

      {variant === "error" && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F87171]">
          {icon ?? <XCircle className="h-9 w-9 text-[#FFFFFF]" />}
        </div>
      )}

      <h2 className="text-[18px] font-semibold text-[#1D1D1D]">{title}</h2>

      {description && (
        <p className="mt-2 max-w-[320px] text-[14px] leading-6 text-[#6B7280]">
          {description}
        </p>
      )}

      {children ? (
        <div className="mt-4 w-full max-w-[320px] text-left">{children}</div>
      ) : null}

      {variant === "success" ? (
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onDismiss}
          className="mt-7 w-full rounded-[30px] hover:bg-transparent bg-transparent text-[#4C7D5B]"
        >
          {dismissLabel}
        </Button>
      ) : variant === "error" ? (
        <div className="mt-7 flex w-full items-center gap-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onDismiss}
            className="flex-1 rounded-[30px] bg-[#E2E8F0] text-[#1D1D1D] hover:bg-[#D7DFEC]"
          >
            {dismissLabel}
          </Button>
          {onConfirm ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onConfirm}
              className="flex-1 rounded-[30px] text-[var(--color-surface)]"
            >
              {confirmLabel}
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onCancel}
            className="flex-1 rounded-[30px] bg-[#E2E8F0] text-[#1D1D1D] hover:bg-[#D7DFEC]"
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant={confirmVariant}
            size="lg"
            onClick={onConfirm}
            disabled={isConfirming || confirmDisabled}
            className="flex-1 rounded-[30px] text-white"
          >
            {isConfirming ? "Processing..." : confirmLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
