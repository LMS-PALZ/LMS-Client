"use client";

import { Card } from "./Card";

import { Table } from "./Table";

import { StudentManagementProps } from "@ssu/types";

export function StudentManagement({ stats, students }: StudentManagementProps) {
  return (
    <section className="rounded-[28px] bg-[#F8FAF8] p-6">
      <Card stats={stats} />

      <Table students={students} />
    </section>
  );
}
