-- NFL Fantasy Draft Tracker: players table
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team text not null,
  position text not null check (position in ('QB', 'RB', 'WR', 'TE', 'DEF', 'K')),
  overall_rank integer not null,
  position_rank integer not null,
  bye_week integer,
  strength_of_schedule integer,
  selected boolean not null default false,
  my_team boolean not null default false
);

create index if not exists players_overall_rank_idx on public.players (overall_rank);
create index if not exists players_position_idx on public.players (position);
create index if not exists players_selected_idx on public.players (selected);
create index if not exists players_my_team_idx on public.players (my_team);

alter table public.players enable row level security;

-- Personal draft tool: anon can read and update status flags.
-- Tighten these policies if you later add auth.

drop policy if exists "Allow anon select players" on public.players;
create policy "Allow anon select players"
  on public.players
  for select
  to anon
  using (true);

drop policy if exists "Allow anon update players" on public.players;
create policy "Allow anon update players"
  on public.players
  for update
  to anon
  using (true)
  with check (true);

-- Optional: allow authenticated role the same access
drop policy if exists "Allow authenticated select players" on public.players;
create policy "Allow authenticated select players"
  on public.players
  for select
  to authenticated
  using (true);

drop policy if exists "Allow authenticated update players" on public.players;
create policy "Allow authenticated update players"
  on public.players
  for update
  to authenticated
  using (true)
  with check (true);
