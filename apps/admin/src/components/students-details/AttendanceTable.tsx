"use client";

import { DataTable } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { AttendanceRecord } from "@ssu/types";
import { displayValue, EMPTY_DISPLAY } from "@ssu/utils";

function attendanceLabel(status: AttendanceRecord["status"]) {
  if (status === "present") return "✓ Present";
  if (status === "absent") return "✕ Absent";
  return "Not recorded";
}

function attendanceClass(status: AttendanceRecord["status"]) {
  if (status === "present") return "text-[#2E7D32]";
  if (status === "absent") return "text-[#C62828]";
  return "text-[#6B7280]";
}

const columns: ColumnDef<AttendanceRecord, any>[] = [
  {
    accessorKey: "title",
    header: "Session",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{displayValue(row.original.title)}</p>
        <p className="text-sm text-[#6B7280]">
          {displayValue(row.original.date)}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "week",
    header: "Week",
    cell: ({ row }) => displayValue(row.original.week),
  },
  {
    accessorKey: "status",
    header: "Attendance",
    cell: ({ row }) => (
      <span className={attendanceClass(row.original.status)}>
        {attendanceLabel(row.original.status) || EMPTY_DISPLAY}
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
