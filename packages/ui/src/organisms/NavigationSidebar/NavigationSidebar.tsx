"use client";

import { cn } from "@ssu/utils";

import type { LucideIcon } from "lucide-react";

import { LayoutPanelLeft, CircleHelp } from "lucide-react";

import type { ComponentType, ReactNode } from "react";

import { useSidebar } from "../SidebarContext";

export interface NavigationSidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  section?: string;
}

export interface NavigationSidebarLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export interface NavigationSidebarProps {
  items: NavigationSidebarItem[];
  pathname: string;
  className?: string;
  LinkComponent?: ComponentType<NavigationSidebarLinkProps>;
  header?: ReactNode;
}

function DefaultLink({
  href,
  className,
  children,
  onClick,
}: NavigationSidebarLinkProps) {
  return (
    <a href={href} className={className} onClick={onClick}>
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
  className,
  LinkComponent = DefaultLink,
  header,
}: NavigationSidebarProps) {
  const { collapsed, setCollapsed, setMobileOpen } = useSidebar();

  const groupedItems = items.reduce<
    Array<{
      section?: string;
      items: NavigationSidebarItem[];
    }>
  >((groups, item) => {
    const section = item.section;
    const currentGroup = groups[groups.length - 1];

    if (currentGroup && currentGroup.section === section) {
      currentGroup.items.push(item);
      return groups;
    }

    groups.push({
      section,
      items: [item],
    });
    return groups;
  }, []);

  return (
    <aside
      className={cn(
        "relative flex min-h-screen w-screen flex-col bg-[#FFFFFF] px-7 py-8 transition-all duration-500 ease-in-out lg:min-h-full tr-rounded-[28px] lg:px-5 lg:py-6",
        collapsed ? "lg:w-[85px] lg:px-3" : "lg:w-[240px]",
        className,
      )}
    >
      <div
        className={cn(
          "group relative flex items-start",
          collapsed ? "lg:justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <>
            <div className={cn("flex flex-col", collapsed ? "lg:hidden" : "")}>
              {header ?? (
                <img
                  src="/firstlogo.png"
                  alt="Skill Scale Up"
                  className="h-[54px] w-auto object-contain transition-all duration-300"
                />
              )}
            </div>

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="mt-1 hidden h-10 w-10 items-center justify-center rounded-xl transition hover:bg-[#EEF2EE] lg:flex"
            >
              <LayoutPanelLeft size={19} className="text-[#1D1D1D]" />
            </button>
          </>
        )}

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="group/logo relative hidden h-11 w-11 items-center justify-center lg:flex"
          >
            <img
              src="/logo.png"
              alt="Skill Scale Up"
              className="absolute h-10 w-10 object-contain transition-all duration-300 group-hover/logo:opacity-0"
            />

            <div className="absolute opacity-0 transition-all duration-300 group-hover/logo:opacity-100">
              <LayoutPanelLeft size={20} className="text-[#1D1D1D]" />
            </div>
          </button>
        )}
      </div>

      <nav className="mt-10 flex-1 overflow-y-auto">
        <div className="space-y-8 lg:space-y-6">
          {groupedItems.map((group, groupIndex) => (
            <div key={`${group.section ?? "default"}-${groupIndex}`}>
              {group.section && !collapsed && (
                <>
                  {groupIndex > 0 && <div className="mb-6 h-px bg-[#E8EDF5]" />}

                  <p className="mb-4 text-[18px] font-medium text-[#7A8594] lg:text-[16px]">
                    {group.section}
                  </p>
                </>
              )}

              <div className="space-y-4 lg:space-y-2">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active =
                    pathname === href || pathname.startsWith(`${href}/`);

                  return (
                    <LinkComponent
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center rounded-[9px] py-2 text-[17px] font-medium transition-all duration-300 lg:text-[15px]",
                        collapsed ? "lg:justify-center lg:px-2" : "gap-3 px-3",
                        active
                          ? "bg-[#F2F6F3] text-[#355B41]"
                          : "text-[#4A4F59] hover:bg-[#FAFAFA]",
                      )}
                    >
                      <Icon className="h-[22px] w-[22px] shrink-0 lg:h-[20px] lg:w-[20px]" />

                      <span
                        className={cn(
                          "overflow-hidden whitespace-nowrap transition-all duration-300",
                          collapsed
                            ? "lg:w-0 lg:opacity-0"
                            : "w-auto opacity-100",
                        )}
                      >
                        {label}
                      </span>
                    </LinkComponent>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          className={cn(
            "flex w-full items-center rounded-[16px] py-3 text-[17px] font-medium text-[#4A4F59] transition-all duration-300 hover:bg-[#F1F3F1] lg:text-[15px]",
            collapsed ? "lg:justify-center lg:px-2" : "gap-3 px-3",
          )}
        >
          <CircleHelp size={22} />

          <span
            className={cn(
              "overflow-hidden whitespace-nowrap transition-all duration-300",
              collapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100",
            )}
          >
            Support
          </span>
        </button>
      </div>
    </aside>
  );
}
