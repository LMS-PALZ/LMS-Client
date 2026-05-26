"use client";

import {
  DashboardLayout,
  NavigationSidebar,
  type NavigationSidebarItem,
  type NavigationSidebarLinkProps,
} from "@ssu/ui";
import {
  CalendarDays,
  ClipboardList,
  GraduationCap,
  House,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { HeaderBar } from "../components/HeaderBar";
import { AccountSetupModal } from "../views/ProfileSetting/AccountSetupModal";

const items: NavigationSidebarItem[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/schedule", label: "Calendar", icon: CalendarDays },
  {
    href: "/courses",
    label: "My Classroom",
    icon: GraduationCap,
    section: "Learning",
  },
  {
    href: "/assignments",
    label: "Assessments",
    icon: ClipboardList,
    section: "Learning",
  },
];

function RouterLink({ href, className, children }: NavigationSidebarLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function StudentLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const profileCompleted = false;
  return (
    <DashboardLayout
      sidebar={
        <NavigationSidebar
          pathname={pathname}
          items={items}
          LinkComponent={RouterLink}
        />
      }
      header={<HeaderBar />}
      overlay={!profileCompleted ? <AccountSetupModal /> : null}
    >
      {children}
    </DashboardLayout>
  );
}
