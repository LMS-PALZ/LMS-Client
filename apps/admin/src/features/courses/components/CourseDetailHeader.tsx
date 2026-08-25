"use client";

import type { AdminProgram } from "@ssu/types";
import { cn } from "@ssu/utils";
import { formatCourseStatus, normalizeCourseStatus } from "../lib/course-utils";
import { ManageCourseMenu } from "./ManageCourseMenu";

interface CourseDetailHeaderProps {
  program: AdminProgram;
  instructorLabel: string;
  onEdit: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
  isUpdating?: boolean;
}

export function CourseDetailHeader({
  program,
  instructorLabel,
  onEdit,
  onTogglePublish,
  onDelete,
  isUpdating = false,
}: CourseDetailHeaderProps) {
  const price = `${program.priceCurrency} ${program.priceAmount.toLocaleString("en-NG")}`;

  return (
    <div className="rounded-[18px] border border-[#EEF2F6] bg-white px-6 py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[24px] font-semibold text-[#1D1D1D]">
              {program.title}
            </h1>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                program.status === "published"
                  ? "bg-[#DBF1DC] text-[#1F6E2A]"
                  : "bg-[#FFF4E5] text-[#B45309]",
              )}
            >
              {formatCourseStatus(program.status)}
            </span>
          </div>

          {program.description && (
            <p className="max-w-3xl text-[14px] leading-6 text-[#6B7280]">
              {program.description}
            </p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-[#6B7280]">
            <p>
              <span className="font-medium text-[#1D1D1D]">Instructor(s):</span>{" "}
              {instructorLabel}
            </p>
            <p>
              <span className="font-medium text-[#1D1D1D]">Price:</span> {price}
            </p>
          </div>
        </div>

        <ManageCourseMenu
          status={normalizeCourseStatus(program.status)}
          onEdit={onEdit}
          onTogglePublish={onTogglePublish}
          onDelete={onDelete}
          isUpdating={isUpdating}
        />
      </div>
    </div>
  );
}
