import { AppStatusPage } from "@ssu/ui";

export default function NotFound() {
  return (
    <AppStatusPage
      title="Page not found"
      description="Go back home to continue."
      homeHref="/home"
    />
  );
}
