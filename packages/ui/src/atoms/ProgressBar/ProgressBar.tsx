import { cn } from "@ssu/utils";

export interface ProgressBarProps {
  value: number;
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  size = "md",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const height = size === "sm" ? "h-1.5" : "h-2.5";
  const color =
    clamped === 100
      ? "bg-brand-green"
      : clamped >= 50
        ? "bg-brand-green-light"
        : "bg-brand-amber";

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-small text-neutral-500">Progress</span>
          <span className="text-small font-semibold text-neutral-700">
            {clamped}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-neutral-100 rounded-full overflow-hidden",
          height,
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color,
          )}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
