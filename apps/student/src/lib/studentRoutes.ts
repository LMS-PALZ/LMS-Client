export { studentPath, STUDENT_BASE } from "@ssu/config/portal-paths";

export function getStudentPageTitle(pathname: string): string {
  const path = pathname.replace(/^\/student/, "") || "/";
  if (path === "/home" || path === "/") return "Home";
  if (path.startsWith("/calendar")) return "Calendar";
  if (path === "/classroom") return "My Classroom";
  if (path.startsWith("/classroom/")) return "My Classroom";
  if (path.startsWith("/assessments")) return "Assessments";
  if (path.startsWith("/support")) return "Support";
  return "Home";
}
