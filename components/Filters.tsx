"use client";

import type { AvailabilityFilter, Position } from "@/lib/types";

const POSITIONS: Array<Position | "ALL"> = [
  "ALL",
  "QB",
  "RB",
  "WR",
  "TE",
  "DST",
  "K",
];

const AVAILABILITY: { value: AvailabilityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "selected", label: "Selected" },
  { value: "my_team", label: "My team" },
];

const inactiveButtonClass =
  "rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100";
const activeButtonClass =
  "rounded border border-emerald-700 bg-emerald-700 px-2.5 py-1.5 text-sm font-medium text-white";

function buttonClass(active: boolean) {
  return active ? activeButtonClass : inactiveButtonClass;
}

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
    <div className="flex flex-col gap-3">
      <label className="flex min-w-[10rem] max-w-sm flex-col gap-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Search
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Player name…"
          className="rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-sm font-normal normal-case tracking-normal text-zinc-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
        />
      </label>

      <div className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Position
        <div role="group" aria-label="Position" className="flex flex-wrap gap-1.5">
          {POSITIONS.map((p) => {
            const isActive = position === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={isActive}
                onClick={() => onPositionChange(p)}
                className={buttonClass(isActive)}
              >
                {p === "ALL" ? "All" : p}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Status
        <div role="group" aria-label="Status" className="flex flex-wrap gap-1.5">
          {AVAILABILITY.map((opt) => {
            const isActive = availability === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onAvailabilityChange(opt.value)}
                className={buttonClass(isActive)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
