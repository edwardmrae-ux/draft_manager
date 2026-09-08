import type { Position } from "@/lib/types";

export type PositionColors = Record<Position, string>;

export const POSITIONS: Position[] = ["QB", "RB", "WR", "TE", "DST", "K"];

export const POSITION_COLOR_STORAGE_KEY = "draft-manager:position-colors";

/** Tailwind palette equivalents of the original tile classes. */
export const DEFAULT_POSITION_COLORS: PositionColors = {
  QB: "#dc2626",
  RB: "#f97316",
  WR: "#2563eb",
  TE: "#16a34a",
  DST: "#eab308",
  K: "#6b7280",
};

export function stripHash(hex: string): string {
  return hex.replace(/^#/, "");
}

export function normalizeHex(input: string): string | null {
  const trimmed = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return `#${trimmed.toLowerCase()}`;
  }
  return null;
}

export function parseStoredColors(raw: string | null): PositionColors {
  if (!raw) {
    return DEFAULT_POSITION_COLORS;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_POSITION_COLORS;
    }

    const result: PositionColors = { ...DEFAULT_POSITION_COLORS };
    const record = parsed as Record<string, unknown>;

    for (const position of POSITIONS) {
      const value = record[position];
      if (typeof value === "string") {
        const normalized = normalizeHex(value);
        if (normalized) {
          result[position] = normalized;
        }
      }
    }

    return result;
  } catch {
    return DEFAULT_POSITION_COLORS;
  }
}
