"use client";

import { ArrowUpRight } from "lucide-react";

interface LiveClassBannerProps {
  title: string;
  time: string;
  date: string;
  programName: string;
  zoomJoinUrl?: string;
}

export function LiveClassBanner({
  title,
  time,
  date,
  programName,
  zoomJoinUrl,
}: LiveClassBannerProps) {
  return (
    <div
      onClick={() => {
        if (zoomJoinUrl) {
          window.open(zoomJoinUrl, "_self");
        }
      }}
      className="flex w-full items-center justify-between rounded-2xl  bg-[#E6F3E8] px-3 py-3"
    >
      <section className="flex items-center">
        <span className="flex  items-center  gap-2  rounded-full  bg-[#FFE3E3]  px-4  py-1 text-sm  font-medium text-[#C92A2A]">
          <span className="h-2 w-2 rounded-full bg-[#2F6F4F]" />
          Live
        </span>

        <span className="ml-4 text-[12px] text-[#6B7280]">
          {time}· {date}
        </span>

        <span className="mx-3 text-[#CBD5E1]">|</span>
        <span className="text-[13px] text-[#1F2937] flex items-center justify-center gap-1">
          <h3>{programName}</h3> : <p>{title}</p>
        </span>
      </section>

      <ArrowUpRight size={18} className="text-[#4D7C59]" />
    </div>
  );
}
