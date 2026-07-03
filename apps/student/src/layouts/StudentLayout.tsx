"use client";

import {
  DashboardLayout,
  StudentSidebar,
  useSidebarCollapsed,
  HeaderBar,
  type NavigationSidebarLinkProps,
} from "@ssu/ui";
import {
  CalendarDays,
  NotebookText,
  GraduationCap,
  HelpCircle,
  House,
  User,
  Award,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ProfileSetupProvider } from "@/contexts/ProfileSetupContext";
import { useSignupStore } from "@ssu/store";
import { getStudentPageTitle } from "@/lib/studentRoutes";

const mainItems = [
  { href: "/home", label: "Home", icon: House },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
];

const learningItems = [
  { href: "/classroom", label: "My Classroom", icon: GraduationCap },
  { href: "/assessments", label: "Assessment", icon: NotebookText },
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

  const signupUser = useSignupStore((state) => state.user);

  return (
    <ProfileSetupProvider>
      <DashboardLayout
        variant="student"
        fullWidthMain={isSessionPage}
        sidebar={<StudentSidebarWrapper />}
        header={
          <HeaderBar
            pageTitle={getStudentPageTitle(pathname)}
            firstName={signupUser?.first_name}
            lastName={signupUser?.last_name}
            email={signupUser?.email}
            menuItems={[
              { label: "Account", href: "/profile", icon: User },
              { label: "Certificate", href: "/certificate", icon: Award },
              { label: "Support", href: "/support", icon: HelpCircle },
            ]}
          />
        }
      >
        {children}
      </DashboardLayout>
    </ProfileSetupProvider>
  );
}
