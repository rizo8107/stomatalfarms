# All Google Reviews via InsForge + Apify Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show all of Stomatal Farms' Google reviews (not just the 5 Google's Places API caps out at) by scraping them daily via an InsForge-hosted Apify pipeline and serving them to the frontend from InsForge instead of Google Places directly.

**Architecture:** A daily InsForge schedule triggers an edge function (`sync-google-reviews`) that pulls a fresh Apify token from InsForge, runs the `compass/google-maps-reviews-scraper` Apify actor against the Stomatal Farms Google Place ID, and upserts the results into two InsForge tables (`google_reviews`, `google_reviews_meta`). The frontend drops its direct Google Places API call entirely and reads both the review list and the header rating/count stat from InsForge (anon, read-only).

**Tech Stack:** InsForge (Postgres + PostgREST + Deno edge functions + schedules), Apify (`compass/google-maps-reviews-scraper` actor via InsForge's web-scraper integration), `@insforge/sdk` (frontend), React Query (existing).

## Global Constraints

- The InsForge Apify web-scraper integration is **private beta, cloud-only**. If `npx @insforge/cli webscraper apify connect` returns `HTTP 404`, that project does not have early access yet — **stop immediately and report this to the user**; do not attempt a workaround (e.g. calling Apify directly with a personal token).
- Refresh cadence is **daily**, via an InsForge schedule (not weekly, not manual-only).
- After cutover, no Google Places API key or direct Google Places call may remain anywhere in the client bundle.
- `src/hooks/useGoogleReviews.ts` must keep its current return shape (`rating`, `totalReviews`, `reviews`, `isLoading`, `isError`) and `src/components/GoogleReviewsCarousel.tsx` must require **zero changes**.
- Only the edge function (using the InsForge project admin API key) may write to `google_reviews` / `google_reviews_meta`. `anon` and `authenticated` get read-only `SELECT` — enforced by RLS, not just app-level convention.
- The Google Place ID for this business is `ChIJ0WAVLno-pGcRr0yNSWn8bxA` (currently in `.env` as `VITE_GOOGLE_PLACE_ID`).
- The InsForge project base URL is `https://d6yqray7.us-east.insforge.app`.

---

### Task 0: Manual prerequisites (human-only, blocks every later task)

**These steps require an interactive browser OAuth flow and cannot be run by an agent in a non-interactive session. The project owner must run them personally, in their own terminal, before Task 1 can start.**

**Files:** none — this is CLI/account setup, no repo changes.

- [ ] **Step 1: Log in to the InsForge CLI**

Run in an interactive terminal:

```bash
npx @insforge/cli login
```

This opens a browser for OAuth. Confirm success by running:

```bash
npx @insforge/cli whoami
```

Expected: prints the logged-in user's email (`tech.stomatalfarms@gmail.com` or whichever account owns this project).

- [ ] **Step 2: Link this directory to the existing InsForge project**

```bash
npx @insforge/cli link
```

When prompted, select the existing project whose base URL is `https://d6yqray7.us-east.insforge.app` (subdomain `d6yqray7`, region `us-east`) — do **not** create a new project. Confirm with:

```bash
npx @insforge/cli current
```

Expected: shows `Project: <name> (linked)` instead of "not linked".

- [ ] **Step 3: Connect Apify through InsForge**

```bash
npx @insforge/cli webscraper apify connect
```

- **If this succeeds** (opens Apify's OAuth page, then reports a stored token): continue to Step 4.
- **If this returns `HTTP 404`**: this InsForge project does not have the private-beta web-scraper feature enabled. **Stop here.** Report this to the user — the whole Apify-based approach (Tasks 1–4) is blocked until InsForge enables it on this project. Do not substitute a personal Apify API key or any other workaround; that was explicitly ruled out during design.

- [ ] **Step 4: Run the Apify auth bridge**

```bash
npx @insforge/cli webscraper apify login
```

This installs the Apify CLI (if missing) and Apify's official agent skills. Verify with:

```bash
apify info
```

Expected: prints the authenticated Apify account info, no "not logged in" error.

---

### Task 1: Database schema migration

**Files:**
- Create: `migrations/<timestamp>_create-google-reviews-tables.sql`

**Interfaces:**
- Produces: table `google_reviews` (columns: `id uuid`, `external_review_id text unique`, `author_name text`, `author_photo_url text`, `rating smallint`, `review_text text`, `published_at timestamptz`) and table `google_reviews_meta` (columns: `id smallint` fixed at `1`, `rating numeric`, `total_review_count integer`, `last_synced_at timestamptz`). Later tasks (3, 6) read/write these exact column names.

- [ ] **Step 1: Create the migration file**

```bash
npx @insforge/cli db migrations new create-google-reviews-tables
```

Expected: prints the created filename, e.g. `migrations/20260717120000_create-google-reviews-tables.sql`.

- [ ] **Step 2: Write the migration SQL**

Open the file created in Step 1 and write:

```sql
CREATE TABLE google_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_review_id TEXT NOT NULL UNIQUE,
  author_name TEXT NOT NULL,
  author_photo_url TEXT,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_google_reviews_published_at ON google_reviews (published_at DESC);

ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON google_reviews
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON google_reviews TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON google_reviews FROM anon, authenticated;

CREATE TABLE google_reviews_meta (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  rating NUMERIC NOT NULL DEFAULT 0,
  total_review_count INTEGER NOT NULL DEFAULT 0,
  last_synced_at TIMESTAMPTZ
);

INSERT INTO google_reviews_meta (id, rating, total_review_count) VALUES (1, 0, 0);

ALTER TABLE google_reviews_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON google_reviews_meta
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON google_reviews_meta TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON google_reviews_meta FROM anon, authenticated;
```

- [ ] **Step 3: Apply the migration**

```bash
npx @insforge/cli db migrations up --all
```

Expected: prints the applied filename with no errors.

- [ ] **Step 4: Verify the schema**

```bash
npx @insforge/cli db query "SELECT * FROM google_reviews_meta" --json
```

Expected: one row, `id: 1, rating: 0, total_review_count: 0, last_synced_at: null`.

- [ ] **Step 5: Verify RLS actually blocks anon writes**

Get the anon key first:

```bash
npx @insforge/cli metadata --json
```

Copy the anon key from the output, then attempt an anon insert (should fail):

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST "https://d6yqray7.us-east.insforge.app/api/database/records/google_reviews" \
  -H "Authorization: Bearer <anon-key-from-above>" \
  -H "Content-Type: application/json" \
  -d '[{"external_review_id":"test","author_name":"x","rating":5,"published_at":"2026-01-01T00:00:00Z"}]'
```

Expected: a `401` or `403` status code (not `201`). Then confirm anon reads still work:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://d6yqray7.us-east.insforge.app/api/database/records/google_reviews_meta" \
  -H "Authorization: Bearer <anon-key-from-above>"
```

Expected: `200`.

- [ ] **Step 6: Commit**

```bash
git add migrations/
git commit -m "feat: add google_reviews and google_reviews_meta tables with RLS"
```

---

### Task 2: Create the SYNC_SECRET secret

The sync function's HTTP endpoint is publicly reachable by URL (InsForge functions have no built-in auth gate); without a shared secret, anyone could trigger it repeatedly and burn Apify usage. This secret is what the edge function (Task 3) checks and what the schedule (Task 4) sends.

**Files:** none — InsForge secret store only.

- [ ] **Step 1: Generate a random secret value**

```bash
openssl rand -hex 32
```

Copy the output (a 64-character hex string).

- [ ] **Step 2: Store it as an InsForge secret**

```bash
npx @insforge/cli secrets add SYNC_SECRET <paste-the-generated-value>
```

- [ ] **Step 3: Verify it exists (value is never shown back)**

```bash
npx @insforge/cli secrets list
```

Expected: `SYNC_SECRET` appears in the list.

---

### Task 3: Write and deploy the `sync-google-reviews` edge function

**Files:**
- Create: `insforge/functions/sync-google-reviews.ts`

**Interfaces:**
- Consumes: `google_reviews` / `google_reviews_meta` tables from Task 1 (exact column names above); `SYNC_SECRET` from Task 2; `INSFORGE_BASE_URL` and `API_KEY` (auto-injected into every InsForge edge function).
- Produces: a deployed function reachable at `POST https://d6yqray7.us-east.insforge.app/functions/sync-google-reviews`, requiring header `X-Sync-Secret: <SYNC_SECRET value>`. Task 4 (the schedule) calls this exact URL and header.

- [ ] **Step 1: Write the function**

Create `insforge/functions/sync-google-reviews.ts`:

```typescript
const PLACE_ID = "ChIJ0WAVLno-pGcRr0yNSWn8bxA";
const APIFY_ACTOR = "compass~google-maps-reviews-scraper";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Sync-Secret",
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export default async function (req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const expectedSecret = Deno.env.get("SYNC_SECRET");
  const providedSecret = req.headers.get("X-Sync-Secret");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const baseUrl = Deno.env.get("INSFORGE_BASE_URL");
  const apiKey = Deno.env.get("API_KEY");

  try {
    const tokenRes = await fetch(`${baseUrl}/api/webscraper/apify/token`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!tokenRes.ok) {
      throw new Error(`Apify token fetch failed: ${tokenRes.status}`);
    }
    const { accessToken } = (await tokenRes.json()) as { accessToken: string };

    const apifyRes = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeIds: [PLACE_ID],
          maxReviews: 200,
          reviewsSort: "newest",
          language: "en",
        }),
      }
    );
    if (!apifyRes.ok) {
      throw new Error(`Apify actor run failed: ${apifyRes.status}`);
    }
    const items = (await apifyRes.json()) as Array<Record<string, unknown>>;

    if (items.length === 0) {
      return jsonResponse({ synced: 0, message: "No reviews returned" }, 200);
    }

    const reviewRows = items.map((item) => ({
      external_review_id: String(item.reviewId),
      author_name: String(item.name ?? "Google User"),
      author_photo_url: item.reviewerPhotoUrl ? String(item.reviewerPhotoUrl) : null,
      rating: Number(item.stars),
      review_text: String(item.text ?? ""),
      published_at: String(item.publishedAtDate),
    }));

    const upsertRes = await fetch(`${baseUrl}/api/database/records/google_reviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(reviewRows),
    });
    if (!upsertRes.ok) {
      const detail = await upsertRes.text();
      throw new Error(`Review upsert failed: ${upsertRes.status} ${detail}`);
    }

    const first = items[0];
    const metaRes = await fetch(`${baseUrl}/api/database/records/google_reviews_meta?id=eq.1`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: Number(first.totalScore ?? 0),
        total_review_count: Number(first.reviewsCount ?? reviewRows.length),
        last_synced_at: new Date().toISOString(),
      }),
    });
    if (!metaRes.ok) {
      const detail = await metaRes.text();
      throw new Error(`Meta update failed: ${metaRes.status} ${detail}`);
    }

    return jsonResponse({ synced: reviewRows.length }, 200);
  } catch (err) {
    console.error("sync-google-reviews failed:", err);
    return jsonResponse({ error: String(err) }, 500);
  }
}
```

Note: on any failure (Apify down, malformed response, upsert error), the function returns a `500` **without** having deleted or truncated existing rows — the only writes are upserts, so last-known-good data always survives a failed run.

- [ ] **Step 2: Deploy the function**

```bash
npx @insforge/cli functions deploy sync-google-reviews \
  --file insforge/functions/sync-google-reviews.ts \
  --name "Sync Google Reviews" \
  --description "Daily pull of Google Maps reviews via Apify into google_reviews/google_reviews_meta"
```

Expected: success message confirming create/update and slug `sync-google-reviews`.

- [ ] **Step 3: Confirm it's active**

```bash
npx @insforge/cli functions list
```

Expected: `sync-google-reviews` listed with `status: active`.

- [ ] **Step 4: Invoke it once manually and verify data lands**

```bash
curl -s -X POST "https://d6yqray7.us-east.insforge.app/functions/sync-google-reviews" \
  -H "X-Sync-Secret: <the SYNC_SECRET value from Task 2>"
```

Expected: `{"synced": <some number greater than 0>}`.

Then verify the rows actually landed:

```bash
npx @insforge/cli db query "SELECT count(*) FROM google_reviews" --json
npx @insforge/cli db query "SELECT * FROM google_reviews_meta" --json
```

Expected: `count` greater than 5 (proving we're past Google's 5-review cap), and `google_reviews_meta` now shows a real `rating`, `total_review_count`, and non-null `last_synced_at`.

- [ ] **Step 5: Commit**

```bash
git add insforge/functions/sync-google-reviews.ts
git commit -m "feat: add sync-google-reviews edge function (Apify -> InsForge)"
```

---

### Task 4: Create the daily schedule

**Files:** none — InsForge schedule only.

**Interfaces:**
- Consumes: the deployed function URL and `SYNC_SECRET` from Tasks 2–3.

- [ ] **Step 1: Create the schedule**

```bash
npx @insforge/cli schedules create \
  --name "Sync Google Reviews" \
  --cron "0 3 * * *" \
  --url "https://d6yqray7.us-east.insforge.app/functions/sync-google-reviews" \
  --method POST \
  --headers '{"X-Sync-Secret": "${{secrets.SYNC_SECRET}}"}'
```

Expected: prints the created schedule's ID.

- [ ] **Step 2: Verify it's active**

```bash
npx @insforge/cli schedules get <id-from-step-1>
```

Expected: `isActive: true`, a valid `nextRun` timestamp roughly 3:00 AM UTC.

- [ ] **Step 3: Confirm execution logging works**

Since the schedule won't fire again until 3 AM UTC, confirm the logging path itself works by checking history (will be empty until the first scheduled fire, which is expected):

```bash
npx @insforge/cli schedules logs <id-from-step-1>
```

Expected: command succeeds (empty log list is fine — Task 3 Step 4 already proved the function itself works when invoked directly).

---

### Task 5: Frontend — add InsForge SDK client and env vars

**Files:**
- Modify: `package.json` (add dependency)
- Modify: `.env`

**Interfaces:**
- Produces: `VITE_INSFORGE_URL` and `VITE_INSFORGE_ANON_KEY` env vars, consumed by Task 6's rewrite of `src/lib/googlePlaces.ts`.

- [ ] **Step 1: Install the SDK**

```bash
npm install @insforge/sdk@latest
```

- [ ] **Step 2: Get the anon key**

Using the connected InsForge MCP server, call the `get-anon-key` tool (or run `npx @insforge/cli metadata --json` and read the anon key field). Copy the returned token — this is a public, client-safe key by design (unlike the admin `API_KEY`, which must never appear in frontend code or `.env`).

- [ ] **Step 3: Update `.env`**

Remove these two lines from `.env`:

```
VITE_GOOGLE_PLACES_API_KEY=AIzaSyALOmAfQz-BFb6rdzBxfFDVvRHHjYy-FuI
VITE_GOOGLE_PLACE_ID=ChIJ0WAVLno-pGcRr0yNSWn8bxA
```

Add:

```
VITE_INSFORGE_URL=https://d6yqray7.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=<paste the anon key from Step 2>
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .env
git commit -m "chore: add InsForge SDK and env config, drop Google Places client key"
```

(If `.env` is gitignored in this repo, skip staging it and just note the change locally — check `git status` first to confirm whether `.env` is tracked.)

---

### Task 6: Frontend — rewrite `googlePlaces.ts` to read from InsForge

**Files:**
- Modify: `src/lib/googlePlaces.ts` (full rewrite)
- Modify: `src/hooks/useGoogleReviews.ts:4` (staleTime constant + comment only)

**Interfaces:**
- Consumes: `google_reviews` / `google_reviews_meta` tables (Task 1 column names), `VITE_INSFORGE_URL` / `VITE_INSFORGE_ANON_KEY` (Task 5).
- Produces: `fetchPlaceReviews(): Promise<PlaceReviewsData>`, `GoogleReview`, `PlaceReviewsData` — same names/shapes as before, so `useGoogleReviews.ts`'s import (`import { fetchPlaceReviews, type GoogleReview } from "@/lib/googlePlaces"`) needs no changes, and `GoogleReviewsCarousel.tsx` needs no changes at all.

- [ ] **Step 1: Replace `src/lib/googlePlaces.ts` entirely**

```typescript
import { createClient } from "@insforge/sdk";

export interface GoogleReview {
  id: string;
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
}

export interface PlaceReviewsData {
  rating: number;
  totalReviews: number;
  reviews: GoogleReview[];
}

interface GoogleReviewRow {
  external_review_id: string;
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  review_text: string;
  published_at: string;
}

interface GoogleReviewsMetaRow {
  rating: number;
  total_review_count: number;
}

function relativeTimeFrom(publishedAt: string): string {
  const diffMs = Date.now() - new Date(publishedAt).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function mapRow(row: GoogleReviewRow): GoogleReview {
  return {
    id: row.external_review_id,
    authorName: row.author_name,
    authorPhotoUrl: row.author_photo_url,
    rating: row.rating,
    text: row.review_text,
    relativeTime: relativeTimeFrom(row.published_at),
    publishTime: row.published_at,
  };
}

export async function fetchPlaceReviews(): Promise<PlaceReviewsData> {
  const baseUrl = import.meta.env.VITE_INSFORGE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY as string | undefined;

  if (!baseUrl || !anonKey) {
    throw new Error("Missing VITE_INSFORGE_URL or VITE_INSFORGE_ANON_KEY");
  }

  const client = createClient({ baseUrl, anonKey });

  const [reviewsResult, metaResult] = await Promise.all([
    client.database
      .from("google_reviews")
      .select("external_review_id, author_name, author_photo_url, rating, review_text, published_at")
      .order("published_at", { ascending: false }),
    client.database.from("google_reviews_meta").select("rating, total_review_count").eq("id", 1),
  ]);

  if (reviewsResult.error) throw reviewsResult.error;
  if (metaResult.error) throw metaResult.error;

  const meta = (metaResult.data as GoogleReviewsMetaRow[] | null)?.[0];

  return {
    rating: meta?.rating ?? 0,
    totalReviews: meta?.total_review_count ?? 0,
    reviews: ((reviewsResult.data as GoogleReviewRow[] | null) ?? []).map(mapRow),
  };
}
```

This drops the old `localStorage` cache and the direct `fetch()` to `places.googleapis.com` entirely — InsForge (refreshed daily by Task 3/4) is now the durable cache.

- [ ] **Step 2: Update the staleTime comment in `useGoogleReviews.ts`**

In `src/hooks/useGoogleReviews.ts:4`, change:

```typescript
const STALE_TIME_MS = 12 * 60 * 60 * 1000; // matches googlePlaces.ts cache TTL
```

to:

```typescript
const STALE_TIME_MS = 60 * 60 * 1000; // InsForge data itself only refreshes once a day; an hour keeps this responsive to same-day edits without refetching on every render
```

No other lines in this file change.

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/googlePlaces.ts src/hooks/useGoogleReviews.ts
git commit -m "feat: serve reviews from InsForge instead of Google Places API directly"
```

---

### Task 7: End-to-end verification in the browser

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Wait for `Local: http://localhost:5173/` in the output.

- [ ] **Step 2: Load the page and check the console**

Open `http://localhost:5173` in a browser (or drive headless Chromium the same way used earlier in this project), scroll to the "Google Reviews" section, and open devtools console.

Expected:
- No `places.googleapis.com` requests in the Network tab at all (confirms the client-side Google Places call is gone).
- A request to `d6yqray7.us-east.insforge.app` succeeds.
- No console errors.
- The review count rendered in the carousel is greater than 5 (matching the `count(*)` from Task 3 Step 4), and the header rating/count match `google_reviews_meta`.

- [ ] **Step 3: Confirm the carousel's existing filter/sort UI still works**

Change the "All Ratings" dropdown to "5 Stars" and the sort dropdown to "Highest Ratings" — confirm the list updates without errors (this exercises `GoogleReviewsCarousel.tsx`'s unchanged filter/sort logic against the new data source).

- [ ] **Step 4: Final check — no leftover Google Places references**

```bash
grep -rn "places.googleapis.com\|VITE_GOOGLE_PLACES_API_KEY\|VITE_GOOGLE_PLACE_ID" src/ .env
```

Expected: no matches.
