"use client";

import { CustomSelect } from "@/components/ CustomSelect";
import { useBirthYears } from "@ssu/queries";
import { Skeleton } from "@ssu/ui";
import { useMemo } from "react";

interface AccountSetupStepOneProps {
  gender: string;
  setGender: (value: string) => void;

  employmentStatus: string;
  setEmploymentStatus: (value: string) => void;

  day: string;
  setDay: (value: string) => void;

  month: string;
  setMonth: (value: string) => void;

  year: string;
  setYear: (value: string) => void;
  onYearChange?: (value: string) => void;
  errors?: {
    dateOfBirth?: string;
    gender?: string;
    employmentStatus?: string;
  };
}

export function AccountSetupStepOne({
  gender,
  setGender,
  employmentStatus,
  setEmploymentStatus,
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
  onYearChange,
  errors,
}: AccountSetupStepOneProps) {
  const yearsQuery = useBirthYears();

  const yearOptions = useMemo(() => {
    const rows = yearsQuery.data ?? [];
    return rows.map((row) => row.label);
  }, [yearsQuery.data]);

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-3 block text-[15px] font-medium text-[#1D1D1D]">
          Date of birth
        </label>

        <div className="grid grid-cols-3 gap-3">
          <CustomSelect
            placeholder="Day"
            value={day}
            onChange={setDay}
            error={errors?.dateOfBirth}
            showErrorMessage={false}
            options={Array.from({ length: 31 }, (_, i) => `${i + 1}`)}
          />

          <CustomSelect
            placeholder="Month"
            value={month}
            onChange={setMonth}
            error={errors?.dateOfBirth}
            showErrorMessage={false}
            options={[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]}
          />

          {yearsQuery.isLoading ? (
            <Skeleton className="h-[52px] w-full rounded-[14px]" />
          ) : (
            <CustomSelect
              placeholder="Year"
              value={year}
              onChange={(value) => {
                if (onYearChange) {
                  onYearChange(value);
                  return;
                }
                setYear(value);
              }}
              error={errors?.dateOfBirth}
              showErrorMessage={false}
              options={
                yearOptions.length > 0 ? yearOptions : ["Unable to load years"]
              }
            />
          )}
        </div>

        {errors?.dateOfBirth && (
          <div className="mt-3 flex items-center gap-2 text-[14px] text-[#C62828]">
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#C62828] text-[12px] font-semibold">
              i
            </div>

            <span>{errors.dateOfBirth}</span>
          </div>
        )}
      </div>

      <div>
        <label className="mb-3 block text-[15px] font-medium text-[#1D1D1D]">
          Gender
        </label>

        <CustomSelect
          placeholder="Select your gender"
          value={gender}
          onChange={setGender}
          error={errors?.gender}
          options={["Male", "Female", "Non-binary"]}
        />
      </div>

      <div>
        <label className="mb-3 block text-[15px] font-medium text-[#1D1D1D]">
          Employment status
        </label>

        <CustomSelect
          placeholder="What is your employment status?"
          value={employmentStatus}
          onChange={setEmploymentStatus}
          error={errors?.employmentStatus}
          options={["Student", "Employed", "Not employed"]}
        />
      </div>
    </div>
  );
}
