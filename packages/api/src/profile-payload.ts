export type ProfileDob = {
  day: string;
  month: string;
  year: number;
};

const MONTH_NAME_TO_NUMBER: Record<string, string> = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

function padTwoDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const n = Number.parseInt(digits, 10);
  if (!Number.isFinite(n)) return "";
  return String(n).padStart(2, "0");
}

/** API expects dob.month as "01"–"12", dob.day as "01"–"31", dob.year as number. */
export function formatProfileDob(
  day: string,
  month: string,
  year: number | string,
): ProfileDob {
  const namedMonth = MONTH_NAME_TO_NUMBER[month.trim()];
  const monthDigits = namedMonth ?? padTwoDigits(month);
  const dayDigits = padTwoDigits(day);
  const yearNumber =
    typeof year === "number" ? year : Number.parseInt(String(year), 10);

  if (!dayDigits || !monthDigits || !Number.isFinite(yearNumber)) {
    throw new Error("Please enter a valid date of birth.");
  }

  return {
    day: dayDigits,
    month: monthDigits,
    year: yearNumber,
  };
}

const GENDER_TO_API: Record<string, string> = {
  Male: "male",
  Female: "female",
  "Non-binary": "non_binary",
};

const EMPLOYMENT_TO_API: Record<string, string> = {
  Student: "student",
  Employed: "employed",
  "Not employed": "unemployed",
};

export function formatProfileGender(gender: string): string {
  const trimmed = gender.trim();
  return GENDER_TO_API[trimmed] ?? trimmed.toLowerCase().replace(/\s+/g, "_");
}

export function formatProfileEmploymentStatus(status: string): string {
  const trimmed = status.trim();
  return (
    EMPLOYMENT_TO_API[trimmed] ?? trimmed.toLowerCase().replace(/\s+/g, "_")
  );
}

export function appendProfileFormData(
  formData: FormData,
  data: {
    dob: ProfileDob;
    gender: string;
    employment_status: string;
    address: string;
    state: string;
    city: string;
    photo: File;
  },
): void {
  formData.append("dob[day]", data.dob.day);
  formData.append("dob[month]", data.dob.month);
  formData.append("dob[year]", String(data.dob.year));
  formData.append("gender", data.gender);
  formData.append("employment_status", data.employment_status);
  formData.append("address", data.address);
  formData.append("state", data.state);
  formData.append("city", data.city);
  formData.append("photo", data.photo);
}
