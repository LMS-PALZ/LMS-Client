import type { PageBreadcrumbItem } from "@ssu/ui";

/** Default trail from the URL. Pages can override with `usePageBreadcrumbs`. */
export function buildStudentBreadcrumbs(
  pathname: string,
): PageBreadcrumbItem[] {
  if (pathname.startsWith("/classroom/") && pathname !== "/classroom") {
    return [{ label: "My Classroom", href: "/classroom" }, { label: "Class" }];
  }

  if (pathname.startsWith("/assessments/") && pathname !== "/assessments") {
    return [
      { label: "Assessment", href: "/assessments" },
      { label: "Assignment" },
    ];
  }

  if (pathname.startsWith("/courses/") && pathname !== "/courses") {
    return [{ label: "My Classroom", href: "/classroom" }, { label: "Course" }];
  }

  if (pathname.startsWith("/profile")) {
    return [{ label: "Home", href: "/home" }, { label: "Profile" }];
  }

  if (pathname.startsWith("/certificate")) {
    return [{ label: "Home", href: "/home" }, { label: "Certificate" }];
  }

  if (pathname.startsWith("/support")) {
    return [{ label: "Home", href: "/home" }, { label: "Support" }];
  }

  return [];
}
