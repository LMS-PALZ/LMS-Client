import type { AdminProgram, CreateProgramPayload, Trainers } from "@ssu/types";
import type { Course, CourseDraft, CourseStatus, Instructor } from "../types";
import { parseCapacityValue, parsePriceAmount } from "./course-utils";

export function splitPersonName(name: string): {
  firstName: string;
  lastName: string;
} {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

export function mapStaffToInstructor(
  staff: Trainers & { _id?: string },
): Instructor {
  const { firstName, lastName } = splitPersonName(staff.name);
  const staffId = readStaffId(staff);
  return {
    id: staffId,
    firstName,
    lastName,
    email: staff.email ?? "",
  };
}

function readStaffId(staff: Trainers & { _id?: string }): string {
  const id = typeof staff.id === "string" ? staff.id.trim() : "";
  if (id) return id;
  const legacyId = typeof staff._id === "string" ? staff._id.trim() : "";
  return legacyId;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function mapProgramToCourse(program: AdminProgram): Course {
  const cohorts =
    program.cohortName && program.cohortStartDate && program.cohortEndDate
      ? [
          {
            id: program.cohortCode || `${program.id}-cohort`,
            name: program.cohortName,
            startDate: program.cohortStartDate,
            endDate: program.cohortEndDate,
          },
        ]
      : [];

  return {
    id: program.id,
    name: program.title,
    description: program.description,
    price: `${program.priceCurrency} ${program.priceAmount.toLocaleString("en-NG")}`,
    status: (program.status as CourseStatus) || "draft",
    instructors: program.assignedTutorIds.map((id) => ({
      id,
      firstName: "Assigned",
      lastName: "tutor",
      email: "",
    })),
    cohorts,
    createdAt: program.createdAt,
    updatedAt: program.updatedAt,
  };
}

export function mapDraftToCreatePayload(
  draft: CourseDraft,
  status: CourseStatus,
): CreateProgramPayload {
  const firstCohort = draft.cohorts[0];
  const priceAmount = parsePriceAmount(draft.price);
  const capacity = parseCapacityValue(draft.capacity);

  return {
    title: draft.name.trim(),
    description: draft.description.trim(),
    category: "tech",
    priceAmount,
    priceCurrency: "NGN",
    capacity,
    status,
    ...(firstCohort
      ? {
          cohortName: firstCohort.name,
          cohortCode:
            slugify(firstCohort.name) ||
            `cohort-${new Date(firstCohort.startDate).getFullYear()}`,
          cohortStartDate: firstCohort.startDate,
          cohortEndDate: firstCohort.endDate,
        }
      : {}),
  };
}
