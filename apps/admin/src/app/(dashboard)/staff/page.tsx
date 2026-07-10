"use client";

import { useState } from "react";
import { AdminTable } from "@/components/AdminTable";
import { TrainerTable } from "@/components/TrainerTable";
import { StaffCard } from "@/components/StaffCard";
import { StaffList } from "@ssu/queries";
import { useAdminModal } from "@ssu/ui";
import { InviteStaff } from "@/views/StaffManagement/InviteStaff";
import { StatusDialog } from "@/components/StatusDialog";
import { Button } from "../../../../../../packages/ui/src/atoms/Button/Button";

type StaffTab = "admin" | "tutor";

export default function StaffPage() {
  const { openModal, closeModal } = useAdminModal();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [course, setCourse] = useState("");
  const [activeTab, setActiveTab] = useState<StaffTab>("admin");
  const { data } = StaffList(page, 10, search, status, activeTab, course);

  const openInviteModal = () => {
    openModal(
      "Invite Staff",
      <InviteStaff
        onClose={closeModal}
        onSuccess={(email) => {
          openModal(
            "",
            <StatusDialog
              variant="success"
              title="Invitation sent!"
              description={`You have successfully sent an invite to ${email}.`}
              onDismiss={closeModal}
            />,
          );
        }}
      />,
    );
  };

  return (
    <section className="flex flex-col gap-8 rounded-[18px] bg-[#FFFFFF] p-6">
      <section className="p-2 bg-[#FAFAFA] rounded-[12px]">
        <StaffCard />
      </section>
      <section className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 rounded-[12px] bg-[#ECF0F6] p-[2px] w-fit">
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
            Trainer
          </button>
        </div>

        <div className="w-[150px]">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={openInviteModal}
            className="w-full rounded-[30px] py-2 text-[var(--color-surface)]"
          >
            invite staff
          </Button>
        </div>
      </section>

      {activeTab === "admin" ? (
        <AdminTable
          admins={data?.items ?? []}
          pagination={data?.pagination}
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          setPage={setPage}
        />
      ) : (
        <TrainerTable
          trainers={data?.items ?? []}
          pagination={data?.pagination}
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          course={course}
          setCourse={setCourse}
          setPage={setPage}
        />
      )}
    </section>
  );
}
