"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { StaffAssignment } from "@ssu/types";
import { useRouter } from "next/navigation";
import { EllipsisVertical } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useArchiveAssessmentMutation } from "@ssu/queries";
import { StatusBadge } from "../atoms/StatusBadge";
import { DataTable } from "../organisms/DataTable";

interface StudentsTableProps {
  students: StaffAssignment[];
  programId: string;
  pagination?: {
    page: number;
    totalPages: number;
    total?: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  setPage: (page: number) => void;
  isLoading?: boolean;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ActionDropdown({
  assessment,
  programId,
}: {
  assessment: StaffAssignment;
  programId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const archive = useArchiveAssessmentMutation(programId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    setOpen(false);
    localStorage.setItem("editAssessment", JSON.stringify(assessment));
    router.push(`/createassignment?edit=${assessment._id}`);
  };

  const handleView = () => {
    setOpen(false);
    router.push(`/assessment/${assessment._id}`);
  };

  const handleDelete = async () => {
    setOpen(false);
    try {
      await archive.mutateAsync(assessment._id);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-[13px] text-[#4E845F] hover:opacity-80"
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[140px] rounded-[12px] border border-[#E8EDF5] bg-white py-1 shadow-lg">
          {assessment.status === "published" ? (
            <button
              type="button"
              onClick={handleView}
              className="w-full px-4 py-2.5 text-left text-[14px] text-[#1D1D1D] hover:bg-[#F7F9FB]"
            >
              View
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleEdit}
                className="w-full px-4 py-2.5 text-left text-[14px] text-[#1D1D1D] hover:bg-[#F7F9FB]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={archive.isPending}
                className="w-full px-4 py-2.5 text-left text-[14px] text-[#EF4444] hover:bg-[#FEF2F2] disabled:opacity-50"
              >
                {archive.isPending ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function AssignmentTable({
  students,
  programId,
  pagination,
  search,
  setSearch,
  status,
  setStatus,
  setPage,
  isLoading = false,
}: StudentsTableProps) {
  const columns = useMemo<ColumnDef<StaffAssignment, unknown>[]>(
    () => [
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={String(row.original.status ?? "")} />
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "module",
        header: "Course",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.module}</span>
        ),
      },
      {
        accessorKey: "submissions",
        header: "Submissions",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.submissions?.submitted ?? 0} /{" "}
            {row.original.submissions?.total ?? 0}
          </span>
        ),
      },
      {
        accessorKey: "weight",
        header: "Weight",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.weight}%</span>
        ),
      },
      {
        accessorKey: "dueDate",
        header: "Due date",
        cell: ({ row }) => (
          <span className="text-sm">{formatDate(row.original.dueDate)}</span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <ActionDropdown assessment={row.original} programId={programId} />
        ),
      },
    ],
    [programId],
  );

  const rows = Array.isArray(students) ? students : [];

  return (
    <div className="space-y-2">
      {isLoading && rows.length === 0 ? (
        <p className="text-[14px] text-[#94A3B8]">Loading assessments…</p>
      ) : null}
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row, index) => row._id || String(index)}
        pagination={pagination}
        searchValue={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={(value) => {
          const next = value.trim().toLowerCase();
          if (!next || next === "all" || next.startsWith("all status")) {
            setStatus("");
            return;
          }
          setStatus(next === "archive" ? "archived" : next);
        }}
        onPageChange={setPage}
        searchable
        statusOptions={["All statuses", "published", "draft", "archived"]}
      />
      {!isLoading && rows.length === 0 ? (
        <p className="pt-2 text-center text-[14px] text-[#94A3B8]">
          No assessments found for this course.
        </p>
      ) : null}
    </div>
  );
}
