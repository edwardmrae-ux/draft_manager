"use client";

import { useEffect, useState } from "react";
import { usePositionColors } from "@/components/PositionColorProvider";
import {
  POSITIONS,
  normalizeHex,
  stripHash,
} from "@/lib/positionColors";
import type { Position } from "@/lib/types";

const inputClass =
  "w-28 rounded border border-zinc-300 bg-white px-2.5 py-1.5 font-mono text-sm font-normal normal-case tracking-normal text-zinc-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600";

function ColorRow({ position }: { position: Position }) {
  const { colors, setColor } = usePositionColors();
  const saved = colors[position];
  const [input, setInput] = useState(stripHash(saved));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInput(stripHash(colors[position]));
    setError(null);
  }, [colors, position]);

  function applyValue(raw: string, showError: boolean) {
    const withoutHash = stripHash(raw).trim();
    setInput(withoutHash);

    const normalized = normalizeHex(withoutHash);
    if (normalized) {
      // 6-digit codes persist immediately; 3-digit codes wait for blur
      // so typing a full hex does not save a short code mid-way.
      if (showError || withoutHash.length === 6) {
        setColor(position, normalized);
      }
      setError(null);
      return;
    }

    if (showError) {
      setError(
        withoutHash.length === 0
          ? "Enter a hex color"
          : "Enter a 3- or 6-digit hex color",
      );
    } else {
      setError(null);
    }
  }

  const preview = normalizeHex(input) ?? saved;

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-zinc-100 py-3 last:border-b-0">
      <span
        className="inline-flex rounded px-1.5 py-0.5 text-xs font-semibold text-white"
        style={{ backgroundColor: preview }}
      >
        {position}
      </span>
      <span className="w-10 text-sm font-medium text-zinc-800">{position}</span>
      <label className="flex items-center gap-1 text-sm text-zinc-600">
        <span className="select-none font-mono text-zinc-400">#</span>
        <input
          type="text"
          value={input}
          spellCheck={false}
          autoComplete="off"
          aria-label={`${position} hex color`}
          aria-invalid={error ? true : undefined}
          placeholder="dc2626"
          onChange={(e) => applyValue(e.target.value, false)}
          onBlur={(e) => applyValue(e.target.value, true)}
          className={inputClass}
        />
      </label>
      <span
        className="size-6 rounded border border-zinc-200"
        style={{ backgroundColor: preview }}
        aria-hidden
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function PositionColorAdmin() {
  const { resetDefaults } = usePositionColors();

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
            Position colors
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Hex codes without a leading #. Changes save in this browser and
            apply to the draft board.
          </p>
        </div>
        <button
          type="button"
          onClick={resetDefaults}
          className="rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Reset to defaults
        </button>
      </div>

      <div className="mt-4">
        {POSITIONS.map((position) => (
          <ColorRow key={position} position={position} />
        ))}
      </div>
    </div>
  );
}
