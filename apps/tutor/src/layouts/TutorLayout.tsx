"use client";

import { tutorPath } from "@ssu/config/portal-paths";
import {
  DashboardLayout,
  NavigationSidebar,
  type NavigationSidebarItem,
  type NavigationSidebarLinkProps,
} from "@ssu/ui";
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  UserCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { HeaderBar } from "../components/HeaderBar";

const items: NavigationSidebarItem[] = [
  { href: tutorPath(), label: "Dashboard", icon: LayoutDashboard },
  { href: tutorPath("/courses"), label: "Courses", icon: BookOpen },
  { href: tutorPath("/sessions"), label: "Sessions", icon: Video },
  {
    href: tutorPath("/assignments"),
    label: "Assignments",
    icon: ClipboardList,
  },
  { href: tutorPath("/profile"), label: "Profile", icon: UserCircle },
];

function RouterLink({ href, className, children }: NavigationSidebarLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function TutorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <DashboardLayout
      sidebar={
        <NavigationSidebar
          pathname={pathname}
          items={items}
          LinkComponent={RouterLink}
          header={
            <span className="text-white font-bold text-h4 truncate px-1">
              SSU Tutor
            </span>
          }
        />
      }
      header={<HeaderBar />}
    >
      {children}
    </DashboardLayout>
  );
}
