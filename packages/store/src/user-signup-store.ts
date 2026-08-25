import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SignupUser {
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
  setUser: (user: Partial<SignupUser>) => void;
  clearUser: () => void;
}

export const useSignupStore = create<SignupStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) =>
        set((state) => ({
          user: { ...state.user, ...user } as SignupUser,
        })),

      clearUser: () =>
        set({
          user: null,
        }),
    }),
    {
      name: "signup-storage",
    },
  ),
);
