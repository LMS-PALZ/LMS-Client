import { cn } from "@ssu/utils";
import { GAUGE_PROGRESS_COLOR, SemiCircleGauge } from "../SemiCircleGauge";

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
        "flex min-h-[240px] flex-col rounded-2xl bg-[#FFE0C5] p-5 sm:min-h-[260px] sm:p-6",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-[20px] font-bold leading-tight text-neutral-900 sm:text-[22px]">
          Welcome to SSU
        </h2>
        <p className="text-[14px] leading-[1.55] text-neutral-800 sm:text-[15px]">
          You&apos;re enrolled in {programTitle}.
          <br />
          Let&apos;s learn great things today!
        </p>
      </div>

      <div className="mt-auto inline-flex items-end pt-6 sm:pt-8">
        <SemiCircleGauge value={progressPercent} />
        <p className="-ml-3 mb-[11px] flex shrink-0 items-center gap-2 whitespace-nowrap text-[12px] text-neutral-700 sm:-ml-4 sm:mb-[12px] sm:text-[13px]">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: GAUGE_PROGRESS_COLOR }}
            aria-hidden
          />
          <span>This is your overall score</span>
        </p>
      </div>
    </article>
  );
}
