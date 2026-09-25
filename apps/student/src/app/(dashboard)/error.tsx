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
      description="We could not open this page. Try again, or go back home."
      homeHref="/home"
      onRetry={reset}
    />
  );
}
