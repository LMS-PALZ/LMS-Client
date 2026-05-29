const ADMIN_BASE = "/admin";
const TUTOR_BASE = "/tutor";
const STUDENT_BASE = "/student";

function isUnifiedDeploy(): boolean {
  return process.env.NEXT_PUBLIC_PORTAL_MODE === "unified";
}

function withPortalBase(base: string, path: string): string {
  const normalized =
    path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (isUnifiedDeploy()) {
    return `${base}${normalized}`;
  }
  return normalized === "" ? "/" : normalized;
}

export function adminPath(path: string = ""): string {
  return withPortalBase(ADMIN_BASE, path);
}

export function tutorPath(path: string = ""): string {
  return withPortalBase(TUTOR_BASE, path);
}

export function studentPath(path: string = ""): string {
  if (path === "" || path === "/signup") {
    return withPortalBase(STUDENT_BASE, "/signup");
  }
  return withPortalBase(STUDENT_BASE, path);
}

export { ADMIN_BASE, TUTOR_BASE, STUDENT_BASE };
