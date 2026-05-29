"use client";

import { cn } from "@ssu/utils";

export interface PillTabItem<T extends string> {
  id: T;
  label: string;
}

export interface PillTabsProps<T extends string> {
  items: PillTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function PillTabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: PillTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex flex-wrap gap-2 rounded-xl bg-neutral-100 p-1",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "rounded-lg px-4 py-2 text-small font-medium transition-colors",
              active
                ? "bg-brand-green-50 text-brand-green shadow-sm"
                : "text-neutral-600 hover:text-neutral-900",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
