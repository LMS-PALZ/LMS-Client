"use client";

import { Avatar, Checkbox } from "@ssu/ui";
import { cn } from "@ssu/utils";
import { getAvatarColorFromId } from "../lib/avatar-utils";
import type { Instructor } from "../types";

interface InstructorListItemProps {
  instructor: Instructor;
  selected: boolean;
  onToggle: () => void;
}

export function InstructorListItem({
  instructor,
  selected,
  onToggle,
}: InstructorListItemProps) {
  const fullName = `${instructor.firstName} ${instructor.lastName}`.trim();
  const avatarColor = getAvatarColorFromId(instructor.id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 border-b border-[#F3F4F6] py-3 text-left transition last:border-b-0 hover:bg-[#F7F9FB]",
      )}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={onToggle}
        onClick={(event) => event.stopPropagation()}
        className="h-[18px] w-[18px] rounded-[4px] border-[#D7E0EA] data-[state=checked]:border-[#4C7D5B] data-[state=checked]:bg-[#4C7D5B]"
        aria-label={`Select ${fullName}`}
      />
      {instructor.avatarUrl ? (
        <Avatar
          src={instructor.avatarUrl}
          firstName={instructor.firstName}
          lastName={instructor.lastName}
          size="sm"
          className="ring-0"
        />
      ) : (
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
            avatarColor,
          )}
          aria-hidden
        >
          {instructor.initials ||
            `${instructor.firstName.charAt(0)}${instructor.lastName.charAt(0)}`.toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1 text-[14px] leading-5">
        <span className="font-medium text-[#1D1D1D]">{fullName}</span>
        {instructor.email && (
          <span className="ml-1 text-[#94A3B8]">({instructor.email})</span>
        )}
      </div>
    </div>
  );
}
