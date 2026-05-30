"use client";

import { CourseCard as CourseCardUi } from "@ssu/ui";
import { useRouter } from "next/navigation";

export function CourseCard(props: {
  id: string;
  title: string;
  trainerName: string;
  progressPercent: number;
  bannerUrl?: string | null;
}) {
  const router = useRouter();
  return (
    <CourseCardUi
      title={props.title}
      trainerName={props.trainerName}
      progressPercent={props.progressPercent}
      bannerUrl={props.bannerUrl}
      onContinue={() => router.push(`/courses/${props.id}`)}
    />
  );
}
