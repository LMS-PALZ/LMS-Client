"use client";

import { DataTable } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { AttendanceRecord } from "@ssu/types";

const columns: ColumnDef<AttendanceRecord, any>[] = [
  {
    accessorKey: "title",
    header: "Session",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.title}</p>
        <p className="text-sm text-[#6B7280]">{row.original.date}</p>
      </div>
    ),
  },
  {
    accessorKey: "week",
    header: "Week",
  },
  {
    accessorKey: "status",
    header: "Attendance",
    cell: ({ row }) => (
      <span
        className={
          row.original.status === "present"
            ? "text-[#2E7D32]"
            : "text-[#C62828]"
        }
      >
        {row.original.status === "present" ? "✓ Present" : "✕ Absent"}
      </span>
    ),
  },
];

interface AttendanceTableProps {
  attendance: AttendanceRecord[];
}

export function AttendanceTable({ attendance }: AttendanceTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6EBF0] bg-white">
      <div className="border-b p-6">
        <h3 className="text-[22px] font-semibold">Session attendance</h3>
      </div>

      <div className="p-4">
        <DataTable columns={columns} data={attendance} />
      </div>
    </div>
  );
}
