/**
 * Staff portal role rules:
 * - tutor: teaching only (assigned courses, assessments, grading)
 * - admin: operations only (courses, students, staff, billing) — not teaching
 * - super_admin: both admin and tutor capabilities
 */

export type StaffPortalRoleName = "super_admin" | "admin" | "tutor";

export function normalizeStaffPortalRole(
  role: string | undefined | null,
): StaffPortalRoleName {
  const normalized = String(role ?? "admin")
    .toLowerCase()
    .trim();

  if (normalized === "super_admin" || normalized === "superadmin") {
    return "super_admin";
  }

  if (
    normalized === "tutor" ||
    normalized === "trainer" ||
    normalized === "instructor"
  ) {
    return "tutor";
  }

  return "admin";
}

export function isSuperAdminRole(role: string | undefined | null): boolean {
  return normalizeStaffPortalRole(role) === "super_admin";
}

/** Pure tutor/trainer — does not include super_admin. */
export function isTutorOnlyRole(role: string | undefined | null): boolean {
  return normalizeStaffPortalRole(role) === "tutor";
}

/** Pure admin — does not include super_admin. */
export function isAdminOnlyRole(role: string | undefined | null): boolean {
  return normalizeStaffPortalRole(role) === "admin";
}

/** Admin or super_admin (operational staff). */
export function isAdminStaffRole(role: string | undefined | null): boolean {
  const normalized = normalizeStaffPortalRole(role);
  return normalized === "admin" || normalized === "super_admin";
}

/**
 * Can perform teaching work (grade, create/manage assessments).
 * Tutors and super admins only — plain admins cannot.
 */
export function canPerformTutorWork(role: string | undefined | null): boolean {
  const normalized = normalizeStaffPortalRole(role);
  return normalized === "tutor" || normalized === "super_admin";
}

/**
 * Can perform admin operations (create courses, staff, students, billing).
 * Admins and super admins only — tutors cannot.
 */
export function canPerformAdminWork(role: string | undefined | null): boolean {
  return isAdminStaffRole(role);
}

/**
 * Scope program lists to courses assigned to this user.
 * Only pure tutors are scoped; super admins see everything like admins.
 */
export function shouldScopeProgramsToTutor(
  role: string | undefined | null,
): boolean {
  return isTutorOnlyRole(role);
}
