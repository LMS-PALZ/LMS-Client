"use client";

import { SessionScheduler } from "../components/SessionScheduler";
import { PageHeader } from "@ssu/ui";

export function NewSessionPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule session"
        breadcrumbs={[
          { label: "Sessions", href: "/sessions" },
          { label: "New" },
        ]}
      />
      <SessionScheduler />
    </div>
  );
}
