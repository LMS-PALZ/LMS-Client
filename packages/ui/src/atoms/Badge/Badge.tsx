import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ssu/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium text-micro uppercase tracking-wide px-2.5 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-neutral-100 text-neutral-700",
        "not-started": "bg-neutral-100 text-neutral-600",
        submitted: "bg-blue-100 text-blue-700",
        graded: "bg-brand-green-100 text-brand-green",
        returned: "bg-amber-100 text-amber-700",
        overdue: "bg-red-100 text-red-700",
        active: "bg-brand-green-100 text-brand-green",
        pending: "bg-amber-100 text-amber-700",
        suspended: "bg-red-100 text-red-700",
        student: "bg-blue-100 text-blue-700",
        trainer: "bg-purple-100 text-purple-700",
        admin: "bg-neutral-800 text-white",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
