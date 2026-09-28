import { adminPath } from "@ssu/config/portal-paths";
import type { NavigationSidebarItem } from "@ssu/ui";
import type { UserRole } from "@ssu/types";
import {
  canPerformAdminWork,
  canPerformTutorWork,
  isAdminStaffRole as isAdminStaffRoleUtil,
  isTutorOnlyRole,
  normalizeStaffPortalRole,
  shouldScopeProgramsToTutor,
} from "@ssu/utils";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Receipt,
} from "lucide-react";

export type AdminPortalRole = "super_admin" | "admin" | "tutor";

type NavItemConfig = NavigationSidebarItem & { tutorHidden?: boolean };

const TUTOR_BLOCKED_PREFIXES = [
  "/students",
  "/staff",
  "/transactions",
  "/auditlog",
  "/certificates",
  "/courses/builder",
  "/createassignment",
];

export function normalizeAdminPortalRole(
  role: UserRole | string | undefined,
): AdminPortalRole {
  return normalizeStaffPortalRole(role);
}

/** Pure tutor role only (not super_admin). */
export function isTutorRole(role: UserRole | string | undefined): boolean {
  return isTutorOnlyRole(role);
}

/** Admin or super_admin. */
export function isAdminStaffRole(role: UserRole | string | undefined): boolean {
  return isAdminStaffRoleUtil(role);
}

/**
 * Tutors and super admins can grade.
 * Plain admins cannot perform tutor grading work.
 */
export function canGradeAssessments(
  role: UserRole | string | undefined,
): boolean {
  return canPerformTutorWork(role);
}

/**
 * Tutors and super admins can create/manage assessments.
 * Plain admins cannot.
 */
export function canCreateAssessments(
  role: UserRole | string | undefined,
): boolean {
  return canPerformTutorWork(role);
}

/** Admins/super-admins can create courses and assign tutors. */
export function canCreateCourses(role: UserRole | string | undefined): boolean {
  return canPerformAdminWork(role);
}

/** Scope course lists to assigned programs — tutors only, not super admins. */
export function shouldFilterProgramsAsTutor(
  role: UserRole | string | undefined,
): boolean {
  return shouldScopeProgramsToTutor(role);
}

export function normalizeAdminPathname(pathname: string): string {
  if (pathname.startsWith("/admin/")) {
    return pathname.slice("/admin".length) || "/";
  }
  if (pathname === "/admin") return "/";
  return pathname;
}

export function canAccessAdminPath(
  role: UserRole | string | undefined,
  pathname: string,
): boolean {
  // Pure tutors cannot open admin-only routes.
  if (isTutorOnlyRole(role)) {
    const path = normalizeAdminPathname(pathname);
    return !TUTOR_BLOCKED_PREFIXES.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    );
  }

  // Plain admins cannot open tutor teaching flows (create assignment).
  if (!canPerformTutorWork(role)) {
    const path = normalizeAdminPathname(pathname);
    if (path === "/createassignment" || path.startsWith("/createassignment?")) {
      return false;
    }
  }

  return true;
}

function filterNavItems(
  items: NavItemConfig[],
  role: UserRole | string | undefined,
): NavigationSidebarItem[] {
  if (!isTutorOnlyRole(role)) {
    return items.map(({ tutorHidden: _tutorHidden, ...item }) => item);
  }

  return items
    .filter((item) => !item.tutorHidden)
    .map(({ tutorHidden: _tutorHidden, ...item }) => item);
}

export function getNavSectionsForRole(role: UserRole | string | undefined) {
  const mainItems: NavItemConfig[] = [
    { href: adminPath(), label: "Home", icon: LayoutDashboard },
    {
      href: adminPath("/students"),
      label: "Students",
      icon: BookOpen,
      tutorHidden: true,
    },
    { href: adminPath("/calender"), label: "Calendar", icon: BookOpen },
  ];

  const teachingItems: NavItemConfig[] = [
    { href: adminPath("/courses"), label: "Courses", icon: GraduationCap },
    {
      href: adminPath("/assessment"),
      label: "Assessment",
      icon: ClipboardList,
    },
  ];

  const toolsItems: NavItemConfig[] = [
    {
      href: adminPath("/staff"),
      label: "Staff",
      icon: GraduationCap,
      tutorHidden: true,
    },
    {
      href: adminPath("/transactions"),
      label: "Transaction",
      icon: Receipt,
      tutorHidden: true,
    },
    {
      href: adminPath("/auditlog"),
      label: "Audit log",
      icon: ClipboardList,
      tutorHidden: true,
    },
  ];

  return {
    mainItems: filterNavItems(mainItems, role),
    teachingItems: filterNavItems(teachingItems, role),
    toolsItems: filterNavItems(toolsItems, role),
  };
}
