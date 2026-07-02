"use client";

import { AuditLogTable } from "@/components/AuditLogTable";
import { useAuditLogEntries } from "@/hooks/use-audit-log";
import { PageHeader } from "@ssu/ui";
import { useEffect, useState } from "react";

export function AuditlogPage() {
  const entries = useAuditLogEntries();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All actions");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, actionFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        breadcrumbs={[{ label: "Admin" }, { label: "Audit Log" }]}
      />

      <section className="rounded-[18px] bg-white p-6">
        <h2 className="mb-6 text-[18px] font-semibold text-[#1D1D1D]">
          ({entries.length}) Activity records
        </h2>

        <AuditLogTable
          entries={entries}
          search={search}
          setSearch={setSearch}
          actionFilter={actionFilter}
          setActionFilter={setActionFilter}
          page={page}
          setPage={setPage}
        />
      </section>
    </div>
  );
}
