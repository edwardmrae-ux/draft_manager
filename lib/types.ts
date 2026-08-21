export type Position = "QB" | "RB" | "WR" | "TE" | "DST" | "K";

export type Player = {
  id: string;
  name: string;
  team: string;
  position: Position;
  overall_rank: number;
  position_rank: number;
  bye_week: number | null;
  strength_of_schedule: number | null;
  selected: boolean;
  my_team: boolean;
};

export type AvailabilityFilter = "all" | "available" | "selected" | "my_team";

export type SlotId =
  | "QB"
  | "RB1"
  | "RB2"
  | "WR1"
  | "WR2"
  | "WR3"
  | "FLEX1"
  | "FLEX2"
  | "DST"
  | "K"
  | "BENCH1"
  | "BENCH2"
  | "BENCH3"
  | "BENCH4"
  | "BENCH5"
  | "BENCH6";

export type RosterSlot = {
  id: SlotId;
  label: string;
  allowed: Position[];
  player: Player | null;
};
