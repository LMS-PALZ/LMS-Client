"use client";

import {
  useStudentassignments,
  useSession,
  useStudentProgress,
  useUpcomingSessions,
  useEnrolledProgram,
  useProfileDetail,
} from "@ssu/queries";
import {
  AlertBanner,
  AssignmentSummaryCard,
  DashboardEmptyState,
  GreetingTitle,
  SectionHeader,
  LiveSessionsPanel,
  AssignmentGridSkeleton,
  GreetingTitleSkeleton,
  SessionListSkeleton,
  WelcomeCardSkeleton,
  WelcomeCard,
} from "@ssu/ui";
import {
  assignmentCardProps,
  formatSessionTime,
} from "@/lib/assignment-display";
import { classroomSessionHref } from "@/lib/classroom/recording-embed";
import { resolveLessonSessionPhase } from "@/lib/calendar/session-phase";
import {
  hasRecordingUrl,
  isLiveJoinEnabled,
  isRecordingPlayEnabled,
  resolveHomeSessionCardStatus,
} from "@/lib/sessions/session-access";
import {
  buildHomeSessionCards,
  formatSessionDayLabel,
} from "@/lib/sessions/today-sessions";
import { ClassroomCourseCard } from "@/views/Classroom/ClassroomCourseCard";
import {
  CLASS_ENDED_LABEL,
  CLASS_NOT_STARTED_LABEL,
  JOIN_LIVE_CLASS_LABEL,
  WATCH_RECORDED_CLASS_LABEL,
} from "@ssu/utils";
import { GraduationCap, Notebook } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import { useProfileStore, useSignupStore } from "@ssu/store";

function greeting(first: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${first}`;
  if (h < 18) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export function HomePage() {
  const router = useRouter();
  const { data: user } = useSession();
  const {
    data: profileData,
    program,
    generalPrograms,
    liveGeneralPrograms,
    hasLiveGeneralProgram,
  } = useEnrolledProgram();
  const progress = useStudentProgress();
  const sessions = useUpcomingSessions();
  useProfileDetail();
  const programId = useSignupStore((state) => state.user?.programId ?? "");
  const assignments = useStudentassignments(programId);
  const setprofile = useProfileStore((state) => state.setUser);

  useEffect(() => {
    if (!profileData) return;

    setprofile({
      id: profileData?.student?._id ?? "",
      email: profileData?.student?.email ?? "",
      first_name: profileData?.student?.first_name ?? "",
      last_name: profileData?.student?.last_name ?? "",
      profileUploaded: profileData?.student?.profileUploaded,
      role: profileData?.student?.role ?? "student",
    });
  }, [profileData, setprofile]);

  const first = user?.firstName?.trim() || "there";
  const showGreetingSkeleton = !user;
  const sessionList = useMemo(
    () => buildHomeSessionCards(sessions.data ?? []),
    [sessions.data],
  );
  const assignmentList = (assignments.data ?? []).slice(0, 4);

  const overallPercent = useMemo(() => {
    if (progress.data) return progress.data.overallScorePercent;
    return 0;
  }, [progress.data]);

  const programTitle =
    progress.data?.enrolledProgramTitle || program?.title || "your course";

  const openClass = (session: (typeof sessionList)[number]) => {
    const recorded = hasRecordingUrl(session);
    if (recorded && !isRecordingPlayEnabled(session)) return;

    const canJoin = !recorded && isLiveJoinEnabled(session);
    router.push(
      classroomSessionHref({
        lessonId: session.id,
        programId: session.programId,
        recordingUrl: session.recordingUrl,
        mode: recorded ? "watch" : canJoin ? "join" : "view",
      }),
    );
  };

  return (
    <div className="space-y-8">
      {showGreetingSkeleton ? (
        <GreetingTitleSkeleton />
      ) : (
        <GreetingTitle>{`${greeting(first)}!`}</GreetingTitle>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-6">
        {progress.isLoading ? (
          <WelcomeCardSkeleton />
        ) : (
          <WelcomeCard
            programTitle={programTitle}
            progressPercent={overallPercent}
          />
        )}

        <LiveSessionsPanel
          title="Classes Overview"
          isLoading={sessions.isLoading}
          loadingSkeleton={<SessionListSkeleton count={3} />}
          emptyState={
            <DashboardEmptyState
              icon={GraduationCap}
              title="Nothing here yet"
              description="See My Classroom for updates."
            />
          }
          sessions={sessionList.map((s) => {
            const recorded = hasRecordingUrl(s);
            const canPlay = recorded && isRecordingPlayEnabled(s);
            const canJoin = !recorded && isLiveJoinEnabled(s);
            const locked = recorded && !canPlay;
            const phase = resolveLessonSessionPhase(
              s.startsAt,
              s.durationMinutes,
              s.isLive,
            );
            const label = locked
              ? CLASS_NOT_STARTED_LABEL
              : canPlay
                ? WATCH_RECORDED_CLASS_LABEL
                : canJoin
                  ? JOIN_LIVE_CLASS_LABEL
                  : phase === "ended"
                    ? CLASS_ENDED_LABEL
                    : CLASS_NOT_STARTED_LABEL;
            return {
              id: s.id,
              title: s.title,
              time: formatSessionTime(s.startsAt),
              date: formatSessionDayLabel(s.startsAt),
              status: resolveHomeSessionCardStatus(s),
              disabled: locked,
              action: (
                <button
                  type="button"
                  onClick={() => openClass(s)}
                  disabled={locked}
                  className={
                    locked
                      ? "cursor-not-allowed font-semibold text-[#94A3B8]"
                      : "font-semibold text-[#4E845F] hover:underline"
                  }
                >
                  {label}
                  {locked ? "" : " >"}
                </button>
              ),
            };
          })}
        />
      </div>

      {generalPrograms.length > 0 ? (
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-6">
          <SectionHeader variant="inline" title="Courses" className="mb-5" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {generalPrograms.map((item) => {
              const liveFromList = hasLiveGeneralProgram
                ? liveGeneralPrograms.find((live) => live.programId === item.id)
                : undefined;
              const liveLesson =
                liveFromList ??
                (item.isLiveNow && item.liveLesson?.lessonId
                  ? item.liveLesson
                  : null);
              const lessonId =
                liveFromList?.lessonId ??
                (liveLesson && "lessonId" in liveLesson
                  ? liveLesson.lessonId
                  : undefined);
              const href = lessonId
                ? `/classroom/${lessonId}?programId=${encodeURIComponent(item.id)}`
                : `/classroom?programId=${encodeURIComponent(item.id)}`;

              return (
                <ClassroomCourseCard
                  key={item.id}
                  course={{ id: item.id, title: item.title }}
                  href={href}
                  subtitle={item.cohortName || item.description}
                  meta={item.duration}
                />
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-6">
        <SectionHeader
          variant="inline"
          title="Assignments"
          action={
            <Link
              href="/assessments"
              className="text-[13px] font-semibold text-[#4E845F] hover:underline sm:text-[14px]"
            >
              View more
            </Link>
          }
          className="mb-5"
        />
        {assignments.isError && (
          <AlertBanner variant="error" title="Something went wrong">
            Refresh and try again.
          </AlertBanner>
        )}
        {assignments.isLoading ? (
          <AssignmentGridSkeleton count={4} />
        ) : assignmentList.length === 0 ? (
          <DashboardEmptyState
            icon={Notebook}
            title="Nothing here yet"
            description="See Assessments for updates."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {assignmentList.map((a) => (
              <AssignmentSummaryCard
                key={a.id}
                {...assignmentCardProps(a).card}
                onClick={() => router.push(`/assessments/${a.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
