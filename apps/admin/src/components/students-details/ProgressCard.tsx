"use client";

import { ProgressData } from "@ssu/types";

interface ProgressCardProps {
  title: string;
  data: ProgressData;
}

export function ProgressCard({ title, data }: ProgressCardProps) {
  const bars = 32;

  const activeBars = Math.round((data?.progressPercent / 100) * bars);

  return (
    <div className="rounded-[24px] bg-[#F9FAFB] p-6">
      <h3 className="text-[15px] font-semibold">{title}</h3>

      <div className="mt-6 flex items-center gap-2">
        {Array.from({ length: bars }).map((_, index) => (
          <div
            key={index}
            className={`h-8 w-2 rounded-full ${
              index < activeBars ? "bg-[#43B04A]" : "bg-[#E4EAF2]"
            }`}
          />
        ))}
        <span className="text-[28px] font-semibold">
          {data?.progressPercent}%
        </span>
      </div>

      {data?.description && (
        <p className="mt-2 text-[#6B7280]">{data?.description}</p>
      )}
    </div>
  );
}
