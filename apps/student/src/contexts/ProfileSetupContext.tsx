"use client";

import {
  dismissProfileSetupPrompt,
  isProfileSetupDismissed,
  isStudentProfileComplete,
} from "@ssu/api";
import { useStudentProfile } from "@ssu/queries";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && isProfileSetupDismissed(),
  );
  const [forcedOpen, setForcedOpen] = useState(false);

  const profileComplete = isStudentProfileComplete(profileQuery.data);
  const isProfileLoading = profileQuery.isLoading;

  const showAutoPrompt =
    !isProfileLoading &&
    !profileQuery.isError &&
    !profileComplete &&
    !dismissed &&
    !isProfileSetupDismissed();

  const showModal = showAutoPrompt || (forcedOpen && !profileComplete);

  const handleClose = useCallback(() => {
    dismissProfileSetupPrompt();
    setDismissed(true);
    setForcedOpen(false);
  }, []);

  const openProfileSetup = useCallback(() => {
    if (profileComplete) return;
    setForcedOpen(true);
  }, [profileComplete]);

  const ensureProfileForAction = useCallback(() => {
    if (profileComplete || isProfileLoading) return true;
    openProfileSetup();
    return false;
  }, [profileComplete, isProfileLoading, openProfileSetup]);

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
      {showModal ? (
        <AccountSetupModal onClose={handleClose} onCompleted={handleClose} />
      ) : null}
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
