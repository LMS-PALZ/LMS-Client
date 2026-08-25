import { cn } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";
import { StatusBadge } from "../StatusBadge";
import { InfoMetric } from "../InfoMetric";

export interface EnrolledCourseHeroMetric {
  icon: LucideIcon;
  label: string;
}

export interface EnrolledCourseHeroProps {
  title: string;
  description: string;
  metrics: EnrolledCourseHeroMetric[];
  className?: string;
}

export function EnrolledCourseHero({
  title,
  description,
  metrics,
  className,
}: EnrolledCourseHeroProps) {
  return (
    <article
      className={cn(
        "rounded-2xl bg-brand-green-50 p-6 space-y-4 lg:col-span-2",
        className,
      )}
    >
      <StatusBadge variant="enrolled">Enrolled</StatusBadge>
      <h2 className="text-h1 font-bold text-neutral-900">{title}</h2>
      <p className="text-body text-neutral-600 max-w-2xl">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {metrics.map((m) => (
          <InfoMetric key={m.label} icon={m.icon} label={m.label} />
        ))}
      </div>
    </article>
  );
}
