import type { CourseModuleDraft } from "../types";

export interface StepReviewProps {
  values: {
    title?: string;
    description?: string;
    category?: string;
    durationHours?: number;
  };
  modules: CourseModuleDraft[];
}

export function StepReview({ values, modules }: StepReviewProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-card space-y-3 text-body">
      <div>
        <p className="text-small text-neutral-500">Title</p>
        <p className="font-semibold text-neutral-900">
          {values.title || "N/A"}
        </p>
      </div>
      <div>
        <p className="text-small text-neutral-500">Category</p>
        <p>{values.category || "N/A"}</p>
      </div>
      <div>
        <p className="text-small text-neutral-500">Modules</p>
        <ol className="list-decimal pl-5 space-y-1">
          {modules.map((m) => (
            <li key={m.id}>
              {m.title} ({m.type})
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
