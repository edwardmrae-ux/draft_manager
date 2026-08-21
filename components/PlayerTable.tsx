"use client";

import { useTransition } from "react";
import {
  clearPlayer,
  markMyTeam,
  markSelected,
} from "@/app/actions";
import type { Player, Position } from "@/lib/types";

type PlayerTableProps = {
  players: Player[];
  onError: (message: string | null) => void;
};

const POSITION_TILE_CLASS: Record<Position, string> = {
  QB: "bg-red-600",
  WR: "bg-blue-600",
  RB: "bg-orange-500",
  TE: "bg-green-600",
  K: "bg-gray-500",
  DEF: "bg-yellow-500",
};

function PositionTile({ position }: { position: Position }) {
  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 text-xs font-semibold text-white ${POSITION_TILE_CLASS[position]}`}
    >
      {position}
    </span>
  );
}

function StatusChip({ player }: { player: Player }) {
  if (player.my_team) {
    return (
      <span className="inline-flex rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-800">
        My team
      </span>
    );
  }
  if (player.selected) {
    return (
      <span className="inline-flex rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
        Selected
      </span>
    );
  }
  return (
    <span className="inline-flex rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600">
      Available
    </span>
  );
}

export function PlayerTable({ players, onError }: PlayerTableProps) {
  const [pending, startTransition] = useTransition();

  function run(
    action: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>,
    id: string,
  ) {
    onError(null);
    startTransition(async () => {
      const result = await action(id);
      if (!result.ok) {
        onError(result.error);
      }
    });
  }

  if (players.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-12 text-center text-sm text-zinc-500">
        No players match these filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
            <tr>
              <th className="px-3 py-2.5">Rank</th>
              <th className="px-3 py-2.5">Name</th>
              <th className="px-3 py-2.5">Team</th>
              <th className="px-3 py-2.5">Pos</th>
              <th className="px-3 py-2.5">Pos rk</th>
              <th className="px-3 py-2.5">Bye</th>
              <th className="px-3 py-2.5">SOS</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {players.map((player) => {
              const isTaken = player.selected && !player.my_team;
              const isMine = player.my_team;

              return (
                <tr
                  key={player.id}
                  className={
                    isMine
                      ? "bg-emerald-50/60"
                      : isTaken
                        ? "bg-zinc-50 text-zinc-500"
                        : "hover:bg-zinc-50/80"
                  }
                >
                  <td className="px-3 py-2 tabular-nums text-zinc-600">
                    {player.overall_rank}
                  </td>
                  <td className="px-3 py-2 font-medium text-zinc-900">
                    {player.name}
                  </td>
                  <td className="px-3 py-2 text-zinc-600">{player.team}</td>
                  <td className="px-3 py-2">
                    <PositionTile position={player.position} />
                  </td>
                  <td className="px-3 py-2 tabular-nums text-zinc-600">
                    {player.position_rank}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-zinc-600">
                    {player.bye_week ?? "—"}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-zinc-600">
                    {player.strength_of_schedule ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    <StatusChip player={player} />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        disabled={pending || isTaken || isMine}
                        onClick={() => run(markSelected, player.id)}
                        className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 enabled:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Select
                      </button>
                      <button
                        type="button"
                        disabled={pending || isMine}
                        onClick={() => run(markMyTeam, player.id)}
                        className="rounded border border-emerald-700 bg-emerald-700 px-2 py-1 text-xs font-medium text-white enabled:hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        My team
                      </button>
                      <button
                        type="button"
                        disabled={pending || (!player.selected && !player.my_team)}
                        onClick={() => run(clearPlayer, player.id)}
                        className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 enabled:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Clear
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
