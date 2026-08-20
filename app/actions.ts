"use server";

import { revalidatePath } from "next/cache";
import { canAddToMyTeam } from "@/lib/roster";
import { createClient } from "@/lib/supabase/server";
import type { Player } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function fetchPlayers(): Promise<Player[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("overall_rank", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Player[];
}

export async function markSelected(playerId: string): Promise<ActionResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("players")
      .update({ selected: true, my_team: false })
      .eq("id", playerId);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to mark selected",
    };
  }
}

export async function markMyTeam(playerId: string): Promise<ActionResult> {
  try {
    const players = await fetchPlayers();
    const candidate = players.find((p) => p.id === playerId);

    if (!candidate) {
      return { ok: false, error: "Player not found" };
    }

    const currentMyTeam = players.filter((p) => p.my_team);
    if (!canAddToMyTeam(currentMyTeam, candidate)) {
      return {
        ok: false,
        error: "No open roster slot for this position (roster full or incompatible).",
      };
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("players")
      .update({ selected: true, my_team: true })
      .eq("id", playerId);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to add to my team",
    };
  }
}

export async function clearPlayer(playerId: string): Promise<ActionResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("players")
      .update({ selected: false, my_team: false })
      .eq("id", playerId);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to clear player",
    };
  }
}
