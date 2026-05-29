"use client";

import { cn } from "@ssu/utils";
import { Menu } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";

export type DashboardLayoutVariant = "default" | "student";

export interface DashboardLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  variant?: DashboardLayoutVariant;
  fullWidthMain?: boolean;
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
  variant = "default",
  fullWidthMain = false,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isStudent = variant === "student";

  return (
    <SidebarCollapseContext.Provider
      value={{
        collapsed,
        toggle: () => {
          setCollapsed((c) => !c);
        },
      }}
    >
      <div className="flex h-screen overflow-hidden bg-neutral-50">
        <aside
          className={cn(
            "flex-shrink-0 h-full flex flex-col transition-all duration-300 border-r",
            isStudent
              ? "bg-white border-neutral-200"
              : "bg-brand-green border-transparent",
            collapsed
              ? "w-[var(--sidebar-width-collapsed)]"
              : "w-[var(--sidebar-width)]",
          )}
        >
          {sidebar}
        </aside>

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <header className="h-[var(--header-height)] bg-white border-b border-neutral-200 flex-shrink-0 flex items-center px-6 gap-4">
            {!isStudent && (
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <span className="sr-only">Toggle sidebar</span>
                <Menu className="h-5 w-5 text-neutral-700" aria-hidden />
              </button>
            )}
            {header}
          </header>

          <main className="flex-1 overflow-y-auto bg-white">
            <div
              className={cn(
                "mx-auto p-6",
                fullWidthMain ? "max-w-none" : "max-w-[1280px]",
              )}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarCollapseContext.Provider>
  );
}
