import { adminPath } from "@ssu/config/portal-paths";
import type { PageBreadcrumbItem } from "@ssu/ui";

/** Default trail from the URL. Pages can override with `usePageBreadcrumbs`. */
export function buildAdminBreadcrumbs(pathname: string): PageBreadcrumbItem[] {
  const coursesBase = adminPath("/courses");
  const studentsBase = adminPath("/students");
  const assessmentBase = adminPath("/assessment");
  const staffBase = adminPath("/staff");
  const usersBase = adminPath("/users");

  if (pathname.startsWith(`${coursesBase}/`)) {
    const rest = pathname.slice(coursesBase.length + 1);
    const segments = rest.split("/").filter(Boolean);
    const courseId = segments[0];
    const courseHref = `${coursesBase}/${courseId}`;

    if (segments.includes("activities")) {
      return [
        { label: "Courses", href: coursesBase },
        { label: "Course", href: courseHref },
        { label: "Activity" },
      ];
    }
    if (segments.includes("curriculum")) {
      return [
        { label: "Courses", href: coursesBase },
        { label: "Course", href: courseHref },
        { label: "Curriculum" },
      ];
    }
    if (segments.includes("lessons") || segments.includes("builder")) {
      return [
        { label: "Courses", href: coursesBase },
        { label: "Course", href: courseHref },
        { label: segments.includes("builder") ? "Builder" : "Lesson" },
      ];
    }
    return [{ label: "Courses", href: coursesBase }, { label: "Course" }];
  }

  if (pathname.startsWith(`${studentsBase}/`) && pathname !== studentsBase) {
    return [{ label: "Students", href: studentsBase }, { label: "Student" }];
  }

  if (
    pathname.startsWith(`${assessmentBase}/`) &&
    pathname !== assessmentBase
  ) {
    return [
      { label: "Assessment", href: assessmentBase },
      { label: "Details" },
    ];
  }

  if (pathname.includes("/createassignment")) {
    return [
      { label: "Assessment", href: assessmentBase },
      { label: "Create assignment" },
    ];
  }

  if (pathname.startsWith(`${staffBase}/`)) {
    return [{ label: "Staff", href: staffBase }, { label: "Staff" }];
  }

  if (pathname.startsWith(`${usersBase}/`) && pathname !== usersBase) {
    return [{ label: "Users", href: usersBase }, { label: "User" }];
  }

  if (pathname.startsWith(adminPath("/pending-trainers"))) {
    return [{ label: "Staff", href: staffBase }, { label: "Pending trainers" }];
  }

  if (pathname.startsWith("/classroom/")) {
    return [
      { label: "Home", href: adminPath("/home") },
      { label: "Classroom" },
    ];
  }

  return [];
}
