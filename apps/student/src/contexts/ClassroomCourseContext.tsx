"use client";

import { createContext, useContext } from "react";
import type {
  ClassroomCourseDetail,
  ClassroomWeek,
} from "@/lib/classroom/types";

export interface ClassroomCourseContextValue {
  course: ClassroomCourseDetail;
  weeks: ClassroomWeek[];
  meetUrl?: string;
  isLive: boolean;
}

const ClassroomCourseContext =
  createContext<ClassroomCourseContextValue | null>(null);

export function ClassroomCourseProvider({
  value,
  children,
}: {
  value: ClassroomCourseContextValue;
  children: React.ReactNode;
}) {
  return (
    <ClassroomCourseContext.Provider value={value}>
      {children}
    </ClassroomCourseContext.Provider>
  );
}

export function useClassroomCourse() {
  const ctx = useContext(ClassroomCourseContext);
  if (!ctx) {
    throw new Error(
      "useClassroomCourse must be used within ClassroomCourseProvider",
    );
  }
  return ctx;
}
