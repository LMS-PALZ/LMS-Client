"use client";

import {
  accountSetupStepOneSchema,
  accountSetupStepThreeSchema,
  accountSetupStepTwoSchema,
  type AccountSetupStepOneValues,
  type AccountSetupStepThreeValues,
  type AccountSetupStepTwoValues,
} from "@ssu/schema";
import { motion } from "framer-motion";
import { useCreateProfileMutation } from "@ssu/queries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertBanner, Spinner } from "@ssu/ui";

import { AccountSetupProgress } from "@/views/ProfileSetting/AccountSetupProgress";
import { AccountSetupStepOne } from "@/views/ProfileSetting/AccountSetupStepOne";
import { AccountSetupStepThree } from "@/views/ProfileSetting/AccountSetupStepThree";
import { AccountSetupStepTwo } from "@/views/ProfileSetting/AccountSetupStepTwo";

type StepOneErrorKey = keyof AccountSetupStepOneValues | "dateOfBirth";

function mapFieldErrors<T extends string>(
  fieldErrors: Partial<Record<T, string[] | undefined>>,
): Partial<Record<T, string>> {
  const nextErrors: Partial<Record<T, string>> = {};

  for (const [key, value] of Object.entries(fieldErrors)) {
    if (Array.isArray(value) && value[0]) {
      nextErrors[key as T] = value[0];
    }
  }

  return nextErrors;
}

export function AccountSetupModal() {
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const [gender, setGender] = useState("");

  const [employmentStatus, setEmploymentStatus] = useState("");

  const [day, setDay] = useState("");

  const [month, setMonth] = useState("");

  const [year, setYear] = useState("");

  const [address, setAddress] = useState("");
  const [stateOfResidence, setStateOfResidence] = useState("");
  const [city, setCity] = useState("");

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const [stepOneErrors, setStepOneErrors] = useState<
    Partial<Record<StepOneErrorKey, string>>
  >({});
  const [stepTwoErrors, setStepTwoErrors] = useState<
    Partial<Record<keyof AccountSetupStepTwoValues, string>>
  >({});
  const [stepThreeErrors, setStepThreeErrors] = useState<
    Partial<Record<keyof AccountSetupStepThreeValues, string>>
  >({});

  if (!isVisible) {
    return null;
  }

  const createProfile = useCreateProfileMutation();
  const [banner, setBanner] = useState<{
    variant: "error" | "success";
    message: string;
  } | null>(null);

  const validateStepOne = () => {
    const result = accountSetupStepOneSchema.safeParse({
      day,
      month,
      year,
      gender,
      employmentStatus,
    });

    if (!result.success) {
      setStepOneErrors(mapFieldErrors(result.error.flatten().fieldErrors));
      return false;
    }

    setStepOneErrors({});
    return true;
  };

  const validateStepTwo = () => {
    const result = accountSetupStepTwoSchema.safeParse({
      address,
      stateOfResidence,
      city,
    });

    if (!result.success) {
      setStepTwoErrors(mapFieldErrors(result.error.flatten().fieldErrors));
      return false;
    }

    setStepTwoErrors({});
    return true;
  };

  const validateStepThree = () => {
    const result = accountSetupStepThreeSchema.safeParse({
      profilePhoto,
    });

    if (!result.success) {
      setStepThreeErrors(mapFieldErrors(result.error.flatten().fieldErrors));
      return false;
    }

    setStepThreeErrors({});
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStepOne()) {
      setStep(2);
    }

    if (step === 2 && validateStepTwo()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleFinish = async () => {
    if (!validateStepThree()) return;

    if (!profilePhoto) return;

    setBanner(null);

    try {
      await createProfile.mutateAsync({
        day,
        month,
        year: Number(year),
        gender,
        employment_status: employmentStatus,
        address,
        state: stateOfResidence,
        city,
        photo: profilePhoto,
      });

      setBanner({
        variant: "success",
        message: "Profile created successfully!",
      });

      setTimeout(() => {
        setIsVisible(false);
        router.replace("/home");
      }, 2000);
    } catch (error: any) {
      setBanner({
        variant: "error",
        message:
          error?.message || "Failed to create profile. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto bg-black/35 px-4 py-6">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="w-full max-w-[490px] transform-gpu rounded-[32px] bg-white px-6 py-8 md:px-8"
      >
        {/* TITLE */}
        <div className="mb-8 text-center">
          <h2 className="text-[20px] font-semibold leading-tight text-[#1D1D1D] md:text-[24px]">
            Welcome, Chiroma!
          </h2>

          <p className="mt-1 text-[20px] font-semibold leading-tight text-[#1D1D1D] md:text-[24px]">
            Let’s Complete Your Profile
          </p>
        </div>

        {banner && (
          <div className="mt-4">
            <AlertBanner variant={banner.variant}>{banner.message}</AlertBanner>
          </div>
        )}

        {/* STEP */}
        {step === 1 && (
          <AccountSetupStepOne
            gender={gender}
            setGender={(value) => {
              setGender(value);
              setStepOneErrors((prev) => ({
                ...prev,
                gender: undefined,
              }));
            }}
            employmentStatus={employmentStatus}
            setEmploymentStatus={(value) => {
              setEmploymentStatus(value);
              setStepOneErrors((prev) => ({
                ...prev,
                employmentStatus: undefined,
              }));
            }}
            day={day}
            setDay={(value) => {
              setDay(value);
              setStepOneErrors((prev) => ({
                ...prev,
                dateOfBirth: undefined,
              }));
            }}
            month={month}
            setMonth={(value) => {
              setMonth(value);
              setStepOneErrors((prev) => ({
                ...prev,
                dateOfBirth: undefined,
              }));
            }}
            year={year}
            setYear={(value) => {
              setYear(value);
              setStepOneErrors((prev) => ({
                ...prev,
                dateOfBirth: undefined,
              }));
            }}
            errors={stepOneErrors}
          />
        )}

        {step === 2 && (
          <AccountSetupStepTwo
            address={address}
            setAddress={(value) => {
              setAddress(value);
              setStepTwoErrors((prev) => ({
                ...prev,
                address: undefined,
              }));
            }}
            stateOfResidence={stateOfResidence}
            setStateOfResidence={(value) => {
              setStateOfResidence(value);
              setStepTwoErrors((prev) => ({
                ...prev,
                stateOfResidence: undefined,
              }));
            }}
            city={city}
            setCity={(value) => {
              setCity(value);
              setStepTwoErrors((prev) => ({
                ...prev,
                city: undefined,
              }));
            }}
            errors={stepTwoErrors}
          />
        )}

        {step === 3 && (
          <AccountSetupStepThree
            profilePhoto={profilePhoto}
            setProfilePhoto={(file) => {
              setProfilePhoto(file);
              setStepThreeErrors({});
            }}
            error={stepThreeErrors.profilePhoto}
          />
        )}

        {/* FOOTER */}
        <div className="mt-14 flex items-center justify-between">
          <AccountSetupProgress step={step} />

          <div className="flex items-center gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="text-[15px] font-medium text-[#4E845F] transition hover:opacity-80"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex h-[42px] items-center justify-center rounded-full bg-[#4E845F] px-7 text-[15px] font-medium text-white transition hover:bg-[#3D6E4D]"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={!profilePhoto || createProfile.isPending}
                className={`flex h-[42px] items-center justify-center rounded-full px-7 text-[15px] font-medium text-white transition ${
                  profilePhoto && !createProfile.isPending
                    ? "bg-[#4E845F] hover:bg-[#3D6E4D]"
                    : "cursor-not-allowed bg-[#D8DEE8] text-[#9AA5B1]"
                }`}
              >
                {createProfile.isPending ? (
                  <Spinner className="h-5 w-5 animate-spin" />
                ) : (
                  "Finish"
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
