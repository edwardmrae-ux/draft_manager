"use client";

import { BYE_WEEKS, playersByByeWeek } from "@/lib/byeWeeks";
import type { Player } from "@/lib/types";

type ByeWeekHeatmapProps = {
  players: Player[];
};

function cellClass(count: number): string {
  if (count >= 4) return "bg-red-500 text-white";
  if (count === 3) return "bg-orange-400 text-zinc-900";
  if (count === 2) return "bg-orange-200 text-zinc-900";
  if (count === 1) return "bg-amber-100 text-zinc-900";
  return "bg-zinc-50 text-zinc-400";
}

function tooltip(week: number, names: string[]): string {
  if (names.length === 0) return `Week ${week}: none`;
  return `Week ${week}: ${names.join(", ")}`;
}

export function ByeWeekHeatmap({ players }: ByeWeekHeatmapProps) {
  const byWeek = playersByByeWeek(players);

  return (
    <section className="flex h-full w-full flex-col rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Bye weeks
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          How many of your players share each bye
        </p>
      </div>
      <div className="grid flex-1 grid-cols-5 gap-1.5 p-3">
        {BYE_WEEKS.map((week) => {
          const weekPlayers = byWeek[week];
          const count = weekPlayers.length;
          return (
            <div
              key={week}
              title={tooltip(
                week,
                weekPlayers.map((p) => p.name),
              )}
              className={`flex h-full flex-col items-center justify-center rounded px-1 py-2 ${cellClass(count)}`}
            >
              <span className="text-[10px] font-semibold tracking-wide uppercase opacity-80">
                {`Wk ${week}`}
              </span>
              <span className="text-sm font-semibold tabular-nums">{count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
