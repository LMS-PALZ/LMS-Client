"use client";

import {
  DashboardLayout,
  NavigationSidebar,
  type NavigationSidebarItem,
  type NavigationSidebarLinkProps,
} from "@ssu/ui";
import {
  BookOpen,
  LayoutDashboard,
  Megaphone,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { HeaderBar } from "../components/HeaderBar";

const items: NavigationSidebarItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/trainers/pending", label: "Trainer approvals", icon: UserCheck },
  { href: "/programs", label: "Programs", icon: BookOpen },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
];

function RouterLink({ href, className, children }: NavigationSidebarLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
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
              SSU Admin
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
