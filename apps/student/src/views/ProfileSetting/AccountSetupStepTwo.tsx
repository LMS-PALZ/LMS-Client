"use client";

import { Input, Skeleton } from "@ssu/ui";
import { useNigeriaStates } from "@ssu/queries";
import { useMemo } from "react";

import { CustomSelect } from "@ssu/ui";

interface AccountSetupStepTwoProps {
  address: string;
  setAddress: (value: string) => void;
  stateOfResidence: string;
  setStateOfResidence: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  errors?: {
    address?: string;
    stateOfResidence?: string;
    city?: string;
  };
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className="mt-3 flex items-center gap-2 text-[14px] text-[#C62828]">
      <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#C62828] text-[12px] font-semibold">
        i
      </div>

      <span>{message}</span>
    </div>
  );
}

export function AccountSetupStepTwo({
  address,
  setAddress,
  stateOfResidence,
  setStateOfResidence,
  city,
  setCity,
  errors,
}: AccountSetupStepTwoProps) {
  const statesQuery = useNigeriaStates();

  const stateOptions = useMemo(() => {
    const rows = statesQuery.data ?? [];
    return rows.map((row) => row.label);
  }, [statesQuery.data]);

  return (
    <div className="space-y-7">
      <div>
        <label className="mb-3 block text-[15px] font-medium text-[#1D1D1D]">
          Address
        </label>

        <Input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Enter apartment, street, etc"
          error={!!errors?.address}
          className="h-[52px] rounded-[14px] border px-4 text-[15px] text-[#1D1D1D] placeholder:text-[#AAB4C3]"
        />

        <ErrorMessage message={errors?.address} />
      </div>

      <div>
        <label className="mb-3 block text-[15px] font-medium text-[#1D1D1D]">
          State
        </label>

        {statesQuery.isLoading ? (
          <Skeleton className="h-[52px] w-full rounded-[14px]" />
        ) : (
          <CustomSelect
            placeholder="Select state of residence"
            options={
              stateOptions.length > 0 ? stateOptions : ["Unable to load states"]
            }
            value={stateOfResidence}
            onChange={setStateOfResidence}
            error={errors?.stateOfResidence}
          />
        )}
      </div>

      <div>
        <label className="mb-3 block text-[15px] font-medium text-[#1D1D1D]">
          City
        </label>

        <Input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Enter your city"
          error={!!errors?.city}
          className="h-[52px] rounded-[14px] border px-4 text-[15px] text-[#1D1D1D] placeholder:text-[#AAB4C3]"
        />

        <ErrorMessage message={errors?.city} />
      </div>
    </div>
  );
}
