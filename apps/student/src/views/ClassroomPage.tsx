"use client";

import { useSessionDetail } from "@ssu/queries";
import { Badge, Button, FullPageLayout } from "@ssu/ui";
import { formatDate } from "@ssu/utils";
import { ArrowLeft } from "lucide-react";
import { studentPath } from "@/lib/studentRoutes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export function ClassroomPage() {
  const params = useParams();
  const sessionId =
    typeof params.sessionId === "string" ? params.sessionId : "";
  const q = useSessionDetail(sessionId);
  const [tab, setTab] = useState<"description" | "resources" | "assignment">(
    "description",
  );
  const session = q.data;

  const modules = useMemo(
    () => [
      { id: "m1", title: "Kickoff", type: "live" as const, done: true },
      {
        id: "m2",
        title: "Core concepts",
        type: "recorded" as const,
        active: true,
      },
      { id: "m3", title: "Reading", type: "reading" as const, locked: true },
    ],
    [],
  );

  return (
    <FullPageLayout
      header={
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={studentPath("/home")} aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="min-w-0">
            <p className="text-micro text-neutral-500 truncate">Classroom</p>
            <p className="text-h4 text-neutral-900 truncate">
              {session?.title ?? "Live session"}
            </p>
          </div>
        </div>
      }
    >
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex flex-[0.65] flex-col border-b lg:border-b-0 lg:border-r bg-black">
          <div className="relative aspect-video w-full">
            {!session?.isLive ? (
              <div className="flex h-full flex-col items-center justify-center text-white">
                <p className="text-small text-white/70">Session starts in</p>
                <p className="text-h1 mt-2">01:00:00</p>
              </div>
            ) : (
              <>
                <iframe
                  title="Live class"
                  className="h-full w-full"
                  src="about:blank"
                />
                <Badge
                  variant="pending"
                  className="absolute right-3 top-3 border-0 bg-brand-amber text-white"
                >
                  LIVE
                </Badge>
              </>
            )}
          </div>
          <div className="border-t border-white/10 bg-neutral-900 px-4 py-2">
            <div className="flex gap-2">
              {(["description", "resources", "assignment"] as const).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={
                      tab === t
                        ? "rounded-md bg-white/10 px-3 py-1 text-small font-medium text-white"
                        : "rounded-md px-3 py-1 text-small text-white/70 hover:bg-white/5"
                    }
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ),
              )}
            </div>
            <div className="mt-3 text-small text-white/80">
              {tab === "description" && <p>Session overview.</p>}
              {tab === "resources" && <p>Resources tab.</p>}
              {tab === "assignment" && <p>Assignment tab.</p>}
            </div>
          </div>
        </div>
        <div className="flex flex-[0.35] flex-col gap-4 bg-white p-4">
          <div>
            <p className="text-h3 text-neutral-900">
              {session?.courseName ?? "Course"}
            </p>
            <p className="text-small text-neutral-500 mt-1">
              {session ? formatDate(session.startsAt) : ""}
            </p>
          </div>
          <ul className="space-y-1">
            {modules.map((m) => (
              <li
                key={m.id}
                className={`rounded-lg border px-3 py-2 text-small ${m.active ? "border-l-4 border-l-brand-green bg-brand-green-50" : ""} ${m.locked ? "opacity-50" : ""}`}
              >
                {m.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FullPageLayout>
  );
}
