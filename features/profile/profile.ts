export interface ProfileFormValues {
  displayName: string;
  major: string;
  year: string;
}

export interface ProfileUpsertRow {
  user_id: string;
  display_name: string | null;
  major: string | null;
  year: number | null;
}

export const EMPTY_PROFILE: ProfileFormValues = {
  displayName: "",
  major: "",
  year: "",
};

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

export function normalizeProfileRow(value: unknown): ProfileFormValues {
  if (!value || typeof value !== "object") return EMPTY_PROFILE;

  const row = value as Record<string, unknown>;
  const year = typeof row.year === "number" && Number.isInteger(row.year)
    ? String(row.year)
    : "";

  return {
    displayName: cleanText(row.display_name),
    major: cleanText(row.major),
    year,
  };
}

export function buildProfileUpsertRow(
  userId: string,
  values: ProfileFormValues
): ProfileUpsertRow {
  const displayName = cleanText(values.displayName);
  const major = cleanText(values.major);
  const parsedYear = Number.parseInt(values.year.trim(), 10);
  const year =
    Number.isInteger(parsedYear) && parsedYear >= 1 && parsedYear <= 8
      ? parsedYear
      : null;

  return {
    user_id: userId,
    display_name: displayName || null,
    major: major || null,
    year,
  };
}
