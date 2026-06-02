import { cn } from "@ssu/utils";

const items = [
  { label: "Live class", className: "bg-[#DC2626]" },
  { label: "Upcoming class", className: "bg-[#2563EB]" },
  { label: "Past class", className: "bg-[#4E845F]" },
  { label: "Assignment due", className: "bg-[#F49221]" },
] as const;

export function CalendarLegend({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-neutral-600 sm:text-[13px]",
        className,
      )}
      aria-label="Calendar legend"
    >
      {items.map((item) => (
        <li key={item.label} className="inline-flex items-center gap-2">
          <span
            className={cn("h-2.5 w-2.5 shrink-0 rounded-full", item.className)}
            aria-hidden
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
