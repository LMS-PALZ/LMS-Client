"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PageBreadcrumbItem } from "./PageBreadcrumb";

type BreadcrumbSetters = {
  setDefaults: (items: PageBreadcrumbItem[]) => void;
  setOverride: (items: PageBreadcrumbItem[] | null) => void;
};

const BreadcrumbItemsContext = createContext<PageBreadcrumbItem[]>([]);
const BreadcrumbSettersContext = createContext<BreadcrumbSetters | null>(null);

function itemsKey(items: PageBreadcrumbItem[]) {
  return items.map((item) => `${item.label}\0${item.href ?? ""}`).join("\n");
}

export function PageBreadcrumbProvider({ children }: { children: ReactNode }) {
  const [defaults, setDefaults] = useState<PageBreadcrumbItem[]>([]);
  const [override, setOverride] = useState<PageBreadcrumbItem[] | null>(null);
  const items = override ?? defaults;

  // Keep setters out of the items context so sync effects do not re-fire when
  // defaults/override update (that caused maximum update depth loops).
  const setters = useMemo<BreadcrumbSetters>(
    () => ({ setDefaults, setOverride }),
    [],
  );

  return (
    <BreadcrumbSettersContext.Provider value={setters}>
      <BreadcrumbItemsContext.Provider value={items}>
        {children}
      </BreadcrumbItemsContext.Provider>
    </BreadcrumbSettersContext.Provider>
  );
}

export function useBreadcrumbItems(): PageBreadcrumbItem[] {
  return useContext(BreadcrumbItemsContext);
}

/** Route-based defaults from the app layout (Home sections, Courses, etc.). */
export function useDefaultBreadcrumbs(items: PageBreadcrumbItem[]) {
  const setters = useContext(BreadcrumbSettersContext);
  const key = itemsKey(items);

  useEffect(() => {
    if (!setters) return;
    setters.setDefaults(items);
    return () => {
      setters.setDefaults([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key captures content
  }, [setters, key]);
}

/**
 * Page-level trail for inner / nested screens (dynamic titles).
 * Wins over layout defaults while mounted.
 */
export function usePageBreadcrumbs(items: PageBreadcrumbItem[]) {
  const setters = useContext(BreadcrumbSettersContext);
  const key = itemsKey(items);

  useEffect(() => {
    if (!setters) return;
    setters.setOverride(items);
    return () => {
      setters.setOverride(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key captures content
  }, [setters, key]);
}
