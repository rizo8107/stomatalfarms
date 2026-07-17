# Design: All Google Reviews via InsForge + Apify Pipeline

## Problem

The site currently fetches reviews directly from the Google Places API (New)
client-side (`src/lib/googlePlaces.ts`). That API hard-caps the `reviews`
field at 5 "most relevant" reviews chosen by Google, regardless of the
place's total rating count (48 for Stomatal Farms today). There is no
official parameter to raise this limit. To show all reviews, a different
data source and a backend cache are required.

## Decision

- **Data source**: an Apify actor (Google Maps reviews scraper) run through
  InsForge's built-in web-scraper integration, rather than a paid closed
  API (Outscraper/SerpApi) or the OAuth-gated Google Business Profile API.
  Apify has open-source community actors and a free usage tier, and InsForge
  already has first-class support for connect → scrape → land → schedule.
  Caveat: this InsForge feature is in **private beta, cloud-only**. If
  `webscraper apify connect` 404s, the project doesn't have early access yet
  and this plan is blocked until it's enabled.
- **Backend**: InsForge (already set up for this project) stores the scraped
  reviews and serves them to the frontend. Google Places is dropped as a
  runtime dependency entirely — InsForge becomes the single source of truth
  for both the review list and the header rating/count stat.
- **Refresh cadence**: daily, via an InsForge schedule.

## Architecture

```
InsForge schedule (daily cron)
        |
        v
InsForge edge function: sync-google-reviews
        | 1. GET /api/webscraper/apify/token (INSFORGE_BASE_URL + API_KEY auto-injected)
        | 2. Apify run-sync-get-dataset-items (Google Maps reviews actor, Stomatal Farms listing)
        | 3. Upsert results
        v
InsForge tables: google_reviews, google_reviews_meta
        ^
        | SELECT (anon key, read-only via RLS)
        |
Frontend: useGoogleReviews hook -> GoogleReviewsCarousel
```

## Data model (InsForge / Postgres)

`google_reviews` — one row per review:
- `external_review_id` (text, unique) — Apify/Google review identifier, used for idempotent upsert
- `author_name` (text)
- `author_photo_url` (text, nullable)
- `rating` (smallint, 1-5)
- `review_text` (text)
- `published_at` (timestamptz)

`google_reviews_meta` — single row, updated in place:
- `rating` (numeric) — overall place rating
- `total_review_count` (integer)
- `last_synced_at` (timestamptz)

RLS: both tables allow `SELECT` for the anon/public role. Only the edge
function, authenticated with the project admin key, may `INSERT`/`UPDATE`.
No write path is exposed to the client.

## Data flow

1. **Sync (daily)**: InsForge schedule fires the `sync-google-reviews` edge
   function. It fetches a short-lived Apify token, runs the actor
   synchronously for the Stomatal Farms Google Maps listing, and upserts the
   returned reviews into `google_reviews` (keyed on `external_review_id`) and
   updates the single `google_reviews_meta` row. If the Apify call or upsert
   fails, the function logs the error and returns without touching existing
   rows — `last_synced_at` simply doesn't advance, so the site keeps showing
   the last successful sync's data rather than a broken or empty state.
2. **Read (page load)**: the frontend queries InsForge directly (anon key)
   for all `google_reviews` rows plus the `google_reviews_meta` row, through
   React Query with an hour-scale `staleTime` (the daily-refreshed backend
   table is itself the durable cache — no `localStorage` fallback needed
   anymore).
3. **Render**: `GoogleReviewsCarousel`'s existing star-filter and sort-mode
   UI operates on whatever list comes back, unchanged — now dozens of
   reviews instead of 5.

## Frontend changes

- `src/lib/googlePlaces.ts` is replaced by a thin InsForge-backed query
  module (reads `google_reviews` + `google_reviews_meta` via the InsForge
  client/SDK).
- `src/hooks/useGoogleReviews.ts` keeps its current return shape (`rating`,
  `totalReviews`, `reviews`, `isLoading`, `isError`), so
  `src/components/GoogleReviewsCarousel.tsx` requires no changes.
- `VITE_GOOGLE_PLACES_API_KEY` and `VITE_GOOGLE_PLACE_ID` are removed from
  `.env` once cut over — the Google Places API key is no longer shipped to
  the client at all.

## Error handling

- Edge function: Apify or DB failure → log via InsForge logs, leave existing
  data untouched, do not advance `last_synced_at`.
- Frontend: InsForge fetch failure → React Query `retry: 1`; if it still
  fails and there's no cached data, the carousel section renders nothing
  (same behavior as today), rather than a broken/empty box.

## Testing

- Manually run `npx @insforge/cli functions invoke sync-google-reviews` once
  and inspect the table contents before relying on the schedule.
- Verify RLS: confirm the anon key can `SELECT` but not `INSERT`/`UPDATE` on
  either table.
- Confirm the carousel renders the full scraped review count (not capped at
  5) and the header stat matches the Apify-sourced total.

## Out of scope

- Migrating away from InsForge's private-beta web-scraper feature if it
  turns out not to be enabled for this project (that's a hard blocker to
  raise with InsForge, not something to work around).
- Historical backfill beyond what the Apify actor returns in one run.
- Review reply/response management (this is read-only display).
