"use client";

import type { RosterSlot } from "@/lib/types";

type RosterPanelProps = {
  slots: RosterSlot[];
};

export function RosterPanel({ slots }: RosterPanelProps) {
  const filled = slots.filter((s) => s.player !== null).length;

  return (
    <aside className="flex h-full flex-col rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          My roster
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {filled} / {slots.length} slots filled
        </p>
      </div>

      <ul className="flex-1 divide-y divide-zinc-100 overflow-y-auto">
        {slots.map((slot) => (
          <li
            key={slot.id}
            className="flex items-center gap-3 px-4 py-2.5 text-sm"
          >
            <span className="w-14 shrink-0 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              {slot.label}
            </span>
            {slot.player ? (
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900">
                  {slot.player.name}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {slot.player.team} · {slot.player.position}
                  {slot.player.bye_week != null
                    ? ` · Bye ${slot.player.bye_week}`
                    : ""}
                </p>
              </div>
            ) : (
              <span className="text-zinc-400 italic">Empty</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
