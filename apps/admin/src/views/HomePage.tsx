"use client";

import {
  GreetingTitle,
  GreetingTitleSkeleton,
  LiveClassBanner,
  UpcomingClassCard,
  AssessmentGradingTable,
  DataTableSkeleton,
} from "@ssu/ui";
import { adminPath } from "@ssu/config/portal-paths";
import { useSession, useAdminDashboard, useAdminCalendar } from "@ssu/queries";
import { useRouter } from "next/navigation";

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
  if (h < 12) return `Good morning, ${first}`;
  if (h < 18) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export function HomePage() {
  const router = useRouter();
  const { data: user } = useSession();
  const { data, isLoading } = useAdminDashboard();
  const calendar = useAdminCalendar();
  const stats = data?.stats;
  const pendingAssessments = data?.pendingAssessments?.items;
  const total = data?.pendingAssessments?.total;
  const liveclass = data?.liveClass;

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
    <div className="space-y-2">
      {showGreetingSkeleton ? (
        <GreetingTitleSkeleton />
      ) : (
        <GreetingTitle>{`${greeting(displayFirstName)}!`}</GreetingTitle>
      )}

      <div className="flex items-center justify-center pb-4">
        <p className="text-[16px] text-[#6C757D] font-medium md:text-[18px]">
          Welcome to your dashboard, lets do great work today
        </p>
      </div>

      <div className="mt-8 rounded-[12px] bg-[#F0F5F1] px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="mb-1 text-[16px] font-medium text-[#6C757D]">
              Active Programs
            </h3>
            <p className="text-[18px] font-semibold text-[#495057]">
              {stats?.activePrograms}
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-[16px] font-medium text-[#6C757D]">
              Active Trainers
            </h3>
            <p className="text-[18px] font-semibold text-[#495057]">
              {stats?.activeTrainers}
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-[16px] font-medium text-[#6C757D]">
              Active Students
            </h3>
            <p className="text-[18px] font-semibold text-[#495057]">
              {stats?.activeStudents}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 pt-4">
        {liveclass === null ? (
          ""
        ) : (
          <LiveClassBanner
            title={liveclass?.title}
            time={liveclass?.time}
            date={liveclass?.date}
            programName={liveclass?.programName}
            zoomJoinUrl={liveclass?.zoomJoinUrl}
            onOpen={() => {
              void openClass(liveclass, true);
            }}
          />
        )}

        <div className="border-t border-[#ECECEC]" />

        <section className="space-y-3 pb-5">
          <h2 className="text-[20px] font-semibold text-[#202124]">
            Upcoming live class
          </h2>

          <div className="space-y-3">
            {data?.upcomingClasses
              ?.slice(0, 3)
              .map((item: any, index: number) => (
                <UpcomingClassCard
                  key={index}
                  {...item}
                  onOpen={() => {
                    void openClass(item);
                  }}
                />
              ))}
          </div>
        </section>
      </div>

      {isLoading && !data ? (
        <DataTableSkeleton
          rows={3}
          columns={4}
          className="border-0 bg-transparent p-0 shadow-none"
        />
      ) : (
        <AssessmentGradingTable data={pendingAssessments ?? []} total={total} />
      )}
    </div>
  );
}
