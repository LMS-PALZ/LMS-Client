"use client";

import { cn } from "@ssu/utils";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import type { ComponentType } from "react";
import { useSidebarCollapsed } from "../../layouts/DashboardLayout";
import { BrandLogo } from "../BrandLogo";
import {
  NavigationSidebarSection,
  type NavigationSidebarItem,
  type NavigationSidebarLinkProps,
} from "../NavigationSidebar";

export interface AdminSidebarProps {
  pathname: string;
  mainItems: NavigationSidebarItem[];
  toolsItems: NavigationSidebarItem[];
  teachingItems: NavigationSidebarItem[];
  logoSrc?: string;
  LinkComponent?: ComponentType<NavigationSidebarLinkProps>;
  onToggleCollapse?: () => void;
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

function NavItems({
  items,
  pathname,
  collapsed,
  LinkComponent,
}: {
  items: NavigationSidebarItem[];
  pathname: string;
  collapsed: boolean;
  LinkComponent: ComponentType<NavigationSidebarLinkProps>;
}) {
  return (
    <>
      {items.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href ||
          (href !== "/" && pathname.startsWith(`${href}/`));
        return (
          <LinkComponent
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-small font-medium transition-colors text-neutral-600 hover:bg-neutral-100",
              active && "bg-brand-green-50 text-brand-green",
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            <span className={cn("truncate", collapsed && "sr-only")}>
              {label}
            </span>
          </LinkComponent>
        );
      })}
    </>
  );
}

export function AdminSidebar({
  pathname,
  mainItems,
  toolsItems,
  teachingItems,
  logoSrc = "/firstlogo.png",
  LinkComponent = DefaultLink,
  onToggleCollapse,
}: AdminSidebarProps) {
  const { collapsed } = useSidebarCollapsed();
  const Link = LinkComponent;

  return (
    <div className="flex h-full flex-col text-neutral-700">
      <div className="flex h-16 shrink-0 items-center border-b border-neutral-200 px-3">
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <BrandLogo
            collapsed={collapsed}
            logoSrc={logoSrc}
            className={cn(collapsed && "flex-1")}
          />
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <NavItems
          items={mainItems}
          pathname={pathname}
          collapsed={collapsed}
          LinkComponent={Link}
        />
        <NavigationSidebarSection label="Teaching" collapsed={collapsed} />
        <NavItems
          items={teachingItems}
          pathname={pathname}
          collapsed={collapsed}
          LinkComponent={Link}
        />
        <NavigationSidebarSection label="Tools" collapsed={collapsed} />
        <NavItems
          items={toolsItems}
          pathname={pathname}
          collapsed={collapsed}
          LinkComponent={Link}
        />
      </nav>
    </div>
  );
}
