"use client";

import { useMemo, useState } from "react";
import { Filters } from "@/components/Filters";
import { PlayerTable } from "@/components/PlayerTable";
import { RosterPanel } from "@/components/RosterPanel";
import { buildRoster } from "@/lib/roster";
import type { AvailabilityFilter, Player, Position } from "@/lib/types";

type DraftBoardProps = {
  players: Player[];
};

export function DraftBoard({ players }: DraftBoardProps) {
  const [position, setPosition] = useState<Position | "ALL">("ALL");
  const [availability, setAvailability] =
    useState<AvailabilityFilter>("available");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const roster = useMemo(() => {
    const mine = players.filter((p) => p.my_team);
    return buildRoster(mine).slots;
  }, [players]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return players.filter((p) => {
      if (position !== "ALL" && p.position !== position) return false;

      if (availability === "available" && p.selected) return false;
      if (availability === "selected" && !p.selected) return false;
      if (availability === "my_team" && !p.my_team) return false;

      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [players, position, availability, search]);

  const availableCount = players.filter((p) => !p.selected).length;
  const selectedCount = players.filter((p) => p.selected && !p.my_team).length;
  const myTeamCount = players.filter((p) => p.my_team).length;

  return (
    <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              Draft board
            </h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              {availableCount} available · {selectedCount} taken · {myTeamCount}{" "}
              on my team · {filtered.length} shown
            </p>
          </div>
        </div>

        <Filters
          position={position}
          availability={availability}
          search={search}
          onPositionChange={setPosition}
          onAvailabilityChange={setAvailability}
          onSearchChange={setSearch}
        />

        {error ? (
          <div
            role="alert"
            className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            {error}
          </div>
        ) : null}

        <PlayerTable players={filtered} onError={setError} />
      </div>

      <div className="w-full shrink-0 lg:sticky lg:top-4 lg:w-72 xl:w-80">
        <RosterPanel slots={roster} />
      </div>
    </div>
  );
}
