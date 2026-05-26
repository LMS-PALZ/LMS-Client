"use client";

import { useSession } from "@ssu/queries";
import { Bell, Menu } from "lucide-react";

import { useSidebar } from "@ssu/ui";

export function HeaderBar() {
  const { data: user } = useSession();

  const { toggleMobileSidebar } = useSidebar();

  return (
    <header className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white transition hover:bg-[#F4F4F5] lg:hidden"
        >
          <Menu className="h-5 w-5 text-[#1D1D1D]" />
        </button>

        <h1 className="text-[12px] text-[#1D1D1D] hidden lg:block">
          Student Workspace
        </h1>
      </div>

      {user && (
        <div className="flex items-center gap-2 md:gap-3">
          <button className="relative flex h-11 w-11 items-center justify-center rounded-[50%] hover:bg-[#F4F4F5]">
            <Bell className="h-5 w-5 text-[#1D1D1D]" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#EF4444]" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl">
            <span className="h-9 w-9 rounded-full object-cover bg-blue-300" />
          </div>
        </div>
      )}
    </header>
  );
}
