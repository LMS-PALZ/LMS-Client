"use client";

import { useStudentAssignments } from "@ssu/queries";
import {
  AlertBanner,
  AssignmentCard,
  Badge,
  Button,
  EmptyState,
  PageHeader,
  Skeleton,
} from "@ssu/ui";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Filter = "all" | "not-started" | "submitted" | "graded" | "overdue";

export function AssignmentsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const q = useStudentAssignments();

  const grouped = useMemo(() => {
    const data = q.data ?? [];
    const filtered =
      filter === "all"
        ? data
        : data.filter((a) =>
            filter === "not-started"
              ? a.status === "not-started"
              : a.status === filter,
          );
    const map = new Map<string, typeof data>();
    for (const a of filtered) {
      const list = map.get(a.courseName) ?? [];
      list.push(a);
      map.set(a.courseName, list);
    }
    return map;
  }, [q.data, filter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        breadcrumbs={[{ label: "Student" }, { label: "Assignments" }]}
      />
      {q.isError && (
        <AlertBanner variant="error">Could not load assignments.</AlertBanner>
      )}
      <div className="flex flex-wrap gap-2">
        {(
          ["all", "not-started", "submitted", "graded", "overdue"] as const
        ).map((f) => (
          <Button
            key={f}
            type="button"
            variant={filter === f ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f.replace("-", " ")}
          </Button>
        ))}
      </div>
      {q.isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : !q.data?.length ? (
        <EmptyState icon={ClipboardList} title="No assignments" />
      ) : (
        <div className="space-y-8">
          {[...grouped.entries()].map(([course, rows]) => (
            <section key={course}>
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-h3 text-neutral-900">{course}</h2>
                <Badge variant="default">{rows.length}</Badge>
              </div>
              <ul className="space-y-3">
                {rows.map((a) => (
                  <li key={a.id}>
                    <AssignmentCard
                      title={a.title}
                      courseName={a.courseName}
                      dueAt={a.dueAt}
                      overdue={a.status === "overdue"}
                      statusVariant={
                        a.status === "not-started" ? "not-started" : a.status
                      }
                      statusLabel={a.status.replace("-", " ")}
                      action={
                        <Button variant="primary" size="sm" asChild>
                          <Link href={`/assignments/${a.id}`}>Open</Link>
                        </Button>
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
