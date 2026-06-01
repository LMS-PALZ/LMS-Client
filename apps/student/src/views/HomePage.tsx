"use client";

import {
  useStudentAssignments,
  useSession,
  useStudentProgress,
  useUpcomingSessions,
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
import { useProfileSetup } from "@/contexts/ProfileSetupContext";
import {
  assignmentCardProps,
  formatSessionDate,
  formatSessionTime,
} from "@/lib/assignment-display";
import { GraduationCap, Notebook } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

function greeting(first: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${first}`;
  if (h < 18) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export function HomePage() {
  const router = useRouter();
  const { ensureProfileForAction } = useProfileSetup();
  const { data: user } = useSession();
  const progress = useStudentProgress();
  const sessions = useUpcomingSessions();
  const assignments = useStudentAssignments();

  const first = user?.firstName?.trim() || "there";
  const showGreetingSkeleton = !user;
  const sessionList = sessions.data ?? [];
  const assignmentList = (assignments.data ?? []).slice(0, 4);

  const overallPercent = useMemo(() => {
    if (progress.data) return progress.data.overallScorePercent;
    return 0;
  }, [progress.data]);

  const programTitle = progress.data?.enrolledProgramTitle ?? "web development";

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
          isLoading={sessions.isLoading}
          loadingSkeleton={<SessionListSkeleton count={3} />}
          emptyState={
            <DashboardEmptyState
              icon={GraduationCap}
              title="You don't have any live session yet"
              description="When you do, they'll show up here"
            />
          }
          sessions={sessionList.map((s) => ({
            id: s.id,
            title: s.title,
            time: formatSessionTime(s.startsAt),
            date: formatSessionDate(s.startsAt),
            status: s.isLive ? ("live" as const) : ("upcoming" as const),
            action: s.isLive ? (
              <button
                type="button"
                onClick={() => {
                  if (!ensureProfileForAction()) return;
                  router.push(`/classroom/${s.id}`);
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
                {...assignmentCardProps(a)}
                onClick={() => router.push(`/assessments/${a.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
