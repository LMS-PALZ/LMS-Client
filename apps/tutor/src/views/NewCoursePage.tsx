"use client";

import { PageHeader } from "@ssu/ui";
import { CourseWizard } from "../components/CourseWizard/CourseWizard";

export function NewCoursePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Course"
        breadcrumbs={[{ label: "Courses", href: "/courses" }, { label: "New" }]}
      />
      <CourseWizard />
    </div>
  );
}
