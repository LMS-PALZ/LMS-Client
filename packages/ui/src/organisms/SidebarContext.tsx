"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextType {
  /* MOBILE SIDEBAR */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  /* DESKTOP COLLAPSE */
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

interface SidebarProviderProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  /* MOBILE */
  const [mobileOpen, setMobileOpen] = useState(false);

  /* DESKTOP */
  const [collapsed, setCollapsed] = useState(false);

  /* TOGGLES */
  const toggleMobileSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        mobileOpen,
        setMobileOpen,
        toggleMobileSidebar,

        collapsed,
        setCollapsed,
        toggleCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }

  return context;
}
