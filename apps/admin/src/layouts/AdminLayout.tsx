"use client";

import { adminPath } from "@ssu/config/portal-paths";
import {
  DashboardLayout,
  useSidebarCollapsed,
  AdminSidebar,
  HeaderBar,
  type NavigationSidebarItem,
  type NavigationSidebarLinkProps,
  AdminModalProvider,
} from "@ssu/ui";
import {
  CalendarDays,
  ClipboardList,
  Users,
  Settings,
  HelpCircle,
  NotebookText,
  FilePenLine,
  BriefcaseBusiness,
  GraduationCap,
  House,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getAdminPageTitle } from "@/lib/adminRoutes";

const mainItems: NavigationSidebarItem[] = [
  { href: adminPath(), label: "Home", icon: House },
  { href: adminPath("/students"), label: "Students", icon: Users },
  { href: adminPath("/calender"), label: "Calender", icon: CalendarDays },
];

const teachingItems = [
  { href: "/programs", label: "Programs", icon: NotebookText },
  { href: "/classroom", label: "Classroom", icon: ClipboardList },
  { href: "/assessment", label: "Assessment", icon: FilePenLine },
];

const toolsItems = [
  { href: "/staff", label: "Staff", icon: BriefcaseBusiness },
  { href: "/auditlog", label: "Audit log", icon: ClipboardList },
  { href: "/certificates", label: "Certificates", icon: GraduationCap },
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
    <AdminModalProvider>
      <DashboardLayout
        variant="admin"
        fullWidthMain={isSessionPage}
        sidebar={<AdminSidebarWrapper />}
        header={
          <HeaderBar
            pageTitle={getAdminPageTitle(pathname)}
            menuItems={[
              { label: "Account", href: "/account", icon: Users },
              { label: "Settings", href: "/settings", icon: Settings },
              { label: "Support", href: "/support", icon: HelpCircle },
            ]}
          />
        }
      >
        {children}
      </DashboardLayout>
    </AdminModalProvider>
  );
}
