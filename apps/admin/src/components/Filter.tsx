"use client";

import { Search } from "lucide-react";

interface Props {
  searchValue?: string;
}

export function Filter({ searchValue }: Props) {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2"
          size={18}
        />

        <input
          value={searchValue}
          placeholder="Search students..."
          className="h-12 w-[360px] rounded-[14px] border pl-12"
        />
      </div>

      <select className="h-12 w-[220px] rounded-[14px] border px-4">
        <option>All Statuses</option>
      </select>

      <select className="h-12 w-[220px] rounded-[14px] border px-4">
        <option>All Program</option>
      </select>
    </div>
  );
}
