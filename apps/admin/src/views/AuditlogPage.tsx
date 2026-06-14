"use client";

import { EmptyState, PageHeader } from "@ssu/ui";
import { ShieldCheck } from "lucide-react";

export function AuditlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        breadcrumbs={[{ label: "Admin" }, { label: "Audit Log" }]}
      />
      <EmptyState
        icon={ShieldCheck}
        title="Audit Log (demo)"
        description="Connect your API to list and edit training Audit Log here."
      />
    </div>
  );
}
