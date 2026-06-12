"use client";

import { useState } from "react";
import { AdminTable } from "@/components/AdminTable";
import { TrainerTable } from "@/components/TrainerTable";
import { StaffStat } from "@ssu/api";
import { StaffCard } from "@/components/StaffCard";
import { StaffList } from "@ssu/queries";

type StaffTab = "admin" | "tutor";

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<StaffTab>("admin");
  const { data } = StaffList(1, 10, activeTab);

  return (
    <section className="flex flex-col gap-8 rounded-[18px] bg-[#FFFFFF] p-6">
      <section className="p-2 bg-[#FAFAFA] rounded-[12px]">
        <StaffCard stats={StaffStat} />
      </section>
      <div className="mb-6 flex items-center gap-2 rounded-[12px] bg-[#ECF0F6] p-[2px] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("admin")}
          className={`rounded-[9px] px-5 py-2 text-[12px] font-medium transition ${
            activeTab === "admin"
              ? "bg-white text-[#1D1D1D] shadow-sm"
              : "text-[#6B7280]"
          }`}
        >
          Admin
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tutor")}
          className={`rounded-[9px] px-5 py-2 text-[12px] font-medium transition ${
            activeTab === "tutor"
              ? "bg-white text-[#1D1D1D] shadow-sm"
              : "text-[#6B7280]"
          }`}
        >
          Tutor
        </button>
      </div>

      {activeTab === "admin" ? (
        <AdminTable admins={data?.items ?? []} />
      ) : (
        <TrainerTable trainers={data?.items ?? []} />
      )}
    </section>
  );
}
