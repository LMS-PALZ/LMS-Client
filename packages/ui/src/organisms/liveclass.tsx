"use client";

import { ArrowUpRight } from "lucide-react";

interface LiveClassBannerProps {
  title: string;
  time: string;
  date: string;
  onClick?: () => void;
}

export function LiveClassBanner({
  title,
  time,
  date,
  onClick,
}: LiveClassBannerProps) {
  return (
    <div
      onClick={onClick}
      className="flex w-full items-center rounded-2xl  bg-[#E6F3E8] px-3 py-3"
    >
      <span className="flex  items-center  gap-2  rounded-full  bg-[#FFE3E3]  px-4  py-1 text-sm  font-medium text-[#C92A2A]">
        <span className="h-2 w-2 rounded-full bg-[#2F6F4F]" />
        Live
      </span>

      <span className="ml-4 text-[12px] text-[#6B7280]">
        {time}· {date}
      </span>

      <span className="mx-3 text-[#CBD5E1]">|</span>

      <h3 className="flex-1 text-left text-[13px] font-medium text-[#1F2937]">
        {title}
      </h3>

      <ArrowUpRight size={18} className="text-[#4D7C59]" />
    </div>
  );
}
