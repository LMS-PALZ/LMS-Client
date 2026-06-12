"use client";

import { Users, UserCheck, Flag } from "lucide-react";
import { StatCard } from "@ssu/ui";
import type { StaffStats } from "@ssu/types";
import type { LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Users, UserCheck, Flag];
interface Props {
  stats: StaffStats[];
}

export function StaffCard({ stats }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id}
          label={stat.title}
          value={stat.value}
          icon={ICONS[index]}
        />
      ))}
    </div>
  );
}
