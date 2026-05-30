export const studentRoutes = {
  root: "/",
  signup: "/signup",
  login: "/login",
  home: "/home",
  confirmCode: "/confirmcode",
  paymentDetail: "/paymentdetail",
  verifyPayment: "/verifypayment",
  welcome: "/welcome",
  setPassword: "/setpassword",
  forgetPassword: "/forgetpassword",
  resetPassword: "/resetpassword",
  success: "/success",
  profile: "/profile",
  calendar: "/calendar",
  classroom: "/classroom",
  assessments: "/assessments",
  support: "/support",
  schedule: "/schedule",
  courses: "/courses",
} as const;

export type StudentRouteKey = keyof typeof studentRoutes;

export function studentRoute(
  key: StudentRouteKey,
  ...segments: (string | number)[]
): string {
  const base = studentRoutes[key];
  if (segments.length === 0) return base;
  const tail = segments.map(String).join("/");
  return `${base}/${tail}`;
}
