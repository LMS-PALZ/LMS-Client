"use client";

import { Button, AlertBanner, CustomSelect } from "@ssu/ui";
import { useAssignroleMutation, usePrograms } from "@ssu/queries";
import { useState } from "react";

interface AssignroleProps {
  tutorId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function Assignrole({ tutorId, onClose, onSuccess }: AssignroleProps) {
  const assignRole = useAssignroleMutation();

  const { data: programs, isLoading, error } = usePrograms();

  const [selectedProgram, setSelectedProgram] = useState("");

  const selectedProgramData = programs?.find(
    (program) => program.title === selectedProgram,
  );

  // const programId = selectedProgramData?.id;

  const handleAssign = async () => {
    if (!selectedProgramData) return;

    try {
      await assignRole.mutateAsync({
        programId: selectedProgramData?.id ?? "",
        tutorIds: [tutorId],
      });

      onSuccess();
    } catch {}
  };

  return (
    <div className="space-y-5">
      {assignRole.isError && (
        <AlertBanner variant="error">
          {(assignRole.error as Error)?.message}
        </AlertBanner>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">Program</label>

        <CustomSelect
          placeholder="Select Program"
          value={selectedProgram}
          onChange={setSelectedProgram}
          options={programs?.map((program) => program.title) ?? []}
        />
      </div>

      {error && <p className="text-sm text-red-500">Failed to load programs</p>}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={onClose}
          className="bg-[#E2E8F0] text-[#1D1D1D]"
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={handleAssign}
          disabled={!selectedProgram || isLoading || assignRole.isPending}
          className="rounded-[30px]"
        >
          {assignRole.isPending ? "Assigning..." : "Assign Program"}
        </Button>
      </div>
    </div>
  );
}
