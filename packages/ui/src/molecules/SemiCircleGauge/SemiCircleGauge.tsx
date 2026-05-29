import { cn } from "@ssu/utils";

export interface SemiCircleGaugeProps {
  value: number;
  className?: string;
}

export function SemiCircleGauge({ value, className }: SemiCircleGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const degrees = (clamped / 100) * 180;

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="relative h-28 w-48 overflow-hidden">
        <div
          className="absolute inset-x-0 bottom-0 h-24 w-48 rounded-t-full bg-neutral-200"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 w-48 origin-bottom rounded-t-full bg-brand-amber"
          style={{
            clipPath: `polygon(50% 100%, 0% 100%, 0% ${100 - degrees}%, 50% 50%)`,
          }}
          aria-hidden
        />
        <p className="absolute inset-x-0 bottom-2 z-10 text-center text-h1 font-bold text-neutral-900">
          {clamped}%
        </p>
      </div>
      <div className="mt-1 flex w-48 justify-between text-micro text-neutral-400">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}
