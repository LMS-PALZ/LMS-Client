"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import {
  useAdminProgram,
  useProgramClassroomModules,
  useSession,
} from "@ssu/queries";
import { AlertBanner, Button } from "@ssu/ui";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Radio,
  Video,
} from "lucide-react";
import { ZoomLiveEmbed } from "@/components/zoom/ZoomLiveEmbed";
import { AdminCourseDetailSkeleton } from "@/components/skeletons";
import {
  formatLessonSchedule,
  resolveLessonMeetingNumber,
  resolveLessonMeetUrl,
} from "@/features/courses/lib/lesson-session";

interface CourseLessonDetailPageProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

export function CourseLessonDetailPage({
  courseId,
  moduleId,
  lessonId,
}: CourseLessonDetailPageProps) {
  const router = useRouter();
  const { data: user } = useSession();
  const {
    data: program,
    isLoading: isProgramLoading,
    isError: isProgramError,
    error: programError,
  } = useAdminProgram(courseId);
  const {
    data: modules = [],
    isLoading: isModulesLoading,
    isError: isModulesError,
    error: modulesError,
  } = useProgramClassroomModules(courseId, Boolean(program?.id));
  const [isJoined, setIsJoined] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const module = useMemo(
    () => modules.find((item) => item.id === moduleId) ?? null,
    [modules, moduleId],
  );

  const lesson = useMemo(
    () => module?.lessons?.find((item) => item.id === lessonId) ?? null,
    [module, lessonId],
  );

  const meetUrl = lesson ? resolveLessonMeetUrl(lesson) : "";
  const meetingNumber = lesson ? resolveLessonMeetingNumber(lesson) : "";
  const hostName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.email ||
    "Host";

  const courseHref = adminPath(`/courses/${courseId}`);
  const isLiveSession = lesson?.lessonType === "live_session";
  const canJoinInApp = Boolean(meetUrl || meetingNumber);

  if ((isProgramLoading || isModulesLoading) && !lesson) {
    return <AdminCourseDetailSkeleton />;
  }

  if (isProgramError || !program) {
    return (
      <div className="space-y-4">
        <AlertBanner variant="error">
          {programError instanceof Error
            ? programError.message
            : "Unable to load this course."}
        </AlertBanner>
        <Link
          href={adminPath("/courses")}
          className="inline-flex items-center gap-2 text-[14px] text-[#4C7D5B] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </Link>
      </div>
    );
  }

  if (isModulesError) {
    return (
      <div className="space-y-4">
        <AlertBanner variant="error">
          {modulesError instanceof Error
            ? modulesError.message
            : "Unable to load course modules."}
        </AlertBanner>
        <Link
          href={courseHref}
          className="inline-flex items-center gap-2 text-[14px] text-[#4C7D5B] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Link>
      </div>
    );
  }

  if (!module || !lesson) {
    return (
      <div className="space-y-4">
        <AlertBanner variant="error">
          This session could not be found in the course modules.
        </AlertBanner>
        <Link
          href={courseHref}
          className="inline-flex items-center gap-2 text-[14px] text-[#4C7D5B] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-2 text-[13px] text-[#64748B]">
        <Link href={adminPath("/courses")} className="hover:text-[#4C7D5B]">
          Courses
        </Link>
        <span>/</span>
        <Link href={courseHref} className="hover:text-[#4C7D5B]">
          {program.title}
        </Link>
        <span>/</span>
        <span className="text-[#1D1D1D]">{module.title}</span>
        <span>/</span>
        <span className="text-[#1D1D1D]">{lesson.title}</span>
      </nav>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-[22px] font-semibold text-[#1D1D1D]">
                {lesson.title}
              </h1>
              {lesson.isLiveNow ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[12px] font-medium text-[#B91C1C]">
                  <Radio className="h-3.5 w-3.5" />
                  Live now
                </span>
              ) : null}
              {lesson.isPublished ? (
                <span className="rounded-full bg-[#E8F5EC] px-2.5 py-1 text-[12px] font-medium text-[#2F6B45]">
                  Published
                </span>
              ) : (
                <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[12px] font-medium text-[#64748B]">
                  Draft
                </span>
              )}
            </div>
            <p className="text-[14px] text-[#64748B]">
              {module.weekLabel ? `${module.weekLabel} · ` : ""}
              {module.title}
            </p>
            {(lesson.summary || lesson.overview) && (
              <p className="max-w-3xl text-[14px] leading-6 text-[#475569]">
                {lesson.overview || lesson.summary}
              </p>
            )}
          </div>

          <Link
            href={courseHref}
            className="inline-flex shrink-0 items-center gap-2 text-[14px] font-medium text-[#4C7D5B] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course
          </Link>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-[#EEF2F6] pt-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
              Type
            </dt>
            <dd className="mt-1 text-[14px] text-[#1D1D1D]">
              {isLiveSession ? "Live session" : lesson.lessonType}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
              Schedule
            </dt>
            <dd className="mt-1 text-[14px] text-[#1D1D1D]">
              {formatLessonSchedule(lesson.startsAt)}
            </dd>
          </div>
          {meetingNumber ? (
            <div>
              <dt className="text-[12px] font-medium uppercase tracking-wide text-[#94A3B8]">
                Meeting ID
              </dt>
              <dd className="mt-1 text-[14px] text-[#1D1D1D]">
                {meetingNumber}
              </dd>
            </div>
          ) : null}
        </dl>

        {isLiveSession && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {canJoinInApp && !isJoined ? (
              <Button
                type="button"
                onClick={() => setIsJoined(true)}
                className="inline-flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Join classroom
              </Button>
            ) : null}
            {meetUrl ? (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(meetUrl);
                    setLinkCopied(true);
                    window.setTimeout(() => setLinkCopied(false), 2000);
                  } catch {
                    setLinkCopied(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-[14px] text-[#64748B] transition-colors hover:text-[#4C7D5B]"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 text-[#4C7D5B]" />
                    <span className="text-[#4C7D5B]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy classroom link</span>
                  </>
                )}
              </button>
            ) : null}
          </div>
        )}
      </div>

      {isLiveSession && isJoined && canJoinInApp ? (
        <div className="overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <ZoomLiveEmbed
            meetUrl={meetUrl || `https://zoom.us/j/${meetingNumber}`}
            meetingNumber={meetingNumber || undefined}
            displayName={hostName}
            // Host (1) needs a Zoom ZAK token. Join as participant until ZAK is wired.
            role={0}
            onLeave={() => {
              setIsJoined(false);
              router.push(courseHref);
            }}
          />
        </div>
      ) : null}

      {isLiveSession && !canJoinInApp ? (
        <AlertBanner variant="warning">
          This live session does not have a Zoom link yet. Once the backend
          provisions the meeting, you can join it here.
        </AlertBanner>
      ) : null}

      {lesson.recordingUrl ? (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h2 className="text-[16px] font-semibold text-[#1D1D1D]">
            Recording
          </h2>
          <a
            href={lesson.recordingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-[14px] text-[#4C7D5B] hover:underline"
          >
            Open recording
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      ) : null}

      {(lesson.resources?.length ?? 0) > 0 ? (
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h2 className="text-[16px] font-semibold text-[#1D1D1D]">
            Resources
          </h2>
          <ul className="mt-3 space-y-2">
            {lesson.resources?.map((resource, index) => (
              <li key={resource.id || resource.url || String(index)}>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[14px] text-[#4C7D5B] hover:underline"
                  >
                    {resource.title || resource.url}
                  </a>
                ) : (
                  <span className="text-[14px] text-[#1D1D1D]">
                    {resource.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
