import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ssu/utils";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";

const banner = cva("flex gap-3 rounded-xl border p-4 text-body", {
  variants: {
    variant: {
      info: "border-blue-200 bg-blue-50 text-blue-900",
      success: "border-brand-green-200 bg-brand-green-50 text-brand-green-900",
      warning: "border-amber-200 bg-brand-amber-50 text-amber-900",
      error: "border-red-200 bg-red-50 text-red-900",
    },
  },
  defaultVariants: { variant: "info" },
});

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
} as const;

export interface AlertBannerProps extends VariantProps<typeof banner> {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function AlertBanner({
  variant = "info",
  title,
  children,
  className,
}: AlertBannerProps) {
  const Icon = icons[variant ?? "info"];
  return (
    <div className={cn(banner({ variant }), className)} role="alert">
      <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
      <div className="min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-small sm:text-body">{children}</div>
      </div>
    </div>
  );
}
