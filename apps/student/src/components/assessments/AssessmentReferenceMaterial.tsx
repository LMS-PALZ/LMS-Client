"use client";

import { FileText, ExternalLink, Link as LinkIcon } from "lucide-react";

interface ReferenceMaterial {
  file?: {
    url: string;
    public_id: string;
  } | null;
  link?: string | null;
}

interface ReferenceItem {
  url: string;
  title: string;
  icon: "file" | "link";
}

function getReferenceItems(materials: ReferenceMaterial[]): ReferenceItem[] {
  const items: ReferenceItem[] = [];

  materials.forEach((material, index) => {
    if (material.file?.url) {
      items.push({
        url: material.file.url,
        title: material.file.public_id?.split("/").pop() ?? `File ${index + 1}`,
        icon: "file",
      });
    }

    if (material.link) {
      items.push({
        url: material.link,
        title: material.link,
        icon: "link",
      });
    }
  });

  return items;
}

export function AssessmentReferenceMaterial({
  materials,
}: {
  materials: ReferenceMaterial[];
}) {
  if (!materials?.length) return null;

  const items = getReferenceItems(materials);

  if (!items.length) return null;

  return (
    <section className="space-y-3 border-t border-neutral-200/80 pt-6">
      <h2 className="text-[15px] font-bold text-neutral-900 sm:text-[16px]">
        Reference Material
      </h2>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={`${item.url}-${index}`}
            className="flex items-center justify-between rounded-[12px] border border-[#E2E8F0] p-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#F8FAFC]">
                {item.icon === "file" ? (
                  <FileText className="h-5 w-5 text-[#6B7280]" />
                ) : (
                  <LinkIcon className="h-5 w-5 text-[#6B7280]" />
                )}
              </div>
              <p className="truncate text-[13px] font-medium text-[#1D1D1D]">
                {item.title}
              </p>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-[#4E845F] hover:opacity-80"
            >
              Open
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
