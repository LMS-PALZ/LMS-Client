"use client";

import { DataTable } from "@ssu/ui";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { AssessmentSubmission } from "@ssu/types";

interface PendindAsignmentProps {
  data: AssessmentSubmission[];
  total: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AssessmentGradingTable({ data, total }: PendindAsignmentProps) {
  const router = useRouter();

  const columns: ColumnDef<AssessmentSubmission, any>[] = [
    {
      accessorKey: "name",
      header: "Admin",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.original.avatarUrl}
              alt={row.original.studentName}
              className="h-10 w-10 rounded-full object-cover"
            />

            <span>{row.original.studentName}</span>
          </div>
        );
      },
    },

    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.assessmentTitle}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.submissionType}</span>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: "Date submitted",
      cell: ({ row }) => (
        <span className="text-sm">{formatDate(row.original.submittedAt)}</span>
      ),
    },
  ];

  const rows = Array.isArray(data) ? data : [];
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-[#202124]">
            Assessment for grading ({total})
          </h2>

          <p className="mt-1 text-[13px] text-[#6B7280]">
            Recent submitted assessment by students
          </p>
        </div>

        <button
          onClick={() => router.push("/assessment")}
          className="text-[14px] font-medium text-[#4B7F5C]"
        >
          View all assessment
        </button>
      </div>

      <DataTable columns={columns} data={rows} />
    </section>
  );
}
