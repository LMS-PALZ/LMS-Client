import { cn } from "@ssu/utils";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  breadcrumbs,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="text-small text-neutral-500 mb-1"
          >
            {breadcrumbs.map((b, i) => (
              <span key={`${b.label}-${i}`}>
                {i > 0 && <span className="mx-1">/</span>}
                {b.href ? (
                  <a href={b.href} className="hover:text-brand-green">
                    {b.label}
                  </a>
                ) : (
                  <span className="text-neutral-600">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-h1 text-neutral-900">{title}</h1>
      </div>
      {action}
    </div>
  );
}
