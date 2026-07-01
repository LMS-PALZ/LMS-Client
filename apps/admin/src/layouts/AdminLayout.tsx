"use client";

import {
  DashboardLayout,
  useSidebarCollapsed,
  AdminSidebar,
  HeaderBar,
  type NavigationSidebarLinkProps,
} from "@ssu/ui";
import { useSession } from "@ssu/queries";
import { AdminModalProvider } from "@/contexts/AdminModalProvider";
import { HelpCircle, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getAdminPageTitle } from "@/lib/adminRoutes";
import { getNavSectionsForRole } from "@/lib/admin-roles";

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
  const { data: user } = useSession();
  const { mainItems, teachingItems, toolsItems } = getNavSectionsForRole(
    user?.role,
  );

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
