export const tutorRoutes = {
  root: "/",
  login: "/login",
  forgetPassword: "/forgetpassword",
  resetPassword: "/resetpassword",
  setPassword: "/setpassword",
  courses: "/courses",
  sessions: "/sessions",
  assignments: "/assignments",
  profile: "/profile",
} as const;

export type TutorRouteKey = keyof typeof tutorRoutes;

export function tutorRoute(
  key: TutorRouteKey,
  ...segments: (string | number)[]
): string {
  const base = tutorRoutes[key];
  if (segments.length === 0) return base;
  const tail = segments.map(String).join("/");
  return `${base}/${tail}`;
}
