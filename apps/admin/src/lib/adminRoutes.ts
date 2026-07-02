export function getAdminPageTitle(pathname: string): string {
  if (pathname === "/home" || pathname === "/") return "Home";
  if (pathname.startsWith("/students")) return "My Students";
  if (pathname === "/calendar") return "Calendar";
  if (pathname.startsWith("/courses")) return "Courses";
  if (pathname.startsWith("/programs")) return "Programs";
  if (pathname.startsWith("/classroom/")) return "My Classroom";
  if (pathname.startsWith("/assessment")) return "Assessment";
  if (pathname.startsWith("/auditlog")) return "Audit Log";
  if (pathname.startsWith("/staff")) return "Staff";
  if (pathname.startsWith("/transactions")) return "Transactions";
  if (pathname.startsWith("/certificates")) return "Certificates";
  if (pathname.startsWith("/profile")) return "Profile";
  return "Home";
}
