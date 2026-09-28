"use client";

import { DataTable, StatusBadge } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { StaffAssignmentsubmitted } from "@ssu/types";
import { EllipsisVertical } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";

interface StudentsTableProps {
  students: StaffAssignmentsubmitted[];
  weight: number;
  onViewSubmission?: (submission: StaffAssignmentsubmitted) => void;
  canGrade?: boolean;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SubmissionActions({
  submission,
  onViewSubmission,
  canGrade,
}: {
  submission: StaffAssignmentsubmitted;
  onViewSubmission?: (submission: StaffAssignmentsubmitted) => void;
  canGrade: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const status = String(submission.status ?? "").toLowerCase();
  const isGraded = status === "graded";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!onViewSubmission) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="text-[13px] text-[#4E845F] hover:opacity-80"
        aria-label="Submission actions"
      >
        <EllipsisVertical />
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[150px] rounded-[12px] border border-[#E8EDF5] bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onViewSubmission(submission);
            }}
            className="w-full px-4 py-2.5 text-left text-[14px] text-[#1D1D1D] hover:bg-[#F7F9FB]"
          >
            {canGrade ? (isGraded ? "Regrade" : "Grade") : "View"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function SubmittedTable({
  students,
  weight,
  onViewSubmission,
  canGrade = true,
}: StudentsTableProps) {
  const columns = useMemo<ColumnDef<StaffAssignmentsubmitted, any>[]>(
    () => [
      {
        accessorKey: "student",
        header: "Student",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.profile?.photo?.url}
              alt={row.original.studentId?.first_name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-[14px] font-medium text-[#1D1D1D]">
                {row.original.studentId?.first_name}{" "}
                {row.original.studentId?.last_name}
              </p>
              <p className="text-[12px] text-[#6B7280]">
                {row.original.studentId?.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.score !== null
              ? `${row.original.score}/${weight}`
              : "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "date",
        header: "Date Submitted",
        cell: ({ row }) => (
          <span className="text-sm">
            {formatDate(row.original.submittedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <SubmissionActions
            submission={row.original}
            onViewSubmission={onViewSubmission}
            canGrade={canGrade}
          />
        ),
      },
    ],
    [canGrade, onViewSubmission, weight],
  );

  return (
    <DataTable
      columns={columns}
      data={students ?? []}
      onRowClick={onViewSubmission ? (row) => onViewSubmission(row) : undefined}
    />
  );
}
