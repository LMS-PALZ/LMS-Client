import { adminPath } from "@ssu/config/portal-paths";
import type { NavigationSidebarItem } from "@ssu/ui";
import type { UserRole } from "@ssu/types";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";

export type AdminPortalRole = "super_admin" | "admin" | "tutor";

type NavItemConfig = NavigationSidebarItem & { tutorHidden?: boolean };

const TUTOR_BLOCKED_PREFIXES = [
  "/students",
  "/staff",
  "/auditlog",
  "/certificates",
];

export function normalizeAdminPortalRole(
  role: UserRole | string | undefined,
): AdminPortalRole {
  const normalized = (role ?? "admin").toLowerCase().trim();
  if (normalized === "super_admin" || normalized === "superadmin") {
    return "super_admin";
  }
  if (
    normalized === "tutor" ||
    normalized === "trainer" ||
    normalized === "instructor"
  ) {
    return "tutor";
  }
  return "admin";
}

export function isTutorRole(role: UserRole | string | undefined): boolean {
  return normalizeAdminPortalRole(role) === "tutor";
}

export function isAdminStaffRole(role: UserRole | string | undefined): boolean {
  const normalized = normalizeAdminPortalRole(role);
  return normalized === "admin" || normalized === "super_admin";
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
  if (!isTutorRole(role)) return true;

  const path = normalizeAdminPathname(pathname);
  return !TUTOR_BLOCKED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

function filterNavItems(
  items: NavItemConfig[],
  role: UserRole | string | undefined,
): NavigationSidebarItem[] {
  if (!isTutorRole(role)) {
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
    { href: adminPath("/calender"), label: "Calender", icon: BookOpen },
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
      href: adminPath("/auditlog"),
      label: "Audit log",
      icon: ClipboardList,
      tutorHidden: true,
    },
    {
      href: adminPath("/certificates"),
      label: "Certificates",
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
