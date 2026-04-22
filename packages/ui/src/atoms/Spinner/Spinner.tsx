import { cn } from "@ssu/utils";
import { Loader2 } from "lucide-react";

export interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex", className)}
    >
      <Loader2 className="h-5 w-5 animate-spin text-brand-green" aria-hidden />
    </span>
  );
}
