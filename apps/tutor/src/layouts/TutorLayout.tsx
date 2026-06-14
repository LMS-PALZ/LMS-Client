"use client";

import { tutorPath } from "@ssu/config/portal-paths";
import {
  DashboardLayout,
  useSidebarCollapsed,
  TutorSidebar,
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
import { getTutorPageTitle } from "@/lib/tutorRoutes";

const mainItems: NavigationSidebarItem[] = [
  { href: tutorPath(), label: "Home", icon: LayoutDashboard },
  { href: tutorPath("/students"), label: "Students", icon: BookOpen },
  { href: tutorPath("/calender"), label: "Calender", icon: BookOpen },
];

const teachingItems = [
  { href: "/programs", label: "Programs", icon: GraduationCap },
  { href: "/classroom", label: "Classroom", icon: ClipboardList },
  { href: "/assessment", label: "Assessment", icon: ClipboardList },
];

function RouterLink({ href, className, children }: NavigationSidebarLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function TutorSidebarWrapper() {
  const pathname = usePathname();
  const { toggle } = useSidebarCollapsed();

  return (
    <TutorSidebar
      pathname={pathname}
      mainItems={mainItems}
      teachingItems={teachingItems}
      logoSrc="/firstlogo.png"
      LinkComponent={RouterLink}
      onToggleCollapse={toggle}
    />
  );
}

export function TutorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSessionPage = /^\/classroom\/[^/]+$/.test(pathname);

  return (
    <DashboardLayout
      variant="admin"
      fullWidthMain={isSessionPage}
      sidebar={<TutorSidebarWrapper />}
      header={
        <HeaderBar
          pageTitle={getTutorPageTitle(pathname)}
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
