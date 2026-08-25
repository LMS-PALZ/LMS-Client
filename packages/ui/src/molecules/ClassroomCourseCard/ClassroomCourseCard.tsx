import { cn } from "@ssu/utils";
import { BookOpen, CheckCircle2 } from "lucide-react";

export interface ClassroomCourseCardProps {
  title: string;
  courseNumber: number;
  syllabusCount: number;
  logoSrc?: string;
  className?: string;
  onClick?: () => void;
}

export function ClassroomCourseCard({
  title,
  courseNumber,
  syllabusCount,
  logoSrc = "/logo.png",
  className,
  onClick,
}: ClassroomCourseCardProps) {
  const Wrapper = onClick ? "button" : "article";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-2xl border bg-white overflow-hidden shadow-card text-left w-full",
        onClick && "hover:shadow-card-hover transition-shadow cursor-pointer",
        className,
      )}
    >
      <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
        <img
          src={logoSrc}
          alt=""
          className="h-12 w-12 object-contain opacity-90"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-h4 font-semibold text-neutral-900 line-clamp-2">
          {title}
        </h3>
        <p className="flex items-center gap-2 text-small text-neutral-600">
          <CheckCircle2 className="h-4 w-4 text-brand-amber" aria-hidden />
          Course {courseNumber}
        </p>
        <p className="flex items-center gap-2 text-small text-neutral-600">
          <BookOpen className="h-4 w-4 text-brand-amber" aria-hidden />
          {syllabusCount} Syllabus
        </p>
      </div>
    </Wrapper>
  );
}
