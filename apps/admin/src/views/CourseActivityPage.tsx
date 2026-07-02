"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import {
  useAdminProgram,
  useProgramClassroomModules,
  useUpsertProgramClassroomMutation,
  mutationToast,
} from "@ssu/queries";
import type { ClassroomLessonType } from "@ssu/types";
import { AlertBanner, Button, Spinner } from "@ssu/ui";
import { CourseActivityShell } from "@/features/courses/components/CourseActivityShell";
import {
  LiveSessionActivityForm,
  ReadingActivityForm,
} from "@/features/courses/components/activity";
import { ACTIVITY_TYPE_OPTIONS } from "@/features/courses/lib/activity-config";
import {
  buildLessonPayload,
  upsertLessonInModules,
} from "@/features/courses/lib/activity-mappers";
import { buildUpsertClassroomPayload } from "@/features/courses/lib/classroom-mappers";
import {
  parseDDMMYYYY,
  splitStartsAt,
} from "@/features/courses/lib/course-utils";

interface CourseActivityPageProps {
  courseId: string;
}

function readLessonType(value: string | null): ClassroomLessonType {
  return value === "reading" ? "reading" : "live_session";
}

export function CourseActivityPage({ courseId }: CourseActivityPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("moduleId") ?? "";
  const lessonId = searchParams.get("lessonId");
  const initialType = readLessonType(searchParams.get("type"));

  const { data: program, isLoading: isProgramLoading } =
    useAdminProgram(courseId);
  const { data: modules = [], isLoading: isModulesLoading } =
    useProgramClassroomModules(courseId, Boolean(program?.id));
  const upsertClassroom = useUpsertProgramClassroomMutation();

  const targetModule = useMemo(
    () => modules.find((module) => module.id === moduleId) ?? null,
    [modules, moduleId],
  );

  const existingLesson = useMemo(() => {
    if (!lessonId || !targetModule?.lessons) return null;
    return (
      targetModule.lessons.find((lesson) => lesson.id === lessonId) ?? null
    );
  }, [lessonId, targetModule]);

  const initialSchedule = splitStartsAt(existingLesson?.startsAt);

  const [activityType, setActivityType] = useState<ClassroomLessonType>(
    existingLesson?.lessonType ?? initialType,
  );
  const [title, setTitle] = useState(existingLesson?.title ?? "");
  const [overview, setOverview] = useState(existingLesson?.overview ?? "");
  const [meetingLink, setMeetingLink] = useState(
    existingLesson?.liveSessionUrl ?? "",
  );
  const [sessionDate, setSessionDate] = useState<Date | null>(() => {
    if (!initialSchedule.date) return null;
    return parseDDMMYYYY(initialSchedule.date);
  });
  const [sessionTime, setSessionTime] = useState<string | null>(
    initialSchedule.time || null,
  );
  const [description, setDescription] = useState(
    existingLesson?.summary ?? existingLesson?.overview ?? "",
  );
  const [recordingUrl, setRecordingUrl] = useState(
    existingLesson?.recordingUrl ?? "",
  );

  const isSaving = upsertClassroom.isPending;
  const isLiveSession = activityType === "live_session";

  const canSave =
    title.trim().length > 0 &&
    Boolean(targetModule) &&
    !isSaving &&
    (!isLiveSession || description.trim().length > 0);

  const backHref = adminPath(`/courses/${courseId}/curriculum`);

  const handleSave = async () => {
    if (!program || !targetModule || !canSave) return;

    const nextLesson = buildLessonPayload({
      existingLesson,
      activityType,
      title,
      overview,
      meetingLink,
      sessionDate,
      sessionTime,
      description,
      recordingUrl,
    });

    const nextModules = upsertLessonInModules(
      modules,
      targetModule.id,
      lessonId,
      nextLesson,
    );

    try {
      await upsertClassroom.mutateAsync({
        programId: program.id,
        payload: buildUpsertClassroomPayload(
          program,
          nextModules,
          program.status === "published" ? "published" : "draft",
        ),
      });
      mutationToast.success("Course activity saved");
      router.push(backHref);
    } catch (error) {
      mutationToast.error(
        error instanceof Error ? error.message : "Failed to save activity.",
      );
    }
  };

  if (isProgramLoading || isModulesLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!program || !targetModule) {
    return (
      <section className="space-y-6">
        <AlertBanner variant="error">
          Could not find the module for this activity.
        </AlertBanner>
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            router.push(adminPath(`/courses/${courseId}/curriculum`))
          }
        >
          Back to curriculum
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1120px] space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[24px] font-semibold text-[#1D1D1D]">
          Course Activity
        </h1>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="text-[14px] font-medium text-[#1D1D1D] transition hover:opacity-80"
          >
            Cancel
          </button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={!canSave}
            loading={isSaving}
            className="h-10 rounded-lg bg-[#4C7D5B] px-6 text-[14px] font-medium text-white hover:bg-[#3d6549]"
          >
            Save
          </Button>
        </div>
      </div>

      {upsertClassroom.isError && (
        <AlertBanner variant="error">
          {upsertClassroom.error instanceof Error
            ? upsertClassroom.error.message
            : "Failed to save activity."}
        </AlertBanner>
      )}

      <CourseActivityShell
        activityType={activityType}
        activityTypes={ACTIVITY_TYPE_OPTIONS}
        onActivityTypeChange={setActivityType}
        disableTypeSwitch={Boolean(lessonId)}
      >
        {isLiveSession ? (
          <LiveSessionActivityForm
            title={title}
            onTitleChange={setTitle}
            meetingLink={meetingLink}
            onMeetingLinkChange={setMeetingLink}
            sessionDate={sessionDate}
            onSessionDateChange={setSessionDate}
            sessionTime={sessionTime}
            onSessionTimeChange={setSessionTime}
            description={description}
            onDescriptionChange={setDescription}
            recordingUrl={recordingUrl}
            onRecordingUrlChange={setRecordingUrl}
            titlePlaceholder={program.title}
          />
        ) : (
          <ReadingActivityForm
            title={title}
            onTitleChange={setTitle}
            content={overview}
            onContentChange={setOverview}
            titlePlaceholder={program.title}
          />
        )}
      </CourseActivityShell>
    </section>
  );
}
