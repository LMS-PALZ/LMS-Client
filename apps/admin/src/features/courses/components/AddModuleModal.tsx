"use client";

import { useEffect, useState } from "react";
import { FormField, Input } from "@ssu/ui";
import { CourseModal } from "./CourseModal";
import { ModalActionButtons } from "./ModalActionButtons";

interface AddModuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  initialName?: string;
  title?: string;
  isSaving?: boolean;
}

export function AddModuleModal({
  open,
  onOpenChange,
  onSave,
  initialName = "",
  title = "Add a module",
  isSaving = false,
}: AddModuleModalProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) {
      setName(initialName);
    }
  }, [open, initialName]);

  const canSave = name.trim().length > 0 && !isSaving;

  const handleSave = () => {
    if (!canSave) return;
    onSave(name.trim());
  };

  return (
    <CourseModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <ModalActionButtons
          onCancel={() => onOpenChange(false)}
          onSave={handleSave}
          saveDisabled={!canSave}
          saveLabel={isSaving ? "Saving..." : "Save"}
        />
      }
    >
      <FormField id="module-name" label="Module name">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter module name"
          className="h-11 rounded-xl border-[#E2E8F0]"
        />
      </FormField>
    </CourseModal>
  );
}
