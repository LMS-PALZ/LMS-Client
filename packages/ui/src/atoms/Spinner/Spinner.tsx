import { cn } from "@ssu/utils";
import { Loader2 } from "lucide-react";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  className?: string;
  label?: string;
  size?: SpinnerSize;
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Spinner({
  className,
  label = "Loading",
  size = "lg",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <Loader2
        className={cn(SIZE_CLASSES[size], "animate-spin text-brand-green")}
        aria-hidden
      />
    </span>
  );
}
