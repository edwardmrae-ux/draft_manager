import type { Player, Position, RosterSlot, SlotId } from "./types";

type SlotDef = {
  id: SlotId;
  label: string;
  allowed: Position[];
};

export const ROSTER_SLOT_DEFS: SlotDef[] = [
  { id: "QB", label: "QB", allowed: ["QB"] },
  { id: "RB1", label: "RB", allowed: ["RB"] },
  { id: "RB2", label: "RB", allowed: ["RB"] },
  { id: "WR1", label: "WR", allowed: ["WR"] },
  { id: "WR2", label: "WR", allowed: ["WR"] },
  { id: "WR3", label: "WR", allowed: ["WR"] },
  { id: "FLEX1", label: "Flex", allowed: ["WR", "RB", "TE"] },
  { id: "FLEX2", label: "Flex", allowed: ["WR", "RB", "TE"] },
  { id: "DEF", label: "Defense", allowed: ["DEF"] },
  { id: "K", label: "K", allowed: ["K"] },
  { id: "BENCH1", label: "Bench", allowed: ["QB", "RB", "WR", "TE", "DEF", "K"] },
  { id: "BENCH2", label: "Bench", allowed: ["QB", "RB", "WR", "TE", "DEF", "K"] },
  { id: "BENCH3", label: "Bench", allowed: ["QB", "RB", "WR", "TE", "DEF", "K"] },
  { id: "BENCH4", label: "Bench", allowed: ["QB", "RB", "WR", "TE", "DEF", "K"] },
  { id: "BENCH5", label: "Bench", allowed: ["QB", "RB", "WR", "TE", "DEF", "K"] },
  { id: "BENCH6", label: "Bench", allowed: ["QB", "RB", "WR", "TE", "DEF", "K"] },
];

/**
 * Assign my-team players to roster slots by overall_rank (ascending).
 * Each player takes the first empty slot that accepts their position.
 */
export function buildRoster(myTeamPlayers: Player[]): {
  slots: RosterSlot[];
  unassigned: Player[];
} {
  const sorted = [...myTeamPlayers].sort(
    (a, b) => a.overall_rank - b.overall_rank,
  );

  const slots: RosterSlot[] = ROSTER_SLOT_DEFS.map((def) => ({
    ...def,
    player: null,
  }));

  const unassigned: Player[] = [];

  for (const player of sorted) {
    const slot = slots.find(
      (s) => s.player === null && s.allowed.includes(player.position),
    );
    if (slot) {
      slot.player = player;
    } else {
      unassigned.push(player);
    }
  }

  return { slots, unassigned };
}

/** Returns true if every my-team player (including candidate) can fill a legal slot. */
export function canAddToMyTeam(
  currentMyTeam: Player[],
  candidate: Player,
): boolean {
  const combined = currentMyTeam.some((p) => p.id === candidate.id)
    ? currentMyTeam
    : [...currentMyTeam, candidate];

  const { unassigned } = buildRoster(combined);
  return unassigned.length === 0;
}
