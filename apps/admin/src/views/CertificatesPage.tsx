"use client";

import { EmptyState, PageHeader } from "@ssu/ui";
import { BookCheck } from "lucide-react";

export function CertificatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates"
        breadcrumbs={[{ label: "Admin" }, { label: "Certificates" }]}
      />
      <EmptyState
        icon={BookCheck}
        title="Nothing here yet"
        description="Check back later."
      />
    </div>
  );
}
