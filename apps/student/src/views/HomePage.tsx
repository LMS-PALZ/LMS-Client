"use client";

import { useEnrolledCourses, useSession } from "@ssu/queries";
import { AlertBanner, EmptyState, PageHeader, Skeleton } from "@ssu/ui";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { CourseCard } from "../components/CourseCard";

function greeting(first: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${first}`;
  if (h < 18) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

export function HomePage() {
  const { data: user } = useSession();
  const q = useEnrolledCourses();
  const first = user?.firstName ?? "there";
  const [greetingTitle, setGreetingTitle] = useState(`Hello, ${first} 👋`);

  useEffect(() => {
    setGreetingTitle(`${greeting(first)} 👋`);
  }, [first]);

  return (
    <div className="space-y-8">
      <PageHeader title={greetingTitle} />
      {q.isError && (
        <AlertBanner variant="error" title="We could not load your courses">
          Please try again.
        </AlertBanner>
      )}
      <section>
        <h2 className="text-h2 text-neutral-900 mb-3">Enrolled courses</h2>
        {q.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : !q.data?.length ? (
          <EmptyState icon={BookOpen} title="No courses yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {q.data.map((c) => (
              <CourseCard
                key={c.id}
                id={c.id}
                title={c.title}
                trainerName={c.trainerName}
                progressPercent={c.progressPercent}
                bannerUrl={c.bannerUrl}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
