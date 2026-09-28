"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  useDraftAssessmentMutation,
  usePublishAssessmentMutation,
} from "@ssu/queries";
import { StatusBadge } from "../atoms/StatusBadge";
import { Button } from "../atoms/Button";
import { SubmittedTable } from "./SubmittedTable";
import type { StaffAssignmentsubmitted } from "@ssu/types";

interface Props {
  data: {
    assessment: {
      _id?: string;
      id?: string;
      status: string;
      title: string;
      dueDate: string;
      weight: number;
      submissions: {
        submitted: string | number;
        total: string | number;
      };
      instructions: string;
      programId?: string;
    };
    studentsSubmits: StaffAssignmentsubmitted[];
  };
  onViewSubmission?: (submission: StaffAssignmentsubmitted) => void;
  canGrade?: boolean;
  /** Publish/unpublish — tutors + super admins only. */
  canManageAssessment?: boolean;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function StaffAssessmentDetails({
  data,
  onViewSubmission,
  canGrade = true,
  canManageAssessment = true,
}: Props) {
  const studentdetails = data?.studentsSubmits;
  const info = data?.assessment;
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const assessmentId = info?._id || info?.id || "";
  const programId =
    info?.programId ||
    (typeof window !== "undefined"
      ? localStorage.getItem("programId") || ""
      : "");
  const publish = usePublishAssessmentMutation(programId);
  const draft = useDraftAssessmentMutation(programId);
  const status = String(info?.status ?? "").toLowerCase();
  const isPublished = status === "published";
  const isDraft = status === "draft";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <div ref={menuRef} className="relative">
          {canManageAssessment && (isDraft || isPublished) ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex items-center gap-2 text-[#4E845F] hover:bg-transparent"
            >
              Manage assignment
              <ChevronDown className="h-5 w-5" />
            </Button>
          ) : null}
          {menuOpen ? (
            <div className="absolute right-0 z-50 mt-2 w-[180px] rounded-[12px] border border-[#E8EDF5] bg-white py-1 shadow-lg">
              {isDraft ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    void publish.mutateAsync(assessmentId);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[14px] text-[#1D1D1D] hover:bg-[#F7F9FB]"
                >
                  Publish
                </button>
              ) : null}
              {isPublished ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    void draft.mutateAsync(assessmentId);
                  }}
                  className="w-full px-4 py-2.5 text-left text-[14px] text-[#1D1D1D] hover:bg-[#F7F9FB]"
                >
                  Unpublish
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <hr />

      <div className="overflow-hidden rounded-2xl bg-[#F8FAF8]">
        <button
          type="button"
          onClick={() => setInstructionsOpen(!instructionsOpen)}
          className="flex w-full items-center justify-between px-6 py-5"
        >
          <p className="text-[14px] font-semibold">Instructions</p>

          {instructionsOpen ? (
            <ChevronUp className="h-6 w-6" />
          ) : (
            <ChevronDown className="h-6 w-6" />
          )}
        </button>

        {instructionsOpen && (
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
          canGrade={canGrade}
        />
      </section>
    </div>
  );
}
