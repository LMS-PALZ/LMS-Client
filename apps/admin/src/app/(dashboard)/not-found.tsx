import { adminPath } from "@ssu/config/portal-paths";
import { AppStatusPage } from "@ssu/ui";

export default function DashboardNotFound() {
  return (
    <AppStatusPage
      title="Page not found"
      description="Go back home to continue."
      homeHref={adminPath()}
    />
  );
}
