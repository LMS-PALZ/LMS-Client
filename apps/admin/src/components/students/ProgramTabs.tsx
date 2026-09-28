"use client";

import { cn } from "@ssu/utils";

export interface ProgramTab {
  id: string;
  title: string;
  slug?: string;
}

interface ProgramTabsProps {
  programs: ProgramTab[];
  selectedId: string;
  onSelect: (program: ProgramTab) => void;
  isLoading?: boolean;
}

export function ProgramTabs({
  programs,
  selectedId,
  onSelect,
  isLoading = false,
}: ProgramTabsProps) {
  if (isLoading && programs.length === 0) {
    return (
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-11 w-40 animate-pulse rounded-[12px] bg-[#EEF2F6]"
          />
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <p className="text-[14px] text-[#94A3B8]">No programs available yet.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {programs.map((program) => {
        const selected = program.id === selectedId;
        return (
          <button
            key={program.id}
            type="button"
            onClick={() => onSelect(program)}
            className={cn(
              "h-11 rounded-[12px] border px-4 text-[14px] font-medium transition",
              selected
                ? "border-[#4C7D5B] bg-[#EAF4ED] text-[#2F5D3A]"
                : "border-[#E5E7EB] bg-white text-[#4A4F59] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]",
            )}
          >
            {program.title}
          </button>
        );
      })}
    </div>
  );
}
