"use client";

import { Users, UserCheck, Flag } from "lucide-react";
import { StatCard } from "@ssu/ui";
import type { StudentStat } from "@ssu/types";
import type { LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Users, UserCheck, Flag];
const ACCENTS = ["green", "neutral", "amber"] as const;

interface Props {
  stats: StudentStat[];
}

export function Card({ stats }: Props) {
  return (
    <div className="mb-8 grid gap-4 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id}
          label={stat.title}
          value={stat.value}
          icon={ICONS[index]}
          accent={ACCENTS[index]}
          description={stat.description}
        />
      ))}
    </div>
  );
}
