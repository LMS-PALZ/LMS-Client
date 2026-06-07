import { cn } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  description?: string;
  accent?: "green" | "amber" | "neutral";
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  description,
  accent = "green",
  className,
}: StatCardProps) {
  const accentMap = {
    green: {
      bg: "bg-brand-green-50",
      icon: "text-brand-green",
      border: "border-brand-green-200",
    },
    amber: {
      bg: "bg-brand-amber-50",
      icon: "text-brand-amber",
      border: "border-amber-200",
    },
    neutral: {
      bg: "bg-neutral-50",
      icon: "text-neutral-500",
      border: "border-neutral-200",
    },
  };
  const a = accentMap[accent];

  return (
    <div
      className={cn(
        "bg-white rounded-xl border p-5 shadow-card hover:shadow-card-hover transition-shadow",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-small text-neutral-500 mb-1">{label}</p>
          <p className="text-h2 font-bold text-neutral-900">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-small mt-1",
                trend.value >= 0 ? "text-brand-green" : "text-red-500",
              )}
            >
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%{" "}
              {trend.label}
            </p>
          )}
          {description && (
            <p className="text-small text-neutral-500 mt-2">{description}</p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-xl border", a.bg, a.border)}>
          <Icon className={cn("h-5 w-5", a.icon)} />
        </div>
      </div>
    </div>
  );
}
