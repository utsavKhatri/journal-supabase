import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { bentoPatterns, patternSets } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toLocalDateOnly(value: string | Date): Date {
  // If you store dates as 'YYYY-MM-DD' or an ISO string, this keeps the local calendar day correct.
  if (typeof value === "string") {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]) - 1; // 0-based
      const d = Number(m[3]);
      return new Date(y, mo, d);
    }
  }
  const d = new Date(value);
  // Strip time to local midnight
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function toKeyFromLocalDate(d: Date) {
  // Keep month 0-based in the key to match new Date(y, m, d) usage below
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export const getBentoPattern = (index: number, totalItems: number) => {
  const setIndex = Math.floor(totalItems / 12) % patternSets.length;
  const pattern = patternSets[setIndex];
  const patternIndex = pattern[index % pattern.length];
  return bentoPatterns[patternIndex];
};

export const getTextClamp = (pattern: string) => {
  if (pattern.includes("row-span-3")) return "line-clamp-10";
  if (pattern.includes("col-span-3") && pattern.includes("row-span-2"))
    return "line-clamp-8";
  if (pattern.includes("col-span-2") && pattern.includes("row-span-2"))
    return "line-clamp-6";
  if (pattern.includes("row-span-2")) return "line-clamp-5";
  if (pattern.includes("col-span-3")) return "line-clamp-4";
  if (pattern.includes("col-span-2")) return "line-clamp-3";
  return "line-clamp-2";
};
