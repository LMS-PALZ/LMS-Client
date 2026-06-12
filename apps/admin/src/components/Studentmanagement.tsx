"use client";

import { Card } from "./Card";
import { Table } from "./Table";
import { StudentManagementProps } from "@ssu/types";
import { StudentList } from "@ssu/queries";

export function StudentManagement({ stats }: StudentManagementProps) {
  const { data } = StudentList(1, 10);
  return (
    <section className="flex flex-col gap-8 rounded-[18px] bg-[#FFFFFF] p-6">
      <section className="p-2 bg-[#FAFAFA] rounded-[12px]">
        <Card stats={stats} />
      </section>

      <Table students={data?.items ?? []} />
    </section>
  );
}
