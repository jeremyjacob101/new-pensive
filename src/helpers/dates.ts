export function formatDisplayDate(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function formatShortDisplayDate(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export function formatMonthYearLabel(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function formatMonthLabel(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(parsed);
}

export function formatYearLabel(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
  }).format(parsed);
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMonthFromIsoDate(value: string): string {
  const match = value.trim().match(/^(\d{4})-(\d{2})-\d{2}$/);
  if (!match) return "";
  return `${match[1]}-${match[2]}`;
}

export function formatMonthValue(value: string): string {
  const match = value.trim().match(/^(\d{4})-(\d{2})$/);
  if (!match) return value;
  return formatMonthYearLabel(`${match[1]}-${match[2]}-01`) || value;
}

export function normalizeMonthYears(values: string[]) {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].sort((
    a,
    b,
  ) => a.localeCompare(b));
}

export function parseMonthYears(raw: string | null | undefined, date: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw ?? "[]");
  } catch {
    parsed = [];
  }
  if (!Array.isArray(parsed)) return [];
  const cleaned = [...new Set(parsed.map((value) => String(value).trim()))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  if (cleaned.length > 0) return cleaned;
  const fallback = getMonthFromIsoDate(date);
  return fallback ? [fallback] : [];
}

export function formatOrdinalDay(dayOfMonth: number): string {
  const remainder100 = dayOfMonth % 100;
  if (remainder100 >= 11 && remainder100 <= 13) return `${dayOfMonth}th`;
  const remainder10 = dayOfMonth % 10;
  if (remainder10 === 1) return `${dayOfMonth}st`;
  if (remainder10 === 2) return `${dayOfMonth}nd`;
  if (remainder10 === 3) return `${dayOfMonth}rd`;
  return `${dayOfMonth}th`;
}
