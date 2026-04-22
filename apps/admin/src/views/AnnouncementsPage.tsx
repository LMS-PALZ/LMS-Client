"use client";

import { Button, EmptyState, PageHeader } from "@ssu/ui";
import { Megaphone } from "lucide-react";

export function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        breadcrumbs={[{ label: "Admin" }, { label: "Announcements" }]}
        action={
          <Button variant="primary" size="sm" type="button" disabled>
            New announcement (demo)
          </Button>
        }
      />
      <EmptyState
        icon={Megaphone}
        title="No announcements"
        description="Broadcast messages to students and tutors from here once wired to your backend."
      />
    </div>
  );
}
