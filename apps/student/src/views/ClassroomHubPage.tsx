"use client";

import {
  useConnectGoogle,
  useCurriculum,
  useGoogleClassroomCourses,
  useGoogleConnectionStatus,
  useUpcomingSessions,
} from "@ssu/queries";
import {
  AlertBanner,
  ClassroomCourseCard,
  ConnectGoogleBanner,
  CurriculumAccordion,
  EnrolledCourseHero,
  GreetingTitle,
  PillTabs,
  SectionHeader,
  SessionCard,
  Skeleton,
} from "@ssu/ui";
import { formatDate } from "@ssu/utils";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSession } from "@ssu/queries";
import type { GoogleClassroomCourse } from "@ssu/types";

type HubTab = "courses" | "outline";

function formatSessionTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ClassroomHubPage() {
  const router = useRouter();
  const { data: user } = useSession();
  const [tab, setTab] = useState<HubTab>("courses");
  const googleStatus = useGoogleConnectionStatus();
  const connectGoogle = useConnectGoogle();
  const connected = googleStatus.data?.connected === true;
  const courses = useGoogleClassroomCourses(connected);
  const sessions = useUpcomingSessions();
  const curriculum = useCurriculum();

  const first = user?.firstName ?? "there";
  const sessionList = sessions.data ?? [];
  const featured = sessionList[0];
  const primaryCourse = courses.data?.[0];

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const showConnect =
    googleStatus.data?.connected === false && !googleStatus.isLoading;

  return (
    <div className="space-y-8">
      <GreetingTitle>{`${greeting}, ${first}!`}</GreetingTitle>

      {showConnect && (
        <ConnectGoogleBanner onConnect={() => connectGoogle.mutate()} />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <EnrolledCourseHero
          title={primaryCourse?.name ?? "Web Development"}
          description={
            primaryCourse?.description ??
            "Master modern web technologies including HTML, CSS, JavaScript, and responsive design principles for building production-ready applications."
          }
          metrics={[
            {
              icon: CheckCircle,
              label: `Contents: ${courses.data?.length ?? 4} courses`,
            },
            { icon: Clock, label: "Duration: 16 weeks" },
            { icon: Calendar, label: "Start Date: 10th May, 2026" },
            { icon: Calendar, label: "End Date: 10th Oct, 2026" },
          ]}
        />

        {sessions.isLoading ? (
          <Skeleton className="h-64 rounded-2xl lg:col-span-1" />
        ) : featured ? (
          <SessionCard
            className="lg:col-span-1"
            title={featured.title}
            time={formatSessionTime(featured.startsAt)}
            date={formatDate(featured.startsAt)}
            status={featured.isLive ? "live" : "upcoming"}
            action={
              <Link
                href={`/classroom/${featured.id}`}
                className="inline-flex items-center justify-center rounded-xl bg-brand-green px-4 py-2 text-small font-semibold text-white hover:bg-brand-green-900"
              >
                Join Session &gt;
              </Link>
            }
          />
        ) : null}
      </div>

      <section>
        <div className="flex flex-wrap gap-3 mb-4">
          <PillTabs
            items={[
              { id: "courses", label: "Courses" },
              { id: "outline", label: "Course Outline" },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        {tab === "courses" && (
          <>
            <SectionHeader title="Courses" className="mb-4" />
            {courses.isLoading && connected ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
              </div>
            ) : courses.isError ? (
              <AlertBanner
                variant="error"
                title="Could not load Google Classroom courses"
              >
                Connect Google Classroom or try again later.
              </AlertBanner>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  (connected && courses.data?.length
                    ? courses.data
                    : Array.from({ length: 4 }, (_, i) => ({
                        id: `placeholder-${i}`,
                        name: "Social Media Strategy: Viral Campaigns",
                        courseState: "ACTIVE",
                      }))) as GoogleClassroomCourse[]
                ).map((course, index) => (
                  <ClassroomCourseCard
                    key={course.id}
                    title={course.name}
                    courseNumber={index + 1}
                    syllabusCount={4}
                    onClick={
                      course.alternateLink
                        ? () => window.open(course.alternateLink, "_blank")
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "outline" && (
          <div className="rounded-2xl border bg-white p-4 shadow-card">
            {curriculum.isLoading ? (
              <Skeleton className="h-48 rounded-xl" />
            ) : (
              <CurriculumAccordion
                weeks={curriculum.data ?? []}
                onLessonClick={(lesson) => {
                  if (lesson.sessionId) {
                    router.push(`/classroom/${lesson.sessionId}`);
                  }
                }}
              />
            )}
          </div>
        )}
      </section>

      {sessionList.length > 0 && (
        <section>
          <SectionHeader title="Your classes" className="mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessionList.map((s) => (
              <SessionCard
                key={s.id}
                title={s.title}
                time={formatSessionTime(s.startsAt)}
                date={formatDate(s.startsAt)}
                status={s.isLive ? "live" : "upcoming"}
                action={
                  <Link
                    href={`/classroom/${s.id}`}
                    className="text-small font-semibold text-brand-green hover:underline"
                  >
                    Join class &gt;
                  </Link>
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
