"use client";

import { cn } from "@ssu/utils";
import { createContext, useContext, useState, type ReactNode } from "react";
import { SidebarProvider } from "../../organisms/SidebarContext";
import { MobileSidebar } from "../../organisms/NavigationSidebar/MobileSidebar";

export type DashboardLayoutVariant = "default" | "student" | "admin";

export interface DashboardLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  variant?: DashboardLayoutVariant;
  fullWidthMain?: boolean;
  overlay?: ReactNode;
}

export const SidebarCollapseContext = createContext({
  collapsed: false,
  toggle: () => {},
});

export function useSidebarCollapsed() {
  return useContext(SidebarCollapseContext);
}

export function DashboardLayout({
  sidebar,
  header,
  children,
  fullWidthMain = false,
  overlay,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarCollapseContext.Provider
      value={{
        collapsed,
        toggle: () => {
          setCollapsed((c) => !c);
        },
      }}
    >
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden bg-[#F0F5F1] lg:gap-2">
          <aside className="hidden lg:block">{sidebar}</aside>

          <MobileSidebar>{sidebar}</MobileSidebar>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-none bg-[#FAFAFA] lg:rounded-[16px]">
            <header className="flex h-[var(--header-height)] flex-shrink-0 items-center px-4 md:px-6">
              {header}
            </header>

            <main className="flex-1 overflow-y-auto">
              <div
                className={cn(
                  "mx-auto p-4 md:p-6",
                  fullWidthMain ? "max-w-none" : "max-w-[1280px]",
                )}
              >
                {children}
              </div>
            </main>
          </div>

          {overlay}
        </div>
      </SidebarProvider>
    </SidebarCollapseContext.Provider>
  );
}
