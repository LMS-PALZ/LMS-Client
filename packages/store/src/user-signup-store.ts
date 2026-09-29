import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SignupUser {
  id: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  program?: string;
  program_title?: string;
  programId?: string;
  programSlug?: string;
}

interface SignupStore {
  user: SignupUser | null;
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setUser: (user: Partial<SignupUser>) => void;
  replaceUser: (user: SignupUser) => void;
  clearUser: () => void;
}

export const useSignupStore = create<SignupStore>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      setUser: (user) =>
        set((state) => {
          if (!state.user) {
            const hasIdentity = Boolean(
              user.email ||
              user.first_name ||
              user.last_name ||
              user.phone_number,
            );
            if (!hasIdentity) return state;
          }

          const next = {
            ...(state.user ?? { id: "", email: "", role: "student" }),
            ...user,
          } as SignupUser;

          // Never let an explicit undefined overwrite a known identity field.
          (
            [
              "first_name",
              "last_name",
              "email",
              "phone_number",
              "program",
              "program_title",
            ] as const
          ).forEach((key) => {
            if (user[key] === undefined && state.user?.[key]) {
              next[key] = state.user[key];
            }
          });

          return { user: next };
        }),

      replaceUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "signup-storage",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
