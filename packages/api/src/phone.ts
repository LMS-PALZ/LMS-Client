export function normalizePhoneNumberForApi(phone: string): string {
  const trimmed = phone.trim().replace(/\s+/g, "");
  const digits = trimmed.replace(/\D/g, "");

  if (digits.startsWith("234") && digits.length >= 13) {
    return `0${digits.slice(3, 13)}`;
  }

  if (trimmed.startsWith("+234")) {
    return `0${digits.slice(3, 13)}`;
  }

  return trimmed;
}
