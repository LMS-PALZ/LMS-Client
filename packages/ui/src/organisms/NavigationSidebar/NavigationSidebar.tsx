"use client";

import { cn } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

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

export function NavigationSidebar({
  items,
  pathname,
  collapsed = false,
  header,
  footer,
  className,
  LinkComponent = DefaultLink,
}: NavigationSidebarProps) {
  return (
    <div className={cn("flex h-full flex-col text-white", className)}>
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-3">
        {header}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <LinkComponent
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-h4 transition-colors",
                "text-white/80 hover:bg-white/10",
                active && "border-l-2 border-white bg-white/10 text-white",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
              <span
                className={cn(
                  "truncate transition-opacity",
                  collapsed
                    ? "sr-only lg:not-sr-only opacity-0 lg:opacity-100 w-0 lg:w-auto"
                    : "",
                )}
              >
                {label}
              </span>
            </LinkComponent>
          );
        })}
      </nav>
      {footer && <div className="border-t border-white/10 p-3">{footer}</div>}
    </div>
  );
}
