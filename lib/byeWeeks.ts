import type { Player } from "./types";

export const BYE_WEEKS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const;

export type ByeWeek = (typeof BYE_WEEKS)[number];

function isByeWeek(week: number): week is ByeWeek {
  return (BYE_WEEKS as readonly number[]).includes(week);
}

/** Group my-team players by bye week. Weeks outside 5–14 (or null) are omitted. */
export function playersByByeWeek(
  myTeam: Player[],
): Record<ByeWeek, Player[]> {
  const result = Object.fromEntries(
    BYE_WEEKS.map((week) => [week, [] as Player[]]),
  ) as Record<ByeWeek, Player[]>;

  for (const player of myTeam) {
    const week = player.bye_week;
    if (week != null && isByeWeek(week)) {
      result[week].push(player);
    }
  }

  return result;
}
