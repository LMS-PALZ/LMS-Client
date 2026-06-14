export function getTutorPageTitle(pathname: string): string {
  if (pathname === "/home" || pathname === "/") return "Home";
  if (pathname.startsWith("/students")) return "My Students";
  if (pathname === "/calendar") return "Calendar";
  if (pathname.startsWith("/programs")) return "My Programs";
  if (pathname.startsWith("/classroom/")) return "My Classroom";
  if (pathname.startsWith("/assessment")) return "Assessment";
  if (pathname.startsWith("/auditlog")) return "Audit Log";
  if (pathname.startsWith("/profile")) return "Profile";
  return "Home";
}
