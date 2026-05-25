"use client";

import { cn } from "@ssu/utils";
import { CalendarDays, NotebookText, SquareCheckBig } from "lucide-react";

export interface Assignment {
  id: number;
  title: string;
  topic: string;
  score: number;
  date: string;
  due?: boolean;
}

export interface AssignmentsProps {
  assignments?: Assignment[];
  title?: string;
  showViewMore?: boolean;
  className?: string;
  onViewMore?: () => void;
}

export function Assignments({
  assignments = [],
  title = "Assignments",
  showViewMore = true,
  className,
  onViewMore,
}: AssignmentsProps) {
  return (
    <section
      className={cn("mt-10 rounded-[28px] bg-[#FCFCFC] p-4 md:p-6", className)}
    >
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[17px] font-semibold text-[#1D1D1D]">{title}</h2>

        {showViewMore && (
          <button
            type="button"
            onClick={onViewMore}
            className="text-[14px] font-medium text-[#4B7F52] transition hover:opacity-80"
          >
            View more
          </button>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="flex  flex-col items-center justify-center text-center">
          <img
            src="/empty-assignment.png"
            alt="empty"
            className="mb-5 h-12 w-12 opacity-40"
          />

          <h3 className="text-[14px] font-semibold text-[#1D1D1D]">
            You don’t have any assignment yet
          </h3>

          <p className="mt-2 text-[14px] text-[#6B7280]">
            When you do, they’ll show up here
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-[18px] bg-[#F7F7F7] p-5"
            >
              <h3 className="text-[15px] font-medium leading-[24px] text-[#1D1D1D]">
                {assignment.title}
              </h3>

              <div className="my-5 h-[1px] w-full bg-[#E5E7EB]" />

              {/* Topic */}
              <div className="flex items-center gap-2 text-[#6B7280]">
                <NotebookText size={14} />

                <span className="text-[14px]">{assignment.topic}</span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[#6B7280]">
                <SquareCheckBig size={14} />

                <span className="text-[14px]">{assignment.score}</span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-2 text-[#6B7280]">
                  <CalendarDays size={14} />

                  <span className="text-[14px]">{assignment.date}</span>
                </div>

                {assignment.due && (
                  <div className="rounded-full bg-[#FFD9D4] px-3 py-1 text-[12px] font-medium text-[#D14B3D]">
                    Due
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Assignments;
