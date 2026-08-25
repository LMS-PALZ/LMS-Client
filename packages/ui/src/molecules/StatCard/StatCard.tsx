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
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border p-5 border-1 border-[#ECF0F6]",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-[#FAFAFA]">
          <Icon className="h-5 w-5" />
        </div>
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
      </div>
    </div>
  );
}
