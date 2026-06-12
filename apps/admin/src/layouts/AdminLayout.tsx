"use client";

import { adminPath } from "@ssu/config/portal-paths";
import {
  DashboardLayout,
  useSidebarCollapsed,
  AdminSidebar,
  HeaderBar,
  type NavigationSidebarItem,
  type NavigationSidebarLinkProps,
} from "@ssu/ui";
import {
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getStudentPageTitle } from "@/lib/adminRoutes";

const mainItems: NavigationSidebarItem[] = [
  { href: adminPath(), label: "Home", icon: LayoutDashboard },
  { href: adminPath("/students"), label: "Students", icon: BookOpen },
  { href: adminPath("/calendar"), label: "Calendar", icon: BookOpen },
];

const teachingItems = [
  { href: "/programs", label: "Programs", icon: GraduationCap },
  { href: "/classroom", label: "Classroom", icon: ClipboardList },
  { href: "/assessment", label: "Assessment", icon: ClipboardList },
];

const toolsItems = [
  { href: "/staff", label: "Staff", icon: GraduationCap },
  { href: "/auditlog", label: "Audit log", icon: ClipboardList },
  { href: "/certificates", label: "Certificates", icon: ClipboardList },
];

function RouterLink({ href, className, children }: NavigationSidebarLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function AdminSidebarWrapper() {
  const pathname = usePathname();
  const { toggle } = useSidebarCollapsed();

  return (
    <AdminSidebar
      pathname={pathname}
      mainItems={mainItems}
      teachingItems={teachingItems}
      toolsItems={toolsItems}
      logoSrc="/firstlogo.png"
      LinkComponent={RouterLink}
      onToggleCollapse={toggle}
    />
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSessionPage = /^\/classroom\/[^/]+$/.test(pathname);

  return (
    <DashboardLayout
      variant="admin"
      fullWidthMain={isSessionPage}
      sidebar={<AdminSidebarWrapper />}
      header={
        <HeaderBar
          pageTitle={getStudentPageTitle(pathname)}
          menuItems={[
            { label: "Account", href: "/account", icon: User },
            { label: "Settings", href: "/settings", icon: Settings },
            { label: "Support", href: "/support", icon: HelpCircle },
          ]}
        />
      }
    >
      {children}
    </DashboardLayout>
  );
}
