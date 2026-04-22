"use client";

import { SessionScheduler } from "../components/SessionScheduler";
import { PageHeader, Button } from "@ssu/ui";
import Link from "next/link";

export function SessionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessions"
        breadcrumbs={[{ label: "Tutor" }, { label: "Sessions" }]}
        action={
          <Button asChild variant="primary" size="sm">
            <Link href="/sessions/new">Schedule session</Link>
          </Button>
        }
      />
      <SessionScheduler />
    </div>
  );
}
