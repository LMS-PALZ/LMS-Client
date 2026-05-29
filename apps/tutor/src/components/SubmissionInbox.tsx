"use client";

import { DataTable, Badge, Button } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { tutorPath } from "@ssu/config/portal-paths";
import Link from "next/link";

type Row = {
  id: string;
  student: string;
  submittedAt: string;
  type: string;
  status: "pending" | "graded";
};

const columns: ColumnDef<Row>[] = [
  { accessorKey: "student", header: "Student" },
  { accessorKey: "submittedAt", header: "Submitted" },
  { accessorKey: "type", header: "Type" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "pending" ? "pending" : "graded"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <Button variant="secondary" size="sm" asChild>
        <Link href={tutorPath("/assignments/a1/submissions")}>Review</Link>
      </Button>
    ),
  },
];

const data: Row[] = [
  {
    id: "1",
    student: "Sam Student",
    submittedAt: "2025-06-01T14:30:00.000Z",
    type: "file",
    status: "pending",
  },
];

export function SubmissionInbox() {
  return <DataTable columns={columns} data={data} searchable />;
}
