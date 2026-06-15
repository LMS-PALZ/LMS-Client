"use client";

import { StudentManagement } from "@/components/Studentmanagement";

import { studentStats } from "@ssu/api";

export default function Page() {
  return <StudentManagement stats={studentStats} />;
}
