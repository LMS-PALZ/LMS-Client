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
import type { ProgramClassroomLesson } from "@ssu/types";
import { AlertBanner, Button, GoBack, usePageBreadcrumbs } from "@ssu/ui";
import { AdminActivityFormSkeleton } from "@/components/skeletons";
import {
  ActivityTypeSelection,
  LiveSessionActivityForm,
  ReadingActivityForm,
} from "@/features/courses/components/activity";
import { CourseModal } from "@/features/courses/components/CourseModal";
import {
  lessonToSessionMode,
  sessionModeLabel,
  sessionModeToLessonType,
  type ActivitySessionMode,
} from "@/features/courses/lib/activity-config";
import {
  buildLessonPayload,
  upsertLessonInModules,
} from "@/features/courses/lib/activity-mappers";
import { buildUpsertClassroomPayload } from "@/features/courses/lib/classroom-mappers";
import {
  isHttpUrl,
  parseDDMMYYYY,
  splitStartsAt,
} from "@/features/courses/lib/course-utils";
import type { ActivityResourceDraft } from "@/features/courses/types/activity";

interface CourseActivityPageProps {
  courseId: string;
}

function lessonFormDefaults(lesson: ProgramClassroomLesson | null) {
  const schedule = splitStartsAt(lesson?.startsAt);
  const summary = lesson?.summary?.trim() ?? "";
  const overview = lesson?.overview?.trim() ?? "";
  // Older live lessons copied description into overview; only treat overview
  // as reading when it differs from the short summary.
  const readingContent = overview && overview !== summary ? overview : "";

  return {
    title: lesson?.title ?? "",
    overview: readingContent,
    sessionDate: schedule.date ? parseDDMMYYYY(schedule.date) : null,
    sessionTime: schedule.time || null,
    description: summary || overview,
    recordingUrl: lesson?.recordingUrl ?? "",
    resources:
      lesson?.resources
        ?.filter((resource) => resource.url)
        .map((resource) => ({
          id: resource.id,
          title: resource.title,
          url: resource.url,
          type: resource.type,
        })) ?? [],
  };
}

interface ActivityFormModalProps {
  open: boolean;
  mode: ActivitySessionMode;
  isEditing: boolean;
  isSaving: boolean;
  programTitle: string;
  existingLesson: ProgramClassroomLesson | null;
  onClose: () => void;
  onSave: (values: {
    title: string;
    overview: string;
    sessionDate: Date | null;
    sessionTime: string | null;
    description: string;
    recordingUrl: string;
    resources: ActivityResourceDraft[];
  }) => Promise<void>;
}

function ActivityFormModal({
  open,
  mode,
  isEditing,
  isSaving,
  programTitle,
  existingLesson,
  onClose,
  onSave,
}: ActivityFormModalProps) {
  const defaults = useMemo(
    () => lessonFormDefaults(existingLesson),
    [existingLesson],
  );
  const formKey = `${mode}:${existingLesson?.id ?? "new"}`;

  return (
    <CourseModal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      title={`${isEditing ? "Edit" : "Create"} ${sessionModeLabel(mode)}`}
      className="max-w-[640px]"
      footer={null}
    >
      <ActivityFormFields
        key={formKey}
        mode={mode}
        defaults={defaults}
        isSaving={isSaving}
        programTitle={programTitle}
        onClose={onClose}
        onSave={onSave}
      />
    </CourseModal>
  );
}

function ActivityFormFields({
  mode,
  defaults,
  isSaving,
  programTitle,
  onClose,
  onSave,
}: {
  mode: ActivitySessionMode;
  defaults: ReturnType<typeof lessonFormDefaults>;
  isSaving: boolean;
  programTitle: string;
  onClose: () => void;
  onSave: ActivityFormModalProps["onSave"];
}) {
  const [title, setTitle] = useState(defaults.title);
  const [overview, setOverview] = useState(defaults.overview);
  const [sessionDate, setSessionDate] = useState<Date | null>(
    defaults.sessionDate,
  );
  const [sessionTime, setSessionTime] = useState<string | null>(
    defaults.sessionTime,
  );
  const [description, setDescription] = useState(defaults.description);
  const [recordingUrl, setRecordingUrl] = useState(defaults.recordingUrl);
  const [recordingUrlError, setRecordingUrlError] = useState("");
  const [resources, setResources] = useState<ActivityResourceDraft[]>(
    defaults.resources,
  );

  const isLiveClass = mode === "live_class";
  const isPrerecorded = mode === "prerecorded";
  const isReading = mode === "reading";
  const isSessionForm = isLiveClass || isPrerecorded;

  const recordingUrlIsValid =
    !isPrerecorded ||
    (recordingUrl.trim().length > 0 && isHttpUrl(recordingUrl));

  const canSave =
    title.trim().length > 0 &&
    !isSaving &&
    (!isSessionForm || description.trim().length > 0) &&
    (!isPrerecorded || recordingUrlIsValid) &&
    (!isSessionForm || (Boolean(sessionDate) && Boolean(sessionTime)));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1">
        <div className="mx-auto w-full max-w-[560px] space-y-5 pb-2">
          {isSessionForm ? (
            <LiveSessionActivityForm
              title={title}
              onTitleChange={setTitle}
              sessionDate={sessionDate}
              onSessionDateChange={setSessionDate}
              sessionTime={sessionTime}
              onSessionTimeChange={setSessionTime}
              description={description}
              onDescriptionChange={setDescription}
              recordingUrl={recordingUrl}
              onRecordingUrlChange={(value) => {
                setRecordingUrl(value);
                if (value.trim().length === 0 || isHttpUrl(value)) {
                  setRecordingUrlError("");
                } else {
                  setRecordingUrlError("Enter a valid http or https URL.");
                }
              }}
              recordingUrlError={recordingUrlError}
              resources={resources}
              onResourcesChange={setResources}
              titlePlaceholder={programTitle}
              showRecordingUrl={isPrerecorded}
              recordingUrlRequired={isPrerecorded}
              readingContent={overview}
              onReadingContentChange={setOverview}
            />
          ) : isReading ? (
            <ReadingActivityForm
              title={title}
              onTitleChange={setTitle}
              content={overview}
              onContentChange={setOverview}
              titlePlaceholder={programTitle}
            />
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex shrink-0 justify-end gap-3 border-t border-[#EEF2F6] pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="h-11 rounded-full bg-[#ECF0F6] px-6 text-[14px] font-medium text-[#1D1D1D] hover:bg-[#E2E8F0]"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (isPrerecorded && !recordingUrlIsValid) {
              setRecordingUrlError(
                "Enter a valid http or https recording URL.",
              );
              return;
            }
            void onSave({
              title,
              overview,
              sessionDate,
              sessionTime,
              description,
              recordingUrl: isPrerecorded ? recordingUrl : "",
              resources,
            });
          }}
          disabled={!canSave}
          loading={isSaving}
          className="h-11 rounded-full bg-[#4C7D5B] px-6 text-[14px] font-medium text-white hover:bg-[#3d6549]"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export function CourseActivityPage({ courseId }: CourseActivityPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("moduleId") ?? "";
  const lessonId = searchParams.get("lessonId");

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

  const isEditing = Boolean(lessonId);
  const editMode = existingLesson ? lessonToSessionMode(existingLesson) : null;
  const [createMode, setCreateMode] = useState<ActivitySessionMode | null>(
    null,
  );
  const sessionMode = isEditing ? editMode : createMode;
  const modalOpen = Boolean(sessionMode);

  const backHref = adminPath(`/courses/${courseId}/curriculum`);

  usePageBreadcrumbs([
    { label: "Courses", href: adminPath("/courses") },
    {
      label: program?.title ?? "Course",
      href: adminPath(`/courses/${courseId}`),
    },
    { label: "Activity" },
  ]);

  const closeModal = () => {
    if (isEditing) {
      router.push(backHref);
      return;
    }
    setCreateMode(null);
  };

  const handleSave = async (values: {
    title: string;
    overview: string;
    sessionDate: Date | null;
    sessionTime: string | null;
    description: string;
    recordingUrl: string;
    resources: ActivityResourceDraft[];
  }) => {
    if (!program || !targetModule || !sessionMode) return;

    const nextLesson = buildLessonPayload({
      existingLesson,
      activityType: sessionModeToLessonType(sessionMode),
      title: values.title,
      overview: values.overview,
      sessionDate: values.sessionDate,
      sessionTime: values.sessionTime,
      description: values.description,
      recordingUrl: values.recordingUrl,
      resources: values.resources,
    });

    const nextModules = upsertLessonInModules(
      modules,
      targetModule.id,
      lessonId,
      nextLesson,
    );

    const updatedModule = nextModules.find(
      (module) => module.id === targetModule.id,
    );
    if (!updatedModule) return;

    const lessons = updatedModule.lessons ?? [];
    const payloadLesson = lessonId
      ? lessons.find((lesson) => lesson.id === lessonId)
      : lessons.at(-1);

    const payloadModule = {
      ...updatedModule,
      lessons: payloadLesson ? [payloadLesson] : [],
    };

    try {
      await upsertClassroom.mutateAsync({
        programId: program.id,
        payload: buildUpsertClassroomPayload(
          program,
          [payloadModule],
          program.status === "published" ? "published" : "draft",
        ),
      });

      mutationToast.success("Course activity saved");
      router.push(backHref);
    } catch (error) {
      mutationToast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Refresh and try again.",
      );
    }
  };

  if (isProgramLoading || isModulesLoading) {
    return (
      <section className="space-y-4">
        <GoBack fallbackHref={backHref} />
        <AdminActivityFormSkeleton />
      </section>
    );
  }

  if (!program || !targetModule) {
    return (
      <section className="space-y-6">
        <GoBack fallbackHref={backHref} />
        <AlertBanner variant="error">
          Go back to the course and try again.
        </AlertBanner>
      </section>
    );
  }

  if (isEditing && !existingLesson) {
    return (
      <section className="space-y-6">
        <GoBack fallbackHref={backHref} />
        <AlertBanner variant="error">
          Go back to the course and try again.
        </AlertBanner>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1120px] space-y-6">
      <GoBack fallbackHref={backHref} />
      <h1 className="text-[24px] font-semibold text-[#1D1D1D]">
        Course Activity
      </h1>

      {upsertClassroom.isError && (
        <AlertBanner variant="error">Refresh and try again.</AlertBanner>
      )}

      {!isEditing ? (
        <ActivityTypeSelection onSelect={setCreateMode} />
      ) : (
        <p className="text-[14px] text-[#64748B]">
          Edit this activity in the dialog.
        </p>
      )}

      {sessionMode ? (
        <ActivityFormModal
          open={modalOpen}
          mode={sessionMode}
          isEditing={isEditing}
          isSaving={upsertClassroom.isPending}
          programTitle={program.title}
          existingLesson={existingLesson}
          onClose={closeModal}
          onSave={handleSave}
        />
      ) : null}
    </section>
  );
}
