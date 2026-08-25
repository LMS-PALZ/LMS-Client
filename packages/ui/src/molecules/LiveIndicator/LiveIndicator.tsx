import { cn } from "@ssu/utils";

export type LiveIndicatorSize = "xs" | "sm" | "md";
export type LiveIndicatorTone = "default" | "classroom" | "overlay";

const sizeStyles: Record<
  LiveIndicatorSize,
  { pill: string; dot: string; text: string }
> = {
  xs: {
    pill: "gap-1 rounded-full px-2 py-0.5 text-[9px]",
    dot: "h-1.5 w-1.5",
    text: "tracking-wide",
  },
  sm: {
    pill: "gap-1.5 rounded-full px-2.5 py-1 text-[11px]",
    dot: "h-2 w-2",
    text: "",
  },
  md: {
    pill: "gap-2 rounded-full px-3 py-1.5 text-[13px]",
    dot: "h-2.5 w-2.5",
    text: "",
  },
};

const toneStyles: Record<LiveIndicatorTone, string> = {
  default: "bg-[#FEE8E8] text-[#DC2626]",
  classroom: "bg-[#FCE3DE] text-[#D14B3D]",
  overlay:
    "border border-red-400/40 bg-[#DC2626] text-white shadow-[0_0_16px_rgba(220,38,38,0.55)]",
};

export interface LiveIndicatorProps {
  label?: string;
  size?: LiveIndicatorSize;
  tone?: LiveIndicatorTone;
  className?: string;
  /** Pulse the whole pill (default true). */
  breathe?: boolean;
  uppercase?: boolean;
}

export function LiveIndicator({
  label = "Live",
  size = "sm",
  tone = "default",
  className,
  breathe = true,
  uppercase = false,
}: LiveIndicatorProps) {
  const styles = sizeStyles[size];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center font-semibold",
        uppercase && "uppercase tracking-wide",
        styles.pill,
        toneStyles[tone],
        breathe &&
          "motion-safe:animate-live-breathe motion-reduce:animate-none",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center",
          styles.dot,
        )}
      >
        <span
          className={cn(
            "absolute inset-0 rounded-full bg-[#DC2626] motion-safe:animate-live-dot-breathe motion-reduce:animate-none",
            tone === "overlay" && "bg-white/90",
          )}
          aria-hidden
        />
        <span
          className={cn(
            "relative rounded-full bg-[#DC2626]",
            styles.dot,
            tone === "overlay" && "bg-white",
          )}
          aria-hidden
        />
      </span>
      {label ? (
        <span
          className={cn(
            styles.text,
            breathe &&
              "motion-safe:animate-live-text-breathe motion-reduce:animate-none",
          )}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
