"use client";

import { DashboardEmptyState, PageHeader } from "@ssu/ui";
import { Award } from "lucide-react";

export function CertificatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Certificate" />
      <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <DashboardEmptyState
          icon={Award}
          title="Your certificates will appear here"
          description="When you complete your program and earn a certificate, it will show up here so you can view and download it."
          className="py-16"
        />
      </div>
    </div>
  );
}
