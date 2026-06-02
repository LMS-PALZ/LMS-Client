"use client";

import { FileText } from "lucide-react";

export function AssessmentReferenceMaterial({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  return (
    <section className="space-y-3 border-t border-neutral-200/80 pt-6">
      <h2 className="text-[15px] font-bold text-neutral-900 sm:text-[16px]">
        Reference Material
      </h2>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex max-w-full items-center gap-2 text-[14px] font-medium text-[#4E845F] transition hover:underline"
      >
        <FileText className="h-4 w-4 shrink-0" aria-hidden />
        <span className="line-clamp-1">{title}</span>
      </a>
    </section>
  );
}
