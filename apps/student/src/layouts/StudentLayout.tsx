"use client";

import {
  DashboardLayout,
  StudentSidebar,
  useSidebarCollapsed,
  type NavigationSidebarLinkProps,
} from "@ssu/ui";
import {
  CalendarDays,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ProfileSetupProvider } from "@/contexts/ProfileSetupContext";
import { HeaderBar } from "../components/HeaderBar";

const mainItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
];

const learningItems = [
  { href: "/classroom", label: "My Classroom", icon: GraduationCap },
  { href: "/assessments", label: "Assessments", icon: ClipboardList },
];

const supportItem = {
  href: "/support",
  label: "Support",
  icon: HelpCircle,
};

function RouterLink({ href, className, children }: NavigationSidebarLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function StudentSidebarWrapper() {
  const pathname = usePathname();
  const { toggle } = useSidebarCollapsed();

  return (
    <StudentSidebar
      pathname={pathname}
      mainItems={mainItems}
      learningItems={learningItems}
      supportItem={supportItem}
      logoSrc="/firstlogo.png"
      LinkComponent={RouterLink}
      onToggleCollapse={toggle}
    />
  );
}

export function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSessionPage = /^\/classroom\/[^/]+$/.test(pathname);

  return (
    <ProfileSetupProvider>
      <DashboardLayout
        variant="student"
        fullWidthMain={isSessionPage}
        sidebar={<StudentSidebarWrapper />}
        header={<HeaderBar />}
      >
        {children}
      </DashboardLayout>
    </ProfileSetupProvider>
  );
}
