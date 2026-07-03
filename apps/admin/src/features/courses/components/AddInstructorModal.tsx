"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { adminPath } from "@ssu/config/portal-paths";
import { useTutorStaff } from "@ssu/queries";
import { AdminInstructorListSkeleton } from "@/components/skeletons";
import { mapStaffToInstructor } from "../lib/program-mappers";
import type { Instructor } from "../types";
import { CourseModal } from "./CourseModal";
import { InstructorListItem } from "./InstructorListItem";
import { ModalActionButtons } from "./ModalActionButtons";

interface AddInstructorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onSave: (instructors: Instructor[]) => void;
}

export function AddInstructorModal({
  open,
  onOpenChange,
  selectedIds,
  onSave,
}: AddInstructorModalProps) {
  const { data: staffItems, isLoading, isError } = useTutorStaff();
  const [pendingIds, setPendingIds] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (open) {
      setPendingIds(selectedIds);
    }
  }, [open, selectedIds]);

  const instructors = useMemo(
    () => (staffItems ?? []).map(mapStaffToInstructor),
    [staffItems],
  );

  const selectedCount = pendingIds.length;

  const selectedInstructors = useMemo(
    () =>
      instructors.filter((instructor) => pendingIds.includes(instructor.id)),
    [instructors, pendingIds],
  );

  const toggleInstructor = (id: string) => {
    setPendingIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleSave = () => {
    onSave(selectedInstructors);
    onOpenChange(false);
  };

  return (
    <CourseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Instructor"
      footer={
        <ModalActionButtons
          onCancel={() => onOpenChange(false)}
          onSave={handleSave}
          saveDisabled={selectedCount === 0 || isLoading}
        />
      }
    >
      {isLoading ? (
        <AdminInstructorListSkeleton />
      ) : isError || instructors.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
          <p className="text-[16px] font-semibold text-[#1D1D1D]">
            No instructor found
          </p>
          <p className="mt-2 max-w-xs text-[14px] text-[#94A3B8]">
            Please go to the{" "}
            <Link
              href={adminPath("/staff")}
              className="font-medium text-[#4C7D5B] hover:underline"
            >
              staff page
            </Link>{" "}
            to add an instructor
          </p>
        </div>
      ) : (
        <div className="max-h-[320px] overflow-y-auto pr-1">
          {instructors.map((instructor) => (
            <InstructorListItem
              key={instructor.id}
              instructor={instructor}
              selected={pendingIds.includes(instructor.id)}
              onToggle={() => toggleInstructor(instructor.id)}
            />
          ))}
        </div>
      )}
    </CourseModal>
  );
}
