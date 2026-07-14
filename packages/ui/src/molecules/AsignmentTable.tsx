"use client";

import { DataTable, StatusBadge } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { StaffAssignment } from "@ssu/types";
import { useRouter } from "next/navigation";
import { EllipsisVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useArchiveAssessmentMutation } from "@ssu/queries";

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
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
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
    router.push(`/createasignment?edit=${assessment._id}`);
  };

  const handleView = () => {
    setOpen(false);
    router.push(`/assessment/${assessment._id}`);
  };

  const handleDelete = async () => {
    setOpen(false);
    console.log("assessment", assessment);
    console.log("assessment._id", assessment._id);
    try {
      await archive.mutateAsync(assessment._id);
    } catch (error: any) {
      console.error(error.message);
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
                onClick={handleDelete}
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
}: StudentsTableProps) {
  const columns: ColumnDef<StaffAssignment, any>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "Title",
      header: "Title",
      cell: ({ row }) => <span className="text-sm">{row.original.title}</span>,
    },
    {
      accessorKey: "Course",
      header: "Course",
      cell: ({ row }) => <span className="text-sm">{row.original.module}</span>,
    },
    {
      accessorKey: "Submissions",
      header: "Submissions",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.submissions.submitted} /{" "}
          {row.original.submissions.total}
        </span>
      ),
    },
    {
      accessorKey: "Weight",
      header: "Weight",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.weight}%</span>
      ),
    },
    {
      accessorKey: "date",
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
  ];

  return (
    <DataTable
      columns={columns}
      data={students ?? []}
      pagination={pagination}
      searchValue={search}
      onSearchChange={setSearch}
      statusFilter={status}
      onStatusFilterChange={setStatus}
      onPageChange={setPage}
      searchable
      statusOptions={["All", "published", "draft", "archive"]}
    />
  );
}
