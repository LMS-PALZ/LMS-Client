"use client";

import { CourseWizard } from "../components/CourseWizard/CourseWizard";
import { PageHeader } from "@ssu/ui";
import { useParams } from "next/navigation";

export function EditCoursePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit course"
        breadcrumbs={[
          { label: "Courses", href: "/courses" },
          { label: id, href: `/courses/${id}` },
          { label: "Edit" },
        ]}
      />
      <CourseWizard />
    </div>
  );
}
