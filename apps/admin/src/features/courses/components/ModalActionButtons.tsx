"use client";

import { Button } from "@ssu/ui";
import { cn } from "@ssu/utils";

interface ModalActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
}

export function ModalActionButtons({
  onCancel,
  onSave,
  saveDisabled = false,
  saveLabel = "Save",
  cancelLabel = "Cancel",
}: ModalActionButtonsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="h-11 rounded-full bg-[#ECF0F6] px-6 text-[14px] font-medium text-[#1D1D1D] hover:bg-[#E2E8F0]"
      >
        {cancelLabel}
      </Button>
      <Button
        type="button"
        onClick={onSave}
        disabled={saveDisabled}
        className={cn(
          "h-11 rounded-full px-6 text-[14px] font-medium",
          saveDisabled
            ? "bg-[#D7E0EA] text-white hover:bg-[#D7E0EA]"
            : "bg-[#4C7D5B] text-white hover:bg-[#3d6549]",
        )}
      >
        {saveLabel}
      </Button>
    </div>
  );
}
