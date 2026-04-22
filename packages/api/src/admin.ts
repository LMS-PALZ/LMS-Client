export interface AdminUserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "trainer" | "admin";
  status: "active" | "pending" | "suspended";
  joinedAt: string;
}

export interface TrainerApprovalRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: string;
  appliedAt: string;
}

const users: AdminUserRow[] = [
  {
    id: "1",
    firstName: "Sam",
    lastName: "Student",
    email: "student@skillscaleup.dev",
    role: "student",
    status: "active",
    joinedAt: new Date().toISOString(),
  },
];

const pending: TrainerApprovalRow[] = [
  {
    id: "tp1",
    firstName: "Pat",
    lastName: "Pending",
    email: "pending@skillscaleup.dev",
    skills: "Design, Facilitation",
    appliedAt: new Date().toISOString(),
  },
];

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const adminApi = {
  listUsers: async (): Promise<AdminUserRow[]> => delay(users),
  listPendingTrainers: async (): Promise<TrainerApprovalRow[]> =>
    delay(pending),
  getUser: async (id: string): Promise<AdminUserRow | null> => {
    const u = users.find((x) => x.id === id) ?? null;
    return delay(u);
  },
};
