"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@ssu/utils";

interface ManageCourseMenuProps {
  status: "draft" | "published" | string;
  onEdit: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
  isUpdating?: boolean;
}

export function ManageCourseMenu({
  status,
  onEdit,
  onTogglePublish,
  onDelete,
  isUpdating = false,
}: ManageCourseMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPublished = status === "published";

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 text-[14px] font-medium text-[#1D1D1D] transition hover:bg-[#F7F9FB]"
      >
        Manage course
        <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[180px] rounded-xl border border-[#EEF2F6] bg-white p-2 shadow-lg">
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-[14px] text-[#1D1D1D] hover:bg-[#F7F9FB]"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-[14px] text-[#1D1D1D] hover:bg-[#F7F9FB]"
            onClick={() => {
              setOpen(false);
              onTogglePublish();
            }}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            className={cn(
              "w-full rounded-lg px-3 py-2 text-left text-[14px] hover:bg-[#FEF2F2]",
              "text-[#C62828]",
            )}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
