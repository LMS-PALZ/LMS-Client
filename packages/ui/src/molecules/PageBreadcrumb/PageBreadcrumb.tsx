"use client";

import { cn } from "@ssu/utils";
import Link from "next/link";

export interface PageBreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageBreadcrumbProps {
  items: PageBreadcrumbItem[];
  className?: string;
}

/** Trail like `Courses > Machine Ai` for inner / nested pages. */
export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  const visible = items.filter((item) => item.label.trim());
  if (visible.length < 2) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("text-[14px] text-[#94A3B8]", className)}
    >
      <ol className="flex flex-wrap items-center gap-x-0">
        {visible.map((item, index) => {
          const isLast = index === visible.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className="inline-flex items-center"
            >
              {index > 0 ? (
                <span className="mx-2 text-[#94A3B8]" aria-hidden>
                  &gt;
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-[#94A3B8] transition hover:text-[#4C7D5B]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? "text-[#1D1D1D]" : "text-[#94A3B8]",
                    "line-clamp-1",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
