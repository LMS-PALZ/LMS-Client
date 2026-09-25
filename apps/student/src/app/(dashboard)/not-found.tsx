import { AppStatusPage } from "@ssu/ui";

export default function DashboardNotFound() {
  return (
    <AppStatusPage
      title="Page not found"
      description="This page is not available. Go back home and continue from there."
      homeHref="/home"
    />
  );
}
