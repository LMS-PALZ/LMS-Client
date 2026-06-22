import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileUser {
  id: string;
  email: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  program?: string;
  profileUploaded?: boolean;
}

interface ProfileStore {
  user: ProfileUser | null;

  setUser: (user: ProfileUser) => void;

  clearUser: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) =>
        set({
          user,
        }),

      clearUser: () =>
        set({
          user: null,
        }),
    }),
    {
      name: "Profile-storage",
    },
  ),
);
