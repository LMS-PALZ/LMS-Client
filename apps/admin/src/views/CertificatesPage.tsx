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
        title="Certificates (demo)"
        description="Connect your API to list and edit training Certificates here."
      />
    </div>
  );
}
