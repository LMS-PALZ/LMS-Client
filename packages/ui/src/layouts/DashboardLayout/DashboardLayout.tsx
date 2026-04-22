"use client";

import { cn } from "@ssu/utils";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

export interface DashboardLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({
  sidebar,
  header,
  children,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <aside
        className={cn(
          "flex-shrink-0 h-full bg-brand-green flex flex-col transition-all duration-300",
          collapsed
            ? "w-[var(--sidebar-width-collapsed)]"
            : "w-[var(--sidebar-width)]",
        )}
      >
        {sidebar}
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="h-[var(--header-height)] bg-white border-b flex-shrink-0 flex items-center px-6 gap-4">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <span className="sr-only">Toggle sidebar</span>
            <Menu className="h-5 w-5 text-neutral-700" aria-hidden />
          </button>
          {header}
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
