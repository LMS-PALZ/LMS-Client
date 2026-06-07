"use client";

import { StudentManagement } from "@/components/Studentmanagement";

import { studentStats, students } from "@ssu/api";

export default function Page() {
  return <StudentManagement stats={studentStats} students={students} />;
}
