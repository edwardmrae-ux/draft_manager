import { DraftBoard } from "@/components/DraftBoard";
import { createClient } from "@/lib/supabase/server";
import type { Player } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getPlayers(): Promise<{ players: Player[]; error: string | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("overall_rank", { ascending: true });

    if (error) {
      return { players: [], error: error.message };
    }

    return { players: (data ?? []) as Player[], error: null };
  } catch (e) {
    return {
      players: [],
      error:
        e instanceof Error
          ? e.message
          : "Could not connect to Supabase. Check your env vars.",
    };
  }
}

export default async function HomePage() {
  const { players, error } = await getPlayers();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
      {error ? (
        <div className="mb-4 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">Could not load players</p>
          <p className="mt-1 text-amber-800">{error}</p>
          <p className="mt-2 text-amber-800">
            Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            and{" "}
            <code className="rounded bg-amber-100 px-1">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            in <code className="rounded bg-amber-100 px-1">.env.local</code>, run the
            SQL migration, then add your player rows in Supabase.
          </p>
        </div>
      ) : null}

      {!error && players.length === 0 ? (
        <div className="mb-4 rounded border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 shadow-sm">
          No players in the database yet. Insert rows into the{" "}
          <code className="rounded bg-zinc-100 px-1">players</code> table in
          Supabase (CSV import or SQL), then refresh.
        </div>
      ) : null}

      <DraftBoard players={players} />
    </main>
  );
}
