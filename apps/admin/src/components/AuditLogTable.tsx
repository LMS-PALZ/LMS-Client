"use client";

import type { AuditLogEntry } from "@/lib/audit-log";
import { DataTable } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

const ACTION_LABELS: Record<AuditLogEntry["action"], string> = {
  sign_in: "Sign in",
  sign_out: "Sign out",
};

const ACTION_STYLES: Record<AuditLogEntry["action"], string> = {
  sign_in: "bg-[#DFF2E1] text-[#2E7D32]",
  sign_out: "bg-[#E9EEF5] text-[#5F6B7A]",
};

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

interface AuditLogTableProps {
  entries: AuditLogEntry[];
  search: string;
  setSearch: (value: string) => void;
  actionFilter: string;
  setActionFilter: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize?: number;
}

export function AuditLogTable({
  entries,
  search,
  setSearch,
  actionFilter,
  setActionFilter,
  page,
  setPage,
  pageSize = 10,
}: AuditLogTableProps) {
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesAction =
        actionFilter === "All actions" || entry.action === actionFilter;
      const matchesSearch =
        !query ||
        entry.userName.toLowerCase().includes(query) ||
        entry.userEmail.toLowerCase().includes(query) ||
        entry.location.toLowerCase().includes(query);

      return matchesAction && matchesSearch;
    });
  }, [entries, search, actionFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const columns = useMemo<ColumnDef<AuditLogEntry>[]>(
    () => [
      {
        accessorKey: "timestamp",
        header: "Date & Time",
        cell: ({ row }) => formatDateTime(row.original.timestamp),
      },
      {
        accessorKey: "userName",
        header: "User",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-[#1D1D1D]">
              {row.original.userName}
            </p>
            <p className="text-[12px] text-[#6B7280]">
              {row.original.userEmail}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${ACTION_STYLES[row.original.action]}`}
          >
            {ACTION_LABELS[row.original.action]}
          </span>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "timezone",
        header: "Timezone",
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={actionFilter}
          onChange={(event) => setActionFilter(event.target.value)}
          className="h-11 min-w-[160px] rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[14px]"
        >
          <option>All actions</option>
          <option value="sign_in">Sign in</option>
          <option value="sign_out">Sign out</option>
        </select>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search user, email, or location"
          className="h-11 min-w-[280px] flex-1 rounded-[12px] border border-[#E5E7EB] px-4 text-[14px] placeholder:text-[#9CA3AF]"
        />
      </div>

      <DataTable
        columns={columns}
        data={pageItems}
        pagination={{
          page: currentPage,
          totalPages,
          total: filtered.length,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1,
        }}
        onPageChange={setPage}
      />
    </div>
  );
}
