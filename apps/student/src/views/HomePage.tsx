"use client";

import {
  useStudentAssignments,
  useConnectGoogle,
  useGoogleConnectionStatus,
  useSession,
  useStudentProgress,
  useUpcomingSessions,
} from "@ssu/queries";
import { studentPath } from "@/lib/studentRoutes";
import {
  AlertBanner,
  AssignmentSummaryCard,
  ConnectGoogleBanner,
  DashboardEmptyState,
  GreetingTitle,
  SectionHeader,
  SessionCard,
  Skeleton,
  WelcomeCard,
} from "@ssu/ui";
import { formatDate } from "@ssu/utils";
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

function formatSessionTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function HomePage() {
  const router = useRouter();
  const { data: user } = useSession();
  const progress = useStudentProgress();
  const sessions = useUpcomingSessions();
  const assignments = useStudentAssignments();
  const googleStatus = useGoogleConnectionStatus();
  const connectGoogle = useConnectGoogle();

  const first = user?.firstName ?? "there";
  const sessionList = sessions.data ?? [];
  const assignmentList = (assignments.data ?? []).slice(0, 4);

  const showGoogleBanner =
    googleStatus.data?.connected === false && !googleStatus.isLoading;

  const overallPercent = useMemo(() => {
    if (progress.data) return progress.data.overallScorePercent;
    const courses = assignments.data;
    if (!courses?.length) return 0;
    return 0;
  }, [progress.data, assignments.data]);

  return (
    <div className="space-y-8">
      <GreetingTitle>{`${greeting(first)}!`}</GreetingTitle>

      {showGoogleBanner && (
        <ConnectGoogleBanner onConnect={() => connectGoogle.mutate()} />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {progress.isLoading ? (
          <Skeleton className="h-56 rounded-2xl" />
        ) : (
          <WelcomeCard
            programTitle={progress.data?.enrolledProgramTitle ?? "your program"}
            progressPercent={overallPercent}
          />
        )}

        <section className="rounded-2xl border bg-white p-5 shadow-card">
          <h2 className="text-h3 font-bold text-neutral-900 mb-4">
            Live Sessions
          </h2>
          {sessions.isLoading ? (
            <Skeleton className="h-40 rounded-xl" />
          ) : sessionList.length === 0 ? (
            <DashboardEmptyState
              icon={GraduationCap}
              title="You don't have any live session yet"
              description="When you do, they'll show up here"
            />
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {sessionList.map((s, i) => (
                <SessionCard
                  key={s.id}
                  title={s.title}
                  time={formatSessionTime(s.startsAt)}
                  date={formatDate(s.startsAt)}
                  status={s.isLive ? "live" : "upcoming"}
                  highlighted={i === 0 && s.isLive}
                  action={
                    <Link
                      href={`/classroom/${s.id}`}
                      className="text-small font-semibold text-brand-green hover:underline"
                    >
                      {s.isLive ? "Join now >" : "Add to reminder >"}
                    </Link>
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border bg-white p-5 shadow-card">
        <SectionHeader
          title="Assignments"
          action={
            <Link
              href={studentPath("/assessments")}
              className="text-small font-semibold text-brand-green hover:underline"
            >
              View more
            </Link>
          }
          className="mb-4"
        />
        {assignments.isError && (
          <AlertBanner variant="error" title="Could not load assignments">
            Please try again later.
          </AlertBanner>
        )}
        {assignments.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : assignmentList.length === 0 ? (
          <DashboardEmptyState
            icon={Notebook}
            title="You don't have any assignment yet"
            description="When you do, they'll show up here"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {assignmentList.map((a) => (
              <AssignmentSummaryCard
                key={a.id}
                title={a.title}
                moduleLabel="Understanding The Market"
                score={70}
                dueDate={formatDate(a.dueAt)}
                showDueBadge={a.status === "overdue"}
                onClick={() => router.push(studentPath(`/assessments/${a.id}`))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
