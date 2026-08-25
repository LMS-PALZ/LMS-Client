"use client";

import { Avatar } from "@ssu/ui";
import { X } from "lucide-react";
import type { Instructor } from "../types";

interface InstructorRowProps {
  instructor: Instructor;
  onRemove: () => void;
}

export function InstructorRow({ instructor, onRemove }: InstructorRowProps) {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-[#F7F9FB] px-4 py-3">
      <div className="flex items-center gap-3">
        <Avatar
          src={instructor.avatarUrl}
          firstName={instructor.firstName}
          lastName={instructor.lastName}
          size="sm"
          className="ring-0"
        />
        <div className="text-[14px]">
          <span className="font-medium text-[#1D1D1D]">
            {instructor.firstName} {instructor.lastName}
          </span>
          <span className="ml-2 text-[#94A3B8]">({instructor.email})</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#ECF0F6] hover:text-[#1D1D1D]"
        aria-label={`Remove ${instructor.firstName} ${instructor.lastName}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
