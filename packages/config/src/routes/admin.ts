export const adminRoutes = {
  root: "/",
  login: "/login",
  forgetPassword: "/forgetpassword",
  resetPassword: "/resetpassword",
  setPassword: "/setpassword",
  users: "/users",
  trainersPending: "/trainers/pending",
  programs: "/programs",
  courses: "/courses",
  announcements: "/announcements",
} as const;

export type AdminRouteKey = keyof typeof adminRoutes;

export function adminRoute(
  key: AdminRouteKey,
  ...segments: (string | number)[]
): string {
  const base = adminRoutes[key];
  if (segments.length === 0) return base;
  const tail = segments.map(String).join("/");
  return `${base}/${tail}`;
}
