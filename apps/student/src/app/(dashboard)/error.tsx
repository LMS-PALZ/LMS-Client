"use client";

import { AppStatusPage } from "@ssu/ui";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppStatusPage
      title="Something went wrong"
      description="Try again later."
      homeHref="/home"
      onRetry={reset}
    />
  );
}
