import { cn } from "@ssu/utils";
import type { ReactNode } from "react";
import { Button } from "../../atoms/Button";
import { ProgressBar } from "../../atoms/ProgressBar";

export interface CourseCardProps {
  title: string;
  trainerName: string;
  progressPercent: number;
  bannerUrl?: string | null;
  footer?: ReactNode;
  onContinue?: () => void;
  className?: string;
}

export function CourseCard({
  title,
  trainerName,
  progressPercent,
  bannerUrl,
  footer,
  onContinue,
  className,
}: CourseCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border bg-white shadow-card hover:shadow-card-hover transition-shadow",
        className,
      )}
    >
      <div className="aspect-[3/1] w-full bg-brand-green-100 relative">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green to-brand-green-900 opacity-90" />
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-h3 text-neutral-900">{title}</h3>
          <p className="text-small text-neutral-500 mt-1">{trainerName}</p>
        </div>
        <ProgressBar value={progressPercent} showLabel />
        {footer}
        {onContinue && (
          <Button variant="primary" className="w-full" onClick={onContinue}>
            Continue
          </Button>
        )}
      </div>
    </article>
  );
}
