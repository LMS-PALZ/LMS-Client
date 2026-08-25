"use client";

import { PageHeader } from "@ssu/ui";

export function SupportPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Support" />
      <p className="text-body text-neutral-600">
        Need help? Reach out to the SSU team and we&apos;ll get back to you.
      </p>
      <p className="text-body text-neutral-600">
        Email{" "}
        <a
          href="mailto:support@skillscaleup.dev"
          className="font-medium text-brand-green hover:underline"
        >
          support@skillscaleup.dev
        </a>{" "}
        for account, classroom, or technical issues.
      </p>
    </div>
  );
}
