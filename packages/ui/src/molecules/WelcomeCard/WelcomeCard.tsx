import { cn } from "@ssu/utils";
import { SemiCircleGauge } from "../SemiCircleGauge";

export interface WelcomeCardProps {
  programTitle: string;
  progressPercent: number;
  className?: string;
}

export function WelcomeCard({
  programTitle,
  progressPercent,
  className,
}: WelcomeCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl bg-brand-amber-50 p-6 flex flex-col md:flex-row gap-6 min-h-[220px]",
        className,
      )}
    >
      <div className="flex-1 space-y-2">
        <h2 className="text-h2 font-bold text-neutral-900">Welcome to SSU</h2>
        <p className="text-body text-neutral-700">
          You&apos;re enrolled in {programTitle}. Let&apos;s learn great things
          today!
        </p>
        <p className="flex items-center gap-2 text-small text-neutral-600 mt-auto pt-4">
          <span className="h-2 w-2 rounded-full bg-brand-amber" aria-hidden />
          This is your overall score.
        </p>
      </div>
      <div className="flex items-center justify-center md:min-w-[200px]">
        <SemiCircleGauge value={progressPercent} />
      </div>
    </article>
  );
}
