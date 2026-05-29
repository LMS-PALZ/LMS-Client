"use client";

import { useLogout, useSession } from "@ssu/queries";
import { Avatar, Button, DashboardTopBar } from "@ssu/ui";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { getStudentPageTitle } from "../lib/studentRoutes";

export function HeaderBar() {
  const pathname = usePathname();
  const { data: user } = useSession();
  const logout = useLogout();
  const title = getStudentPageTitle(pathname);

  return (
    <DashboardTopBar
      title={title}
      endSlot={
        <div className="flex items-center gap-2">
          {user && (
            <>
              <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                size="sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                aria-label="Sign out"
                className="hidden sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      }
    />
  );
}
