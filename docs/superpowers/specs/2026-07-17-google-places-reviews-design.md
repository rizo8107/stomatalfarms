# Live Google Reviews for `GoogleReviewsCarousel`

## Context

`src/components/GoogleReviewsCarousel.tsx` currently renders a swipeable Embla
carousel of hardcoded PNG screenshots (`src/components/reviews-list.ts`,
images in `/reviews`), plus a hand-typed "4.7 · 1,200+ reviews" header line.
It's mounted on the homepage (`src/pages/Index.tsx`) and on
`src/pages/ProductDetail.tsx`.

The site is a static SPA: built with Vite, deployed as prebuilt files behind
nginx in Docker (`Dockerfile`, `nginx.conf`) and also configured for Netlify
static hosting (`netlify.toml`). There is no server runtime in either
deployment path.

Goal: replace the hardcoded carousel with one backed by live data from the
Google Places API, in place, with no new route.

## Constraints (from Google's API)

- Place Details (Places API New) returns the place's average `rating` and
  `userRatingCount` (total review count), but **at most 5 individual
  reviews** — never the full review history.
- No 1–5 star breakdown/histogram is exposed by the API.
- Individual review objects only contain: reviewer display name, reviewer
  profile photo URI, star rating, review text, publish time /
  relative-time description. They do **not** include "Local Guide" status,
  the reviewer's own review/photo counts, a "new review" flag, or any
  photos attached to the review itself.
- The site has no backend, so the API key must be usable directly from the
  browser. Google's Places API (New) supports CORS for this; the key will
  be restricted in Google Cloud Console to the site's HTTP referrer(s).

## Non-goals

- No new page/route (e.g. `/reviews`) — everything happens inside the
  existing `GoogleReviewsCarousel` component at its two existing mount
  points.
- No star-rating breakdown bars (data not available).
- No server-side proxy / serverless function for the API key.
- No attempt to reproduce "Local Guide" badges, reviewer photo/review
  counts, "NEW" tags, or attached review photos — dropped since the API
  doesn't provide them.

## Design

### 1. Data layer — `src/lib/googlePlaces.ts`

- Reads `VITE_GOOGLE_PLACES_API_KEY` and `VITE_GOOGLE_PLACE_ID` from Vite
  env vars (added to `.env`, `.env.example`, and documented for the Docker
  build-arg / Netlify env-var paths alongside the existing
  `VITE_SHOPIFY_*` vars).
- `fetchPlaceReviews()`:
  - `GET https://places.googleapis.com/v1/places/{placeId}`
  - Headers: `X-Goog-Api-Key: <key>`, `X-Goog-FieldMask: rating,userRatingCount,reviews`
  - Returns `{ rating: number, totalReviews: number, reviews: Review[] }`
    where `Review` is `{ id, authorName, authorPhotoUrl, rating, text,
    relativeTime, publishTime }`.
- **Caching**: successful responses are stored in `localStorage` under a
  fixed key with a timestamp. A cached response younger than 12 hours is
  used instead of calling the API again. This bounds API usage regardless
  of traffic/visit volume.
- **Error handling**: on fetch failure (network error, non-2xx, malformed
  response), fall back to the last cached response if one exists,
  regardless of its age. If there is no cached response at all, the caller
  receives an error state and the UI shows a graceful empty state — the
  section never renders broken/partial data.

### 2. Hook — `src/hooks/useGoogleReviews.ts`

- Wraps `fetchPlaceReviews()` in a `@tanstack/react-query` `useQuery`
  (React Query is already a project dependency), with `staleTime` aligned
  to the 12h cache window.
- Returns `{ rating, totalReviews, reviews, isLoading, isError }`.

### 3. `GoogleReviewsCarousel.tsx` (rewritten in place)

- Same file, same two mount points (`Index.tsx`, `ProductDetail.tsx`), no
  router changes.
- Header row keeps its current visual style (Google "G" logo mark,
  "GOOGLE REVIEWS" label, prev/next nav buttons) but the star count and
  "N reviews" text are now driven by `rating` / `totalReviews` from the
  hook instead of being hardcoded.
- Card row keeps the existing dark-card visual style and Embla
  swipe/autoplay behavior. Each card now renders one real review:
  - Avatar: reviewer's Google profile photo if present, otherwise a
    colored circle with their initial (existing fallback pattern already
    used elsewhere in the codebase, e.g. `Reviews.tsx`).
  - Name, star rating, relative time (e.g. "2 days ago").
  - Review text, truncated with a "...More" expand/collapse toggle for
    long text.
  - No badges, counts, or photos beyond the above (see Non-goals).
- Since at most 5 reviews are ever available, the component offers simple
  **client-side** controls over that fixed set (no additional API calls):
  - Filter by star rating ("All Ratings" dropdown).
  - Sort newest-first vs. highest-rated-first ("Latest Ratings" dropdown).
- Loading state: skeleton cards matching the card layout while the query
  is in flight (only visible on a cold cache / first load).
- Empty/error state: if `isError` and no cached data is available at all
  (never fetched successfully, e.g. misconfigured key on a fresh
  deploy), the component renders nothing (returns `null`) rather than
  showing fabricated numbers or a broken/empty-looking section. It never
  invents a rating or review count.

### 4. Cleanup

- Remove the `reviews-list.ts` import and its usage from
  `GoogleReviewsCarousel.tsx`.
- Leave `reviews-list.ts` and the screenshot images under `/reviews` on
  disk untouched (not deleted as part of this change) in case they're
  reused elsewhere later.

## Testing

- Manual verification in the browser (dev server) with a real API key and
  place ID:
  - Cold load shows skeleton then real data.
  - Reload within 12h serves from `localStorage` cache (no network call —
    verify in devtools Network tab).
  - Temporarily using an invalid key/place ID confirms the error/fallback
    path renders gracefully instead of breaking the page.
  - Both mount points (`Index.tsx`, `ProductDetail.tsx`) render correctly.
  - Filter/sort controls correctly narrow/reorder the fetched review set.
