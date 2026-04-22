"use client";

import { useLogout, useSession } from "@ssu/queries";
import { Avatar, Button, TopHeader } from "@ssu/ui";
import { LogOut } from "lucide-react";

export function HeaderBar() {
  const { data: user } = useSession();
  const logout = useLogout();

  return (
    <TopHeader
      titleSlot={
        <span className="text-h4 text-neutral-700">Tutor workspace</span>
      }
      endSlot={
        <div className="flex items-center gap-2">
          {user && (
            <>
              <span className="text-small text-neutral-600 hidden sm:inline">
                {user.firstName} {user.lastName}
              </span>
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
