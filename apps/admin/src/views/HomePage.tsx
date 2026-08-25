"use client";

import {
  GreetingTitle,
  GreetingTitleSkeleton,
  LiveClassBanner,
  UpcomingClassCard,
  AssessmentGradingTable,
  DataTableSkeleton,
} from "@ssu/ui";
import { useSession, useAdminDashboard } from "@ssu/queries";

function greeting(first: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${first}`;
  if (h < 18) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export function HomePage() {
  const { data: user } = useSession();
  const { data, isLoading } = useAdminDashboard();
  const stats = data?.stats;
  const pendingAssessments = data?.pendingAssessments?.items;
  const total = data?.pendingAssessments?.total;
  const liveclass = data?.liveClass;

  const displayFirstName = user?.firstName ?? "";

  const showGreetingSkeleton = !user;

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
                <UpcomingClassCard key={index} {...item} />
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
