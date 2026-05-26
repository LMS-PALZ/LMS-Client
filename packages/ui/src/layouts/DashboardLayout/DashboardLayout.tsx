"use client";

import { type ReactNode } from "react";

import { SidebarProvider, MobileSidebar } from "@ssu/ui";

export interface DashboardLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  overlay?: ReactNode;
}

export function DashboardLayout({
  sidebar,
  header,
  children,
  overlay,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[#F0F5F1] lg:gap-2">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block">{sidebar}</aside>

        {/* MOBILE SIDEBAR */}
        <MobileSidebar>{sidebar}</MobileSidebar>

        {/* CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-none bg-[#FAFAFA] lg:rounded-[16px]">
          {/* HEADER */}
          <header className="flex h-[var(--header-height)] flex-shrink-0 items-center px-4 md:px-6">
            {header}
          </header>

          {/* MAIN */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1280px] p-4 md:p-6">{children}</div>
          </main>
        </div>

        {overlay}
      </div>
    </SidebarProvider>
  );
}
