import { create } from "zustand";
import { persist } from "zustand/middleware";

interface forgotemailUser {
  forgotPasswordEmail: string;
}

interface ProfileStore {
  user: forgotemailUser | null;

  setUser: (user: forgotemailUser) => void;

  clearUser: () => void;
}

export const useForgetEmailStore = create<ProfileStore>()(
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
