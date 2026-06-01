import { cn } from "@ssu/utils";

export const GAUGE_TRACK_COLOR = "#FFFFFF";
export const GAUGE_PROGRESS_COLOR = "#F49221";

export interface SemiCircleGaugeProps {
  value: number;
  className?: string;
}

const WIDTH = 240;
const HEIGHT = 142;
const STROKE = 14;
const RADIUS = 80;
const CENTER_X = WIDTH / 2;
const ARC_Y = 108;
const SCALE_LABEL_TOP = ARC_Y + STROKE / 2 + 10;

export function SemiCircleGauge({ value, className }: SemiCircleGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const halfCircumference = Math.PI * RADIUS;
  const progressLength = (clamped / 100) * halfCircumference;

  const arcPath = `M ${CENTER_X - RADIUS} ${ARC_Y} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X + RADIUS} ${ARC_Y}`;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: WIDTH, height: HEIGHT }}
      aria-hidden
    >
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="overflow-visible"
      >
        <path
          d={arcPath}
          fill="none"
          stroke={GAUGE_TRACK_COLOR}
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        <path
          d={arcPath}
          fill="none"
          stroke={GAUGE_PROGRESS_COLOR}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${progressLength} ${halfCircumference}`}
        />
      </svg>
      <p className="absolute left-1/2 top-[62px] -translate-x-1/2 text-[36px] font-bold leading-none text-neutral-900">
        {clamped}%
      </p>
      <span
        className="absolute text-[12px] font-medium text-neutral-500"
        style={{ left: CENTER_X - RADIUS - 2, top: SCALE_LABEL_TOP }}
      >
        0
      </span>
      <span
        className="absolute text-[12px] font-medium text-neutral-500"
        style={{ left: CENTER_X + RADIUS - 20, top: SCALE_LABEL_TOP }}
      >
        100
      </span>
    </div>
  );
}
