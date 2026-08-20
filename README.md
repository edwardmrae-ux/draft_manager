# NFL Fantasy Draft Tracker

Live draft board for NFL fantasy: filter the full player pool, mark picks as taken or yours, and see your roster fill automatically.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript + Tailwind
- [Supabase](https://supabase.com/) for the `players` table
- Deploy on [Vercel](https://vercel.com/)

## Setup

### 1. Install

```bash
npm install
cp .env.local.example .env.local
```

### 2. Supabase

1. Create a Supabase project.
2. Open **SQL Editor** and run [`supabase/migrations/001_players.sql`](supabase/migrations/001_players.sql).
3. Insert your player list (Table Editor CSV import or SQL). Required columns:

| Column | Type |
|---|---|
| `name` | text |
| `team` | text |
| `position` | `QB` `RB` `WR` `TE` `DEF` `K` |
| `overall_rank` | integer |
| `position_rank` | integer |
| `bye_week` | integer (nullable) |
| `strength_of_schedule` | integer (nullable) |
| `selected` | boolean (default false) |
| `my_team` | boolean (default false) |

4. Copy **Project URL** and **anon public** key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

The migration enables RLS policies so the anon key can `SELECT` and `UPDATE` players (personal draft tool; no login).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

- **Select** — mark a player taken by someone else (`selected = true`).
- **My team** — add to your roster (`my_team = true` and `selected = true`). Slots auto-fill by `overall_rank` into QB / RB / WR / Flex / Defense / K / Bench.
- **Clear** — put the player back in the available pool.
- Filters: position, availability (All / Available / Selected / My team), and name search.

Roster slots (16):

`QB`, `RB`, `RB`, `WR`, `WR`, `WR`, `Flex`, `Flex`, `Defense`, `K`, plus 6 `Bench`.

Flex accepts WR / RB / TE. If there is no legal open slot for a pick, **My team** is rejected with an error.

## Deploy to Vercel

1. Push this repo to GitHub (or connect the folder in the Vercel dashboard).
2. Create a Vercel project from the repo.
3. Add the same env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy.

## Project layout

```
app/                 # pages + server actions
components/          # DraftBoard, PlayerTable, Filters, RosterPanel
lib/roster.ts        # slot defs + auto-assign
lib/supabase/        # browser + server clients
supabase/migrations/ # SQL for the players table
```
