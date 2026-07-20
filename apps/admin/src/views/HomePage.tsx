"use client";

import {
  GreetingTitle,
  GreetingTitleSkeleton,
  LiveClassBanner,
  UpcomingClassCard,
  AssessmentGradingTable,
} from "@ssu/ui";
import { useSession } from "@ssu/queries";

function greeting(first: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${first}`;
  if (h < 18) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export function HomePage() {
  const { data: user } = useSession();

  const displayFirstName = user?.firstName ?? "";

  const showGreetingSkeleton = !user;

  const myDdata = [
    {
      title: "Active Programs",
      value: "6",
    },
    {
      title: "Active Trainers",
      value: "8",
    },
    {
      title: "Active Students",
      value: "98",
    },
  ];

  const upcoming = [
    {
      id: 1,
      title: "Social Media Strategy: Viral Campaigns",
      time: "10:00am",
      date: "10/12",
    },
    {
      id: 2,
      title: "Social Media Strategy: Viral Campaigns",
      time: "10:00am",
      date: "10/12",
    },
    {
      id: 3,
      title: "Social Media Strategy: Viral Campaigns",
      time: "10:00am",
      date: "10/12",
    },
  ];

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
          {myDdata.map((item) => (
            <div key={item.title}>
              <h3 className="mb-1 text-[16px] font-medium text-[#6C757D]">
                {item.title}
              </h3>
              <p className="text-[18px] font-semibold text-[#495057]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8 pt-4">
        <LiveClassBanner
          title="Social Media Strategy: Viral Campaigns"
          time="10:00am"
          date="10/12"
        />

        <div className="border-t border-[#ECECEC]" />

        <section className="space-y-3 pb-5">
          <h2 className="text-[20px] font-semibold text-[#202124]">
            Upcoming live class
          </h2>

          <div className="space-y-3">
            {upcoming.map((item) => (
              <UpcomingClassCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      </div>

      <AssessmentGradingTable />
    </div>
  );
}
