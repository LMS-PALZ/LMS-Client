import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ssu/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-micro font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        live: "bg-red-50 text-red-600",
        upcoming: "bg-blue-50 text-blue-600",
        due: "bg-red-50 text-red-600",
        enrolled: "bg-brand-green-50 text-brand-green",
        ended: "bg-neutral-100 text-neutral-600",
      },
    },
    defaultVariants: { variant: "upcoming" },
  },
);

export interface StatusBadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  showDot?: boolean;
}

export function StatusBadge({
  className,
  variant,
  showDot = variant === "live",
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    >
      {showDot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      )}
      {children}
    </span>
  );
}
