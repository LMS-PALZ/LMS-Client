"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { StatusBadge } from "@ssu/ui";
import { Button } from "@ssu/ui";
// import { SubmittedTable } from "@ssu/ui";

interface Props {
  data: {
    assessment: {
      status: any;
      title: string;
      dueDate: string;
      weight: number;
      submissions: string;
      instructions: string;
    };
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function StaffAssessmentDetails({ data }: Props) {
  const info = data?.assessment;

  console.log("Assessment data:", data);

  const [open, setOpen] = useState(true);

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
                {/* {submissions} */}
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

      {/* <section>
<SubmittedTable

/>
   </section> */}
    </div>
  );
}
