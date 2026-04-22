export const sessionKey = ["session"] as const;

export const courseKeys = {
  all: ["courses"] as const,
  enrolled: () => [...courseKeys.all, "enrolled"] as const,
  detail: (id: string) => [...courseKeys.all, id] as const,
};

export const assignmentKeys = {
  all: ["assignments"] as const,
  list: () => [...assignmentKeys.all, "list"] as const,
  detail: (id: string) => [...assignmentKeys.all, id] as const,
};

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
};

export const adminKeys = {
  users: () => ["admin", "users"] as const,
  pendingTrainers: () => ["admin", "pending-trainers"] as const,
  user: (id: string) => ["admin", "user", id] as const,
};

export const sessionQueryKeys = {
  session: sessionKey,
};
