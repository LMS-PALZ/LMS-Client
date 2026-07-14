"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { StatusBadge, Button, SubmittedTable } from "@ssu/ui";
import type { StaffAssignmentsubmitted } from "@ssu/types";

interface Props {
  data: {
    assessment: {
      status: any;
      title: string;
      dueDate: string;
      weight: number;
      submissions: {
        submitted: string;
        total: string;
      };
      instructions: string;
    };
    studentsSubmits: StaffAssignmentsubmitted[];
  };
  onViewSubmission?: (submission: StaffAssignmentsubmitted) => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function StaffAssessmentDetails({ data, onViewSubmission }: Props) {
  const studentdetails = data?.studentsSubmits;
  const info = data?.assessment;
  const [open, setOpen] = useState(true);

  console.log("Assessment data:", data);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <StatusBadge status={info?.status} />

          <p className="mt-3 text-[24px] font-bold text-[#202124]">
            {info?.title}
          </p>

          <div className="mt-10 grid grid-cols-3 gap-20">
            <div>
              <p className="text-sm text-[#6B7280]">Due date</p>
              <p className="mt-1 text-[14px] font-semibold">
                {formatDate(info?.dueDate)}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#6B7280]">Weight</p>
              <p className="mt-1 text-[14px] font-semibold">{info?.weight}</p>
            </div>

            <div>
              <p className="text-sm text-[#6B7280]">Submissions</p>
              <p className="mt-1 text-[14px] font-semibold">
                {info?.submissions.submitted} / {info?.submissions.total}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="flex items-center gap-2 text-[#4E845F] hover:bg-transparent"
        >
          Manage assignment
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>

      <hr />

      <div className="overflow-hidden rounded-2xl bg-[#F8FAF8]">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-6 py-5"
        >
          <p className="text-[14px] font-semibold">Instructions</p>

          {open ? (
            <ChevronUp className="h-6 w-6" />
          ) : (
            <ChevronDown className="h-6 w-6" />
          )}
        </button>

        {open && (
          <div className="px-6 pb-6 text-sm leading-9 text-[#555]">
            {info?.instructions}
          </div>
        )}
      </div>

      <section>
        <SubmittedTable
          students={studentdetails ?? []}
          weight={info?.weight ?? 0}
          onViewSubmission={onViewSubmission}
        />
      </section>
    </div>
  );
}
