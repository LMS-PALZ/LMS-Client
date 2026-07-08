"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { FormField, Input } from "@ssu/ui";
import type { Cohort } from "../types";
import {
  calculateDurationLabel,
  countCohortsInYear,
  createId,
} from "../lib/course-utils";
import { MAX_COHORTS_PER_YEAR } from "../types";
import { CohortDatePicker } from "./CohortDatePicker";
import { CourseModal } from "./CourseModal";
import { ModalActionButtons } from "./ModalActionButtons";

interface AddCohortModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCohorts: Cohort[];
  onSave: (cohort: Cohort) => void;
}

export function AddCohortModal({
  open,
  onOpenChange,
  existingCohorts,
  onSave,
}: AddCohortModalProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setStartDate(null);
      setEndDate(null);
      setError(null);
    }
  }, [open]);

  const durationLabel = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) return null;
    return calculateDurationLabel(startDate, endDate);
  }, [startDate, endDate]);

  const canSave =
    name.trim().length > 0 && !!startDate && !!endDate && endDate >= startDate;

  const handleSave = () => {
    if (!startDate || !endDate) return;

    const yearCount = countCohortsInYear(
      existingCohorts,
      startDate.getFullYear(),
    );
    if (yearCount >= MAX_COHORTS_PER_YEAR) {
      setError(
        `You can add a maximum of ${MAX_COHORTS_PER_YEAR} cohorts in a calendar year`,
      );
      return;
    }

    onSave({
      id: createId("cohort"),
      name: name.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    onOpenChange(false);
  };

  return (
    <CourseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Cohort"
      className="max-w-lg"
      footer={
        <ModalActionButtons
          onCancel={() => onOpenChange(false)}
          onSave={handleSave}
          saveDisabled={!canSave}
        />
      }
    >
      <div className="space-y-5 overflow-visible">
        <FormField id="cohort-name" label="Cohort name">
          <Input
            id="cohort-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter cohort name"
            className="h-12 rounded-[12px]"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField id="cohort-start" label="Start date">
            <CohortDatePicker
              id="cohort-start"
              value={startDate}
              onChange={setStartDate}
            />
          </FormField>

          <FormField id="cohort-end" label="End date">
            <CohortDatePicker
              id="cohort-end"
              value={endDate}
              onChange={setEndDate}
              minDate={startDate ?? undefined}
              popoverAlign="end"
            />
          </FormField>
        </div>

        {durationLabel && (
          <div className="flex items-center gap-2 rounded-[12px] bg-[#E8F3EC] px-4 py-3 text-[14px] text-[#1D1D1D]">
            <Clock className="h-4 w-4" aria-hidden />
            <span>Duration: {durationLabel}</span>
          </div>
        )}

        {error && (
          <p className="text-[14px] text-red-600" role="alert">
            {error}
          </p>
        )}

        {startDate && endDate && endDate < startDate && (
          <p className="text-[14px] text-red-600" role="alert">
            End date must be on or after the start date.
          </p>
        )}
      </div>
    </CourseModal>
  );
}
