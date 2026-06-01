export function getStudentPageTitle(pathname: string): string {
  if (pathname === "/home" || pathname === "/") return "Home";
  if (pathname.startsWith("/calendar")) return "Calendar";
  if (pathname === "/classroom") return "My Classroom";
  if (pathname.startsWith("/classroom/")) return "My Classroom";
  if (pathname.startsWith("/assessments")) return "Assessments";
  if (pathname.startsWith("/support")) return "Support";
  if (pathname.startsWith("/profile")) return "Profile";
  return "Home";
}
