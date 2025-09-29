import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { bentoPatterns, patternSets } from "./constants";
import { Entry } from "./types";

/**
 * Merge arbitrary class values into a single className string.
 *
 * This is a small helper that composes two libraries' behavior:
 * - `clsx(...)` to conditionally join class names (handles arrays, objects, falsy values)
 * - `twMerge(...)` to resolve Tailwind CSS class name conflicts (keeps the last conflicting utility)
 *
 * Example:
 *   cn('p-2', isActive && 'bg-blue-500', ['text-sm', 'font-medium'])
 *
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a date-like value to a Date representing the local date only (time set to local 00:00).
 *
 * This accepts either:
 * - an ISO date-only string in the form `YYYY-MM-DD` (recommended when you want to preserve the date only),
 * - or a full Date / date-parsable string.
 *
 * When an ISO `YYYY-MM-DD` string is provided we construct a Date using the local timezone
 * (via `new Date(year, monthIndex, day)`) to avoid timezone-shift issues that occur when
 * parsing `YYYY-MM-DD` with the Date constructor/Date.parse (which treats it as UTC in some engines).
 */
export function toLocalDateOnly(value: string | Date): Date {
  if (typeof value === "string") {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]) - 1;
      const d = Number(m[3]);
      return new Date(y, mo, d);
    }
  }
  const d = new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Create a simple key string from a Date using local date components.
 *
 * Note: the month and day are not zero-padded intentionally (e.g. `2025-8-3`).
 * If you need a zero-padded key (e.g. for lexicographic sorting), update this function accordingly.
 */
export function toKeyFromLocalDate(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Pick a bento layout pattern for an item given its index and the total number of items.
 *
 * The algorithm chooses a `patternSet` by computing `Math.floor(totalItems / 12) % patternSets.length`.
 * Then it selects the pattern index from that set using `index % pattern.length` and returns the
 * corresponding entry from `bentoPatterns`.
 */
export const getBentoPattern = (index: number, totalItems: number) => {
  const setIndex = Math.floor(totalItems / 12) % patternSets.length;
  const pattern = patternSets[setIndex];
  const patternIndex = pattern[index % pattern.length];
  return bentoPatterns[patternIndex];
};

/**
 * Return an appropriate Tailwind `line-clamp-{n}` utility class for a layout pattern string.
 *
 * The function checks for particular grid span combinations (e.g. `row-span-3`, `col-span-3`)
 * and maps them to a sensible clamp value to control how many lines of text to show.
 *
 * @param pattern - a string containing Tailwind grid classes for a single card (e.g. "col-span-2 row-span-3")
 * @returns a Tailwind `line-clamp-*` utility class
 */
export const getTextClamp = (pattern: string) => {
  if (pattern.includes("row-span-3")) return "line-clamp-5";
  if (pattern.includes("col-span-3") && pattern.includes("row-span-2"))
    return "line-clamp-4";
  if (pattern.includes("col-span-2") && pattern.includes("row-span-2"))
    return "line-clamp-3";
  if (pattern.includes("row-span-2")) return "line-clamp-4";
  if (pattern.includes("col-span-3")) return "line-clamp-3";
  return "line-clamp-1";
};

export const processCalendarEntries = (entries: Pick<Entry, "id" | "date">[]) => {
  const counts = new Map<string, number>();
  const map = new Map<string, string>();

  // Process each entry to count entries per day and map dates to entry IDs.
  entries.forEach((entry) => {
    const date = toLocalDateOnly(entry.date);
    const dateKey = toKeyFromLocalDate(date);
    const count = counts.get(dateKey) || 0;

    counts.set(dateKey, count + 1);

    // Store the first entry ID for a given day to enable navigation.
    if (!map.has(dateKey)) {
      map.set(dateKey, entry.id);
    }
  });

  const max = Math.max(0, ...Array.from(counts.values()));

  // Determines the intensity level (0-4) for a day based on its entry count relative to the max.
  const getIntensityLevel = (count: number): number => {
    if (count === 0 || max === 0) return 0;
    const ratio = count / max;
    if (ratio >= 0.75) return 4;
    if (ratio >= 0.5) return 3;
    if (ratio >= 0.25) return 2;
    return 1;
  };

  // Group dates by their calculated intensity level for styling.
  const intensity = {
    level1: [] as Date[],
    level2: [] as Date[],
    level3: [] as Date[],
    level4: [] as Date[],
  };

  counts.forEach((count, dateKey) => {
    const [yearStr, monthStr, dayStr] = dateKey.split("-");
    const date = new Date(
      parseInt(yearStr, 10),
      parseInt(monthStr, 10),
      parseInt(dayStr, 10),
    );
    const level = getIntensityLevel(count);

    if (level === 1) intensity.level1.push(date);
    else if (level === 2) intensity.level2.push(date);
    else if (level === 3) intensity.level3.push(date);
    else if (level === 4) intensity.level4.push(date);
  });

  return {
    entryCounts: counts,
    entryMap: map,
    maxCount: max,
    intensityDates: intensity,
  };
};