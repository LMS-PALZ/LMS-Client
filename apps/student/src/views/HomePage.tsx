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
import {
  buildHomeSessionCards,
  formatSessionDayLabel,
} from "@/lib/sessions/today-sessions";
import { ClassroomCourseCard } from "@/views/Classroom/ClassroomCourseCard";
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

  const joinSession = (session: (typeof sessionList)[number]) => {
    const programQuery = session.programId
      ? `?programId=${encodeURIComponent(session.programId)}`
      : "";
    router.push(`/classroom/${session.id}${programQuery}`);
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
              title="No classes today"
              description="Live and upcoming classes scheduled for today will show up here."
            />
          }
          sessions={sessionList.map((s) => ({
            id: s.id,
            title: s.title,
            time: formatSessionTime(s.startsAt),
            date: formatSessionDayLabel(s.startsAt),
            status: s.isLive ? ("live" as const) : ("upcoming" as const),
            action: s.isLive ? (
              <button
                type="button"
                onClick={() => {
                  joinSession(s);
                }}
                className="font-semibold text-[#4E845F] hover:underline"
              >
                Join session &gt;
              </button>
            ) : (
              <span className="font-semibold text-neutral-300">
                Join session &gt;
              </span>
            ),
          }))}
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
          <AlertBanner variant="error" title="Could not load assignments">
            Please try again later.
          </AlertBanner>
        )}
        {assignments.isLoading ? (
          <AssignmentGridSkeleton count={4} />
        ) : assignmentList.length === 0 ? (
          <DashboardEmptyState
            icon={Notebook}
            title="You don't have any assignment yet"
            description="When you do, they'll show up here"
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
