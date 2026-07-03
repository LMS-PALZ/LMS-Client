"use client";

import { DataTable, StatusBadge } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { StaffAssignment } from "@ssu/types";
import { useRouter } from "next/navigation";
import { EllipsisVertical } from "lucide-react";

interface StudentsTableProps {
  students: StaffAssignment[];

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

export function SubmittedTable({
  students,
  pagination,
  search,
  setSearch,
  status,
  setStatus,
  setPage,
}: StudentsTableProps) {
  const router = useRouter();

  const columns: ColumnDef<StaffAssignment, any>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },

    {
      accessorKey: "Title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.title}</span>
        </div>
      ),
    },

    {
      accessorKey: "Course",
      header: "Course",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.module}</span>
        </div>
      ),
    },

    {
      accessorKey: "Submissions",
      header: "Submissions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {row.original.submissions.submitted} /{" "}
            {row.original.submissions.total}
          </span>
        </div>
      ),
    },

    {
      accessorKey: "Weight",
      header: "Weight",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.weight}%</span>
        </div>
      ),
    },

    {
      accessorKey: "date",
      header: "Due date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{formatDate(row.original.dueDate)}</span>
        </div>
      ),
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => router.push(`/assessment/${row.original._id}`)}
          className="text-[13px] text-[#4E845F] hover:opacity-80"
        >
          <EllipsisVertical />
        </button>
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
