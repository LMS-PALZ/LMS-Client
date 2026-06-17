import type { ClassroomCourseDetail } from "@/lib/classroom-data";
import { DashboardEmptyState } from "@ssu/ui";
import { FileText, ExternalLink } from "lucide-react";

export function ClassroomResourcesPage({
  course,
}: {
  course: ClassroomCourseDetail;
}) {
  if (!course.resources.length) {
    return (
      <DashboardEmptyState
        icon={FileText}
        title="No resources available"
        description="Resources for this class will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {course.resources.map((resource) => {
        if (resource.url) {
          return (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-[12px] border border-[#E8EDF5] bg-white px-4 py-3 text-left transition hover:border-[#D4E2D8] hover:bg-[#FAFBFD]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ECF0F7] text-[#4E845F]">
                <ExternalLink className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-[#1D1D1D]">
                  {resource.title}
                </p>
                <p className="mt-0.5 text-[12px] text-[#7A8594] capitalize">
                  {resource.type}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            </a>
          );
        }

        if (resource.content) {
          return (
            <div
              key={resource.id}
              className="rounded-[12px] border border-[#E8EDF5] bg-[#FAFBFD] px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ECF0F7] text-[#4E845F]">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[14px] font-medium text-[#1D1D1D]">
                    {resource.title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#7A8594] capitalize">
                    {resource.type}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-6 text-[#495057]">
                {resource.content}
              </p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
