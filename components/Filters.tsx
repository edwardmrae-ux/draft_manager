"use client";

import type { AvailabilityFilter, Position } from "@/lib/types";

const POSITIONS: Array<Position | "ALL"> = [
  "ALL",
  "QB",
  "RB",
  "WR",
  "TE",
  "DEF",
  "K",
];

const AVAILABILITY: { value: AvailabilityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "selected", label: "Selected" },
  { value: "my_team", label: "My team" },
];

type FiltersProps = {
  position: Position | "ALL";
  availability: AvailabilityFilter;
  search: string;
  onPositionChange: (value: Position | "ALL") => void;
  onAvailabilityChange: (value: AvailabilityFilter) => void;
  onSearchChange: (value: string) => void;
};

export function Filters({
  position,
  availability,
  search,
  onPositionChange,
  onAvailabilityChange,
  onSearchChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Search
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Player name…"
          className="rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-sm font-normal normal-case tracking-normal text-zinc-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Position
        <select
          value={position}
          onChange={(e) => onPositionChange(e.target.value as Position | "ALL")}
          className="rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-sm font-normal normal-case tracking-normal text-zinc-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
        >
          {POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p === "ALL" ? "All" : p}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Status
        <select
          value={availability}
          onChange={(e) =>
            onAvailabilityChange(e.target.value as AvailabilityFilter)
          }
          className="rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-sm font-normal normal-case tracking-normal text-zinc-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
        >
          {AVAILABILITY.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
