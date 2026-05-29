import { cn } from "@ssu/utils";

export interface CountdownBlocksProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  className?: string;
}

function Block({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[64px]">
      <span className="text-h2 font-bold text-neutral-900 tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-micro uppercase text-neutral-500">{label}</span>
    </div>
  );
}

export function CountdownBlocks({
  days,
  hours,
  minutes,
  seconds,
  className,
}: CountdownBlocksProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-4", className)}>
      <Block value={days} label="Day" />
      <Block value={hours} label="Hours" />
      <Block value={minutes} label="Minutes" />
      <Block value={seconds} label="Seconds" />
    </div>
  );
}
