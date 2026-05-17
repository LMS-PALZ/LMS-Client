import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
};

type SignupStore = {
  user: User | null;

  setUser: (user: User) => void;

  clearUser: () => void;
};

export const useSignupStore = create<SignupStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "signup-storage",
    },
  ),
);
