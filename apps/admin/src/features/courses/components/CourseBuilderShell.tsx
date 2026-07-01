"use client";

import type { ReactNode } from "react";
import { Button } from "@ssu/ui";
import { CourseBuilderStepper } from "./CourseBuilderStepper";

interface CourseBuilderShellProps {
  children: ReactNode;
  activeStep?: 1 | 2;
  showStepper?: boolean;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  saveDraftDisabled?: boolean;
  publishDisabled?: boolean;
  isSaving?: boolean;
  footer?: ReactNode;
}

export function CourseBuilderShell({
  children,
  activeStep = 1,
  showStepper = false,
  onSaveDraft,
  onPublish,
  saveDraftDisabled = false,
  publishDisabled = false,
  isSaving = false,
  footer,
}: CourseBuilderShellProps) {
  const showActions = onSaveDraft || onPublish;

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#EEF2F6] bg-white">
      <div className="flex flex-col gap-4 border-b border-[#EEF2F6] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        {showStepper ? (
          <CourseBuilderStepper activeStep={activeStep} />
        ) : (
          <div className="text-[16px] font-semibold text-[#1D1D1D]">
            Course builder
          </div>
        )}

        {showActions && (
          <div className="flex items-center justify-end gap-3">
            {onSaveDraft && (
              <Button
                type="button"
                variant="ghost"
                onClick={onSaveDraft}
                disabled={saveDraftDisabled || isSaving}
                className="h-10 rounded-full border border-[#E2E8F0] bg-white px-5 text-[14px] font-medium text-[#1D1D1D] hover:bg-[#F7F9FB]"
              >
                Save as draft
              </Button>
            )}
            {onPublish && (
              <Button
                type="button"
                onClick={onPublish}
                disabled={publishDisabled || isSaving}
                loading={isSaving}
                className="h-10 rounded-full bg-[#4C7D5B] px-5 text-[14px] font-medium text-white hover:bg-[#3d6549]"
              >
                Publish
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-8">{children}</div>

      {footer}
    </div>
  );
}
