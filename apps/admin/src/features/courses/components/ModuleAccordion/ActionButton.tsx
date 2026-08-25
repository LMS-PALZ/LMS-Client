import type { ReactNode } from "react";
import { cn } from "@ssu/utils";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
  children: ReactNode;
}

export function ActionButton({
  label,
  onClick,
  tone = "default",
  children,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "p-0.5 transition",
        tone === "danger"
          ? "text-[#64748B] hover:text-[#C62828]"
          : "text-[#64748B] hover:text-[#1D1D1D]",
      )}
    >
      {children}
    </button>
  );
}
