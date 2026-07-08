import { Download } from "lucide-react";
import type { ClassroomResource } from "@/lib/classroom/types";

export function ClassroomResourceRow({
  resource,
}: {
  resource: ClassroomResource;
}) {
  return (
    <a
      href={resource.fileUrl ?? resource.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[15px] border border-[#E8EDF5] bg-white p-5 transition hover:border-[#D4E2D8] hover:bg-[#FAFBFD]"
    >
      <p className="text-[14px] font-medium text-[#1D1D1D]">{resource.title}</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[14px] text-[#7A8594]">
        <span>{resource.meta}</span>
        <span className="text-[#D1D5DB]">·</span>
        <span className="inline-flex items-center gap-1 font-medium text-[#4E845F]">
          <Download className="h-3.5 w-3.5" aria-hidden />
          Download
        </span>
      </p>
    </a>
  );
}
