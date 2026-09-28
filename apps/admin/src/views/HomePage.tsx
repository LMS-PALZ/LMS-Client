"use client";

import {
  GreetingTitle,
  GreetingTitleSkeleton,
  LiveClassBanner,
  UpcomingClassCard,
  Skeleton,
} from "@ssu/ui";
import { adminPath } from "@ssu/config/portal-paths";
import { useSession, useAdminDashboard, useAdminCalendar } from "@ssu/queries";
import { cn, displayValue } from "@ssu/utils";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type DashboardClass = {
  programId?: string;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  id?: string;
  title?: string;
  programName?: string;
};

type CalendarClass = {
  href: string;
  lessonTitle: string;
  programTitle: string;
  sessionPhase: string;
};

function normalizeLabel(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

function labelsMatch(left?: string, right?: string) {
  const a = normalizeLabel(left);
  const b = normalizeLabel(right);
  if (!a || !b) return false;
  return a === b || a.includes(b) || b.includes(a);
}

function classDetailHref(
  item: DashboardClass | null | undefined,
): string | null {
  if (!item) return null;
  const programId = item.programId || item.courseId;
  const lessonId = item.lessonId || item.id;
  if (!programId || !item.moduleId || !lessonId) return null;
  return adminPath(
    `/courses/${programId}/modules/${item.moduleId}/lessons/${lessonId}`,
  );
}

function matchClassHref(
  events: CalendarClass[] | undefined,
  item: DashboardClass | null | undefined,
  preferLive = false,
): string | null {
  if (!item || !events?.length) return null;

  const matches = events.filter(
    (event) =>
      labelsMatch(event.lessonTitle, item.title) &&
      labelsMatch(event.programTitle, item.programName),
  );
  const chosen =
    (preferLive
      ? matches.find((event) => event.sessionPhase === "live")
      : undefined) ?? matches[0];
  if (chosen) return chosen.href;

  if (!preferLive) return null;

  const liveEvents = events.filter((event) => event.sessionPhase === "live");
  if (liveEvents.length === 1) return liveEvents[0].href;

  const byTitle = events.filter((event) =>
    labelsMatch(event.lessonTitle, item.title),
  );
  return byTitle.length === 1 ? byTitle[0].href : null;
}

function greeting(first: string) {
  const h = new Date().getHours();
  const name = first.trim() || "there";
  if (h < 12) return `Good morning, ${name}`;
  if (h < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

function StatCard({
  label,
  value,
  icon,
  accentClass,
}: {
  label: string;
  value: string | number | undefined;
  icon: ReactNode;
  accentClass: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#E8EEE9] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-[#6B7280]">{label}</p>
          <p className="mt-2 text-[28px] font-semibold tracking-tight text-[#1D1D1D]">
            {displayValue(value, "0")}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full",
            accentClass,
          )}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

export function HomePage() {
  const router = useRouter();
  const { data: user } = useSession();
  const { data, isLoading } = useAdminDashboard();
  const calendar = useAdminCalendar();
  const stats = data?.stats;
  const liveclass = data?.liveClass;
  const upcomingClasses = data?.upcomingClasses?.slice(0, 3) ?? [];

  const displayFirstName = user?.firstName ?? "";
  const showGreetingSkeleton = !user;

  async function openClass(
    item: DashboardClass | null | undefined,
    preferLive = false,
  ) {
    const directHref = classDetailHref(item);
    if (directHref) {
      router.push(directHref);
      return;
    }

    let events = calendar.data?.events;
    if (!events) {
      const result = await calendar.refetch();
      events = result.data?.events;
    }

    const href = matchClassHref(events, item, preferLive);
    if (href) router.push(href);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[24px] border border-[#E8EEE9] bg-[linear-gradient(180deg,#F7FBF8_0%,#FFFFFF_72%)] px-6 py-8 text-center sm:px-10">
        {showGreetingSkeleton ? (
          <div className="flex flex-col items-center gap-3">
            <GreetingTitleSkeleton />
            <Skeleton className="h-5 w-80 max-w-full rounded-lg" />
          </div>
        ) : (
          <>
            <GreetingTitle>{`${greeting(displayFirstName)}!`}</GreetingTitle>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-6 text-[#6B7280] sm:text-[16px]">
              Welcome to your dashboard. Here&apos;s a quick look at your
              platform today.
            </p>
          </>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {isLoading && !data ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[112px] rounded-[20px]" />
          ))
        ) : (
          <>
            <StatCard
              label="Active programs"
              value={stats?.activePrograms}
              accentClass="bg-[#E8F5EC] text-[#2F6B45]"
              icon={<BookOpen className="h-5 w-5" aria-hidden />}
            />
            <StatCard
              label="Active trainers"
              value={stats?.activeTrainers}
              accentClass="bg-[#EEF4FF] text-[#3B5BDB]"
              icon={<GraduationCap className="h-5 w-5" aria-hidden />}
            />
            <StatCard
              label="Active students"
              value={stats?.activeStudents}
              accentClass="bg-[#FFF4E5] text-[#B45309]"
              icon={<Users className="h-5 w-5" aria-hidden />}
            />
          </>
        )}
      </section>

      <section className="space-y-4">
        {liveclass ? (
          <LiveClassBanner
            title={liveclass.title}
            time={liveclass.time}
            date={liveclass.date}
            programName={liveclass.programName}
            zoomJoinUrl={liveclass.zoomJoinUrl}
            onOpen={() => {
              void openClass(liveclass, true);
            }}
          />
        ) : null}

        <div className="rounded-[24px] border border-[#E8EEE9] bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-semibold text-[#1D1D1D] sm:text-[20px]">
                Upcoming live classes
              </h2>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                Next sessions across your programs
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading && !data ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-14 rounded-2xl" />
              ))
            ) : upcomingClasses.length > 0 ? (
              upcomingClasses.map((item: any, index: number) => (
                <UpcomingClassCard
                  key={item?.lessonId || item?.id || index}
                  {...item}
                  onOpen={() => {
                    void openClass(item);
                  }}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#FAFBFC] px-4 py-8 text-center">
                <p className="text-[14px] font-medium text-[#1D1D1D]">
                  No upcoming live classes
                </p>
                <p className="mt-1 text-[13px] text-[#6B7280]">
                  Scheduled sessions will show up here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
