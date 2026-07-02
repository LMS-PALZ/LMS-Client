"use client";

import {
  useEnrolledProgram,
  useStudentAssignments,
  useStudentclassroom,
} from "@ssu/queries";
import { useMemo } from "react";
import { buildCalendarEvents } from "./mappers";
import type { StudentCalendarEvent } from "./types";

export function useStudentCalendar(): {
  events: StudentCalendarEvent[];
  isLoading: boolean;
  isError: boolean;
  hasEnrollment: boolean;
} {
  const { programId, isLoading: profileLoading } = useEnrolledProgram();
  const classroom = useStudentclassroom(programId);
  const assignments = useStudentAssignments();

  const events = useMemo(() => {
    if (!classroom.data) return [];
    return buildCalendarEvents(classroom.data, assignments.data ?? []);
  }, [classroom.data, assignments.data]);

  return {
    events,
    isLoading: profileLoading || classroom.isLoading || assignments.isLoading,
    isError: classroom.isError || assignments.isError,
    hasEnrollment: Boolean(programId),
  };
}
