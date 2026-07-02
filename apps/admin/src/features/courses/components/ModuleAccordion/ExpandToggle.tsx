import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandToggleProps {
  expanded: boolean;
  onToggle: () => void;
}

export function ExpandToggle({ expanded, onToggle }: ExpandToggleProps) {
  return (
    <button
      type="button"
      aria-label={expanded ? "Collapse module" : "Expand module"}
      aria-expanded={expanded}
      onClick={onToggle}
      className="shrink-0 p-1 text-[#64748B] transition hover:text-[#1D1D1D]"
    >
      {expanded ? (
        <ChevronUp className="h-5 w-5" strokeWidth={3} />
      ) : (
        <ChevronDown className="h-5 w-5" strokeWidth={3} />
      )}
    </button>
  );
}
