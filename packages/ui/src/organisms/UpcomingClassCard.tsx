"use client";

interface UpcomingClassCardProps {
  title: string;
  time: string;
  date: string;
  programName: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function UpcomingClassCard({
  title,
  time,
  date,
  programName,
}: UpcomingClassCardProps) {
  return (
    <button className="flex w-full items-center rounded-2xl border border-[#E5E7EB] bg-white px-3 py-3">
      <span className="rounded-full bg-[#DBEAFE] px-3 py-1 text-[12px] text-[#2563EB]">
        Upcoming
      </span>

      <span className="ml-4 text-[13px] text-[#6B7280]">
        {time}· {formatDate(date)}
      </span>

      <span className="mx-3 text-[#CBD5E1]">|</span>
      <span className="text-[13px] text-[#1F2937] flex items-center justify-center gap-1">
        <h3>{programName}</h3> : <p>{title}</p>
      </span>
    </button>
  );
}
