# Creatorverse

Creatorverse is a small React app for browsing, adding, editing, and deleting content creators backed by Supabase.

## Local Setup

```bash
npm install
```

Create a `.env.local` file in the project root with your Supabase values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Run The App

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Seed The Database

The project includes an idempotent seed script that inserts the curated creator rows if they are missing and updates existing rows that match by URL so avatars stay current.

Dry-run first:

```bash
npm run seed:creators -- --dry-run
```

Run the live seed:

```bash
npm run seed:creators
```

The script reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from either your environment or `.env.local`, checks existing creators by `url`, updates stale seed rows, and skips duplicates on reruns.

## Verification

```bash
npm run build
npm test -- --run
```
