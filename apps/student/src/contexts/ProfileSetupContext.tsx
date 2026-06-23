"use client";

import { isStudentProfileComplete } from "@ssu/api";
import { useProfileStore } from "@ssu/store";
import { useStudentProfile } from "@ssu/queries";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { isProfileSetupBypassed } from "@/lib/profile-setup-bypass";
import { AccountSetupModal } from "@/views/ProfileSetting/AccountSetupModal";

type ProfileSetupContextValue = {
  profileComplete: boolean;
  isProfileLoading: boolean;
  openProfileSetup: () => void;
  ensureProfileForAction: () => boolean;
};

const ProfileSetupContext = createContext<ProfileSetupContextValue | null>(
  null,
);

export function ProfileSetupProvider({ children }: { children: ReactNode }) {
  const profileQuery = useStudentProfile();
  const profile = useProfileStore((state) => state.user);

  const bypassProfileSetup = isProfileSetupBypassed();

  const profileComplete =
    bypassProfileSetup || isStudentProfileComplete(profileQuery.data);

  const isProfileLoading = profileQuery.isLoading;

  const showModal = profile?.profileUploaded === false;

  const openProfileSetup = useCallback(() => {
    if (profileComplete) return;
  }, [profileComplete]);

  const ensureProfileForAction = useCallback(() => {
    if (bypassProfileSetup || profileComplete || isProfileLoading) {
      return true;
    }

    openProfileSetup();

    return false;
  }, [bypassProfileSetup, profileComplete, isProfileLoading, openProfileSetup]);

  const value = useMemo(
    () => ({
      profileComplete,
      isProfileLoading,
      openProfileSetup,
      ensureProfileForAction,
    }),
    [
      profileComplete,
      isProfileLoading,
      openProfileSetup,
      ensureProfileForAction,
    ],
  );

  return (
    <ProfileSetupContext.Provider value={value}>
      {children}

      {showModal && <AccountSetupModal />}
    </ProfileSetupContext.Provider>
  );
}

export function useProfileSetup() {
  const context = useContext(ProfileSetupContext);

  if (!context) {
    throw new Error("useProfileSetup must be used within ProfileSetupProvider");
  }

  return context;
}
