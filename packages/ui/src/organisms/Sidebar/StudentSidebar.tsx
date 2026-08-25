"use client";

import { cn } from "@ssu/utils";
import { PanelLeftClose } from "lucide-react";
import type { ComponentType } from "react";
import { useSidebarCollapsed } from "../../layouts/DashboardLayout";
import { BrandLogo } from "../BrandLogo";
import {
  NavigationSidebarSection,
  type NavigationSidebarItem,
  type NavigationSidebarLinkProps,
} from "../NavigationSidebar";

export interface StudentSidebarProps {
  pathname: string;
  mainItems: NavigationSidebarItem[];
  learningItems: NavigationSidebarItem[];
  supportItem: NavigationSidebarItem;
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
            <Icon
              className={cn(
                "h-[18px] w-[18px] shrink-0 transition-transform duration-300 text-[#4C7D5B]",
                collapsed && "mx-auto",
              )}
            />
            <span
              className={cn(
                "truncate transition-all duration-300 text-[#495057]",
                collapsed ? "w-0 opacity-0" : "w-auto opacity-100",
              )}
            >
              {label}
            </span>
          </LinkComponent>
        );
      })}
    </>
  );
}

export function StudentSidebar({
  pathname,
  mainItems,
  learningItems,
  supportItem,
  logoSrc = "/firstlogo.png",
  LinkComponent = DefaultLink,
  onToggleCollapse,
}: StudentSidebarProps) {
  const { collapsed } = useSidebarCollapsed();
  const Link = LinkComponent;

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-[#F8FAF8] rounded-tr-[15px] text-neutral-700 transition-[width] duration-300 ease-in-out",
        collapsed ? "w-20" : "w-60",
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-neutral-200 px-3",
          "transition-all duration-300",
        )}
      >
        <div className="flex w-full items-center justify-between">
          <BrandLogo
            collapsed={collapsed}
            logoSrc={logoSrc}
            collapsedLogoSrc="/secondlogo.png"
            className="transition-all duration-300"
          />

          {!collapsed && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}

          {collapsed && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="absolute inset-0 opacity-0"
            />
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
        <NavigationSidebarSection label="Learning" collapsed={collapsed} />
        <NavItems
          items={learningItems}
          pathname={pathname}
          collapsed={collapsed}
          LinkComponent={Link}
        />
      </nav>
      <div className="border-t border-neutral-200 p-3">
        <NavItems
          items={[supportItem]}
          pathname={pathname}
          collapsed={collapsed}
          LinkComponent={Link}
        />
      </div>
    </div>
  );
}
