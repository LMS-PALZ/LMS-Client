"use client";

import { useMemo, useState } from "react";
import { FormField, Input, Textarea } from "@ssu/ui";
import type { Cohort, CourseDraft, Instructor } from "../types";
import { COURSE_DESCRIPTION_MAX, MAX_COHORTS_PER_YEAR } from "../types";
import { formatPriceDisplay } from "../lib/course-utils";
import { AddCohortModal } from "./AddCohortModal";
import { AddInstructorModal } from "./AddInstructorModal";
import { AddItemLink } from "./AddItemLink";
import { CohortRow } from "./CohortRow";
import { InstructorRow } from "./InstructorRow";

interface CourseBasicFormProps {
  value: CourseDraft;
  onChange: (value: CourseDraft) => void;
}

export function CourseBasicForm({ value, onChange }: CourseBasicFormProps) {
  const [instructorModalOpen, setInstructorModalOpen] = useState(false);
  const [cohortModalOpen, setCohortModalOpen] = useState(false);

  const descriptionCount = value.description.length;
  const cohortLimitReached = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const cohortsThisYear = value.cohorts.filter(
      (cohort) => new Date(cohort.startDate).getFullYear() === currentYear,
    ).length;
    return cohortsThisYear >= MAX_COHORTS_PER_YEAR;
  }, [value.cohorts]);

  const update = (patch: Partial<CourseDraft>) => {
    onChange({ ...value, ...patch });
  };

  const handlePriceChange = (raw: string) => {
    update({ price: formatPriceDisplay(raw) });
  };

  const handleInstructorSave = (instructors: Instructor[]) => {
    update({ instructors });
  };

  const handleCohortSave = (cohort: Cohort) => {
    update({ cohorts: [...value.cohorts, cohort] });
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[640px] space-y-6">
        <FormField id="course-name" label="Course name">
          <Input
            id="course-name"
            value={value.name}
            onChange={(event) => update({ name: event.target.value })}
            placeholder="Enter course name"
            className="h-12 rounded-[12px]"
          />
        </FormField>

        <FormField id="course-description" label="Description">
          <div className="relative">
            <Textarea
              id="course-description"
              value={value.description}
              onChange={(event) =>
                update({
                  description: event.target.value.slice(
                    0,
                    COURSE_DESCRIPTION_MAX,
                  ),
                })
              }
              placeholder="What will this program be about?"
              className="min-h-[140px] rounded-[12px] resize-none pb-8"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 text-[12px] text-[#94A3B8]">
              {descriptionCount}/{COURSE_DESCRIPTION_MAX}
            </span>
          </div>
        </FormField>

        <FormField id="course-price" label="Price">
          <Input
            id="course-price"
            value={value.price}
            onChange={(event) => handlePriceChange(event.target.value)}
            placeholder="NGN 20,000"
            className="h-12 rounded-[12px]"
          />
        </FormField>

        <FormField id="course-capacity" label="Cohort capacity">
          <Input
            id="course-capacity"
            type="number"
            min={1}
            value={value.capacity}
            onChange={(event) =>
              update({ capacity: event.target.value.replace(/[^\d]/g, "") })
            }
            placeholder="60"
            className="h-12 rounded-[12px]"
          />
        </FormField>

        <div className="space-y-3">
          <AddItemLink
            label="Add instructor (Optional)"
            onClick={() => setInstructorModalOpen(true)}
          />
          {value.instructors.length > 0 && (
            <div className="space-y-2">
              {value.instructors.map((instructor) => (
                <InstructorRow
                  key={instructor.id}
                  instructor={instructor}
                  onRemove={() =>
                    update({
                      instructors: value.instructors.filter(
                        (item) => item.id !== instructor.id,
                      ),
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <AddItemLink
            label="Add cohort (Optional)"
            onClick={() => setCohortModalOpen(true)}
            disabled={cohortLimitReached}
          />
          <p className="text-[12px] text-[#94A3B8]">
            You can add a maximum of {MAX_COHORTS_PER_YEAR} cohorts in a
            calendar year
          </p>
          {value.cohorts.length > 0 && (
            <div className="space-y-2">
              {value.cohorts.map((cohort, index) => (
                <CohortRow
                  key={cohort.id}
                  cohort={cohort}
                  index={index}
                  onRemove={() =>
                    update({
                      cohorts: value.cohorts.filter(
                        (item) => item.id !== cohort.id,
                      ),
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddInstructorModal
        open={instructorModalOpen}
        onOpenChange={setInstructorModalOpen}
        selectedIds={value.instructors.map((instructor) => instructor.id)}
        onSave={handleInstructorSave}
      />

      <AddCohortModal
        open={cohortModalOpen}
        onOpenChange={setCohortModalOpen}
        existingCohorts={value.cohorts}
        onSave={handleCohortSave}
      />
    </>
  );
}
