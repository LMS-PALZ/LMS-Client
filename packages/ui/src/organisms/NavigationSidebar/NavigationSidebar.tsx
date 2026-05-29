"use client";

import { cn } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

export type NavigationSidebarVariant = "default" | "student";

export interface NavigationSidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavigationSidebarLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export interface NavigationSidebarProps {
  items: NavigationSidebarItem[];
  pathname: string;
  collapsed?: boolean;
  variant?: NavigationSidebarVariant;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  LinkComponent?: ComponentType<NavigationSidebarLinkProps>;
}

function DefaultLink({
  href,
  className,
  children,
}: NavigationSidebarLinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function NavigationSidebarSection({
  label,
  collapsed,
}: {
  label: string;
  collapsed?: boolean;
}) {
  if (collapsed) return null;
  return (
    <p className="px-3 pt-4 pb-1 text-micro font-medium uppercase tracking-wide text-neutral-400">
      {label}
    </p>
  );
}

export function NavigationSidebar({
  items,
  pathname,
  collapsed = false,
  variant = "default",
  header,
  footer,
  className,
  LinkComponent = DefaultLink,
}: NavigationSidebarProps) {
  const isStudent = variant === "student";

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        isStudent ? "text-neutral-700" : "text-white",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center px-3",
          isStudent
            ? "border-b border-neutral-200"
            : "border-b border-white/10",
        )}
      >
        {header}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/" && pathname.startsWith(`${href}/`));
          return (
            <LinkComponent
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-small font-medium transition-colors",
                isStudent
                  ? cn(
                      "text-neutral-600 hover:bg-neutral-100",
                      active && "bg-brand-green-50 text-brand-green",
                    )
                  : cn(
                      "text-white/80 hover:bg-white/10",
                      active &&
                        "border-l-2 border-white bg-white/10 text-white",
                    ),
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
              <span className={cn("truncate", collapsed && "sr-only")}>
                {label}
              </span>
            </LinkComponent>
          );
        })}
      </nav>
      {footer && (
        <div
          className={cn(
            "p-3",
            isStudent
              ? "border-t border-neutral-200"
              : "border-t border-white/10",
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
