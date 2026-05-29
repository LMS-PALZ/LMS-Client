"use client";

import WelcomeCard from "@/views/Overall";
import { LiveSessions } from "@/views/LiveSessions";
import { Assignments } from "@/views/AssignmentsPage";

export default function HomePage() {
  const sessions = [
    {
      id: 1,
      title: "Social Media Strategy: Viral Campaigns",
      time: "10:00am",
      date: "10/12",
      status: "live" as const,
      joinable: true,
    },
    {
      id: 2,
      title: "Social Media Strategy: Viral Campaigns",
      time: "10:00am",
      date: "10/12",
      status: "upcoming" as const,
      joinable: false,
    },
    {
      id: 3,
      title: "Social Media Strategy: Viral Campaigns",
      time: "10:00am",
      date: "10/12",
      status: "upcoming" as const,
      joinable: false,
    },
  ];

  const assignments = [
    {
      id: 1,
      title: "Social Media Strategy: Viral Campaigns",
      topic: "Understanding The Market",
      score: 70,
      date: "10/12",
      due: true,
    },
    {
      id: 2,
      title: "Social Media Strategy: Viral Campaigns",
      topic: "Understanding The Market",
      score: 70,
      date: "10/12",
      due: true,
    },
    {
      id: 3,
      title: "Social Media Strategy: Viral Campaigns",
      topic: "Understanding The Market",
      score: 70,
      date: "10/12",
    },
    {
      id: 4,
      title: "Social Media Strategy: Viral Campaigns",
      topic: "Understanding The Market",
      score: 70,
      date: "10/12",
    },
  ];

  return (
    <div className="min-h-screen">
      <main className=" flex-1 bg-[#FAFAFA]">
        <div className="text-center">
          <h1 className="text-[15px] font-bold text-[#1D1D1D] md:text-[25px]">
            Good evening, Chiroma!
          </h1>
        </div>

        <section className="mt-10 grid gap-10 xl:grid-cols-[1fr_1.4fr] bg-[#F8F9FA] pt-3 pb-3">
          <WelcomeCard progress={50} />
          <LiveSessions sessions={sessions} />
        </section>
        <Assignments assignments={assignments} />
      </main>
    </div>
  );
}
