# Live Google Reviews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded screenshot carousel in `GoogleReviewsCarousel.tsx` with one driven by live data from the Google Places API (New), in place, at its existing two mount points.

**Architecture:** A small fetch+cache module (`src/lib/googlePlaces.ts`) calls Google's Places API (New) directly from the browser using a referrer-restricted API key, caching the result in `localStorage` for 12h. A React Query hook (`src/hooks/useGoogleReviews.ts`) wraps it. `GoogleReviewsCarousel.tsx` is rewritten to consume the hook instead of the static `reviews-list.ts` image list, keeping its existing Embla carousel and dark-card visual style.

**Tech Stack:** React + TypeScript (Vite), `@tanstack/react-query` (already provided at app root in `src/App.tsx`), `embla-carousel-react` (already used), Tailwind CSS, `lucide-react` icons, shadcn `Avatar`/`AvatarImage`/`AvatarFallback` (`src/components/ui/avatar.tsx`), `@radix-ui/react-select` or a simple native `<select>` for the filter/sort dropdowns (project already depends on `@radix-ui/react-select` — reuse the shadcn `Select` if present in `src/components/ui`, otherwise a plain `<select>`).

## Global Constraints

- Google Places API (New) Place Details returns at most 5 reviews and no star-rating breakdown — do not attempt to fetch or display more than what the API returns, and do not build a star-histogram UI.
- No new route/page — all work stays inside `GoogleReviewsCarousel.tsx` and its two existing mount points (`src/pages/Index.tsx:31`, `src/pages/ProductDetail.tsx:708`).
- Never fabricate rating/review data. If no cached data exists and the fetch fails, the component renders nothing (`null`).
- Do not display "Local Guide" badges, reviewer review/photo counts, "NEW" tags, or attached review photos — the API does not provide them.
- `localStorage` cache TTL is 12 hours.
- Env vars: `VITE_GOOGLE_PLACES_API_KEY`, `VITE_GOOGLE_PLACE_ID`.
- This project has no test runner configured (no vitest/jest in `package.json`). "Tests" in this plan mean manual verification via the Vite dev server and browser devtools, not automated unit tests — do not introduce a new test framework as part of this work.
- Leave `src/components/reviews-list.ts`, the `public/reviews` screenshot images, and the `reviewsGeneratorPlugin` in `vite.config.ts` untouched — only remove the *import* of `reviews-list.ts` from `GoogleReviewsCarousel.tsx`.

---

## Task 1: Google Places data-fetching module with localStorage caching

**Files:**
- Create: `src/lib/googlePlaces.ts`
- Modify: `.env` (add two keys, values left blank/placeholder — the user fills in real values)
- Modify: `.env.example` (create if it doesn't exist, otherwise add the two keys) — check first with `Read` whether `.env.example` exists; if not, create it with placeholder values only (never copy real secrets into `.env.example`)

**Interfaces:**
- Produces:
  ```ts
  export interface GoogleReview {
    id: string;
    authorName: string;
    authorPhotoUrl: string | null;
    rating: number; // 1-5
    text: string;
    relativeTime: string; // e.g. "2 days ago"
    publishTime: string; // ISO 8601, for sorting
  }

  export interface PlaceReviewsData {
    rating: number;
    totalReviews: number;
    reviews: GoogleReview[];
  }

  export async function fetchPlaceReviews(): Promise<PlaceReviewsData>;
  ```
  `fetchPlaceReviews` throws an `Error` on any failure (network error, non-2xx response, missing env vars, malformed JSON) — it never returns partial/fabricated data. It reads/writes the `localStorage` cache internally (see Step 3), so callers just call it and get either fresh, cached, or thrown.

- [ ] **Step 1: Write `.env` and `.env.example` entries**

Read the existing `.env` file first to see its current contents, then add:

```
VITE_GOOGLE_PLACES_API_KEY=
VITE_GOOGLE_PLACE_ID=
```

If `.env.example` exists, add the same two keys (still blank) in the same place. If it doesn't exist, skip creating one — this repo doesn't currently have one for the Shopify vars either, so don't introduce a new convention unprompted. (Check with `Glob` for `.env.example` first.)

- [ ] **Step 2: Create the module with the fetch function (no caching yet)**

```ts
// src/lib/googlePlaces.ts

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

const CACHE_KEY = "google-place-reviews-cache-v1";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

interface GooglePlaceApiReview {
  name: string;
  rating: number;
  text?: { text: string };
  relativePublishTimeDescription: string;
  publishTime: string;
  authorAttribution?: {
    displayName: string;
    photoUri?: string;
  };
}

interface GooglePlaceApiResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: GooglePlaceApiReview[];
}

function mapReview(r: GooglePlaceApiReview): GoogleReview {
  return {
    id: r.name,
    authorName: r.authorAttribution?.displayName ?? "Google User",
    authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
    rating: r.rating,
    text: r.text?.text ?? "",
    relativeTime: r.relativePublishTimeDescription,
    publishTime: r.publishTime,
  };
}

async function fetchFromApi(): Promise<PlaceReviewsData> {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined;
  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID as string | undefined;

  if (!apiKey || !placeId) {
    throw new Error("Missing VITE_GOOGLE_PLACES_API_KEY or VITE_GOOGLE_PLACE_ID");
  }

  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "rating,userRatingCount,reviews",
    },
  });

  if (!response.ok) {
    throw new Error(`Google Places API request failed: ${response.status}`);
  }

  const data = (await response.json()) as GooglePlaceApiResponse;

  return {
    rating: data.rating ?? 0,
    totalReviews: data.userRatingCount ?? 0,
    reviews: (data.reviews ?? []).map(mapReview),
  };
}

export async function fetchPlaceReviews(): Promise<PlaceReviewsData> {
  return fetchFromApi();
}
```

- [ ] **Step 3: Add localStorage caching with 12h TTL and fallback-to-stale-on-error**

Replace the final `fetchPlaceReviews` export with a caching wrapper:

```ts
interface CacheEnvelope {
  fetchedAt: number;
  data: PlaceReviewsData;
}

function readCache(): CacheEnvelope | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEnvelope;
  } catch {
    return null;
  }
}

function writeCache(data: PlaceReviewsData): void {
  try {
    const envelope: CacheEnvelope = { fetchedAt: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(envelope));
  } catch {
    // localStorage unavailable (e.g. private browsing quota) — non-fatal
  }
}

export async function fetchPlaceReviews(): Promise<PlaceReviewsData> {
  const cached = readCache();
  const isFresh = cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS;

  if (isFresh) {
    return cached.data;
  }

  try {
    const fresh = await fetchFromApi();
    writeCache(fresh);
    return fresh;
  } catch (err) {
    if (cached) {
      return cached.data;
    }
    throw err;
  }
}
```

- [ ] **Step 4: Manual verification — cold fetch, cache hit, and stale-cache fallback**

Run: `npm run dev`

In the browser console at `http://localhost:5173`, with real `VITE_GOOGLE_PLACES_API_KEY`/`VITE_GOOGLE_PLACE_ID` values set in `.env` (restart `npm run dev` after editing `.env`):

```js
const { fetchPlaceReviews } = await import("/src/lib/googlePlaces.ts");
console.log(await fetchPlaceReviews());
```

Expected: logs an object with a real `rating`, `totalReviews`, and a `reviews` array of up to 5 entries with real names/text.

Run it again immediately — expected: same data returned, and in the Network tab no new request to `places.googleapis.com` was made (served from cache).

Then in the console: `localStorage.setItem("google-place-reviews-cache-v1", JSON.stringify({ fetchedAt: Date.now() - 13 * 60 * 60 * 1000, data: (JSON.parse(localStorage.getItem("google-place-reviews-cache-v1"))).data }))` to force the cache stale, then call `fetchPlaceReviews()` again — expected: a new network request fires and a fresh response is cached.

- [ ] **Step 5: Commit**

```bash
git add src/lib/googlePlaces.ts .env
git commit -m "feat: add Google Places API fetch module with localStorage caching"
```

---

## Task 2: `useGoogleReviews` React Query hook

**Files:**
- Create: `src/hooks/useGoogleReviews.ts`

**Interfaces:**
- Consumes: `fetchPlaceReviews(): Promise<PlaceReviewsData>` and the `GoogleReview`/`PlaceReviewsData` types from `src/lib/googlePlaces.ts` (Task 1).
- Produces:
  ```ts
  export function useGoogleReviews(): {
    rating: number;
    totalReviews: number;
    reviews: GoogleReview[]; // [] while loading/on error
    isLoading: boolean;
    isError: boolean;
  };
  ```

- [ ] **Step 1: Implement the hook**

```ts
// src/hooks/useGoogleReviews.ts
import { useQuery } from "@tanstack/react-query";
import { fetchPlaceReviews, type GoogleReview } from "@/lib/googlePlaces";

const STALE_TIME_MS = 12 * 60 * 60 * 1000; // matches googlePlaces.ts cache TTL

export function useGoogleReviews() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["google-place-reviews"],
    queryFn: fetchPlaceReviews,
    staleTime: STALE_TIME_MS,
    retry: 1,
  });

  return {
    rating: data?.rating ?? 0,
    totalReviews: data?.totalReviews ?? 0,
    reviews: (data?.reviews ?? []) as GoogleReview[],
    isLoading,
    isError,
  };
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`

Temporarily add `console.log(useGoogleReviews())` inside any already-mounted component (e.g. paste at the top of `GoogleReviewsCarousel`'s function body — do not commit this line, it's just to verify the hook before Task 3 rewrites that file), reload the page, and confirm the console shows `isLoading: true` then a follow-up render with real `rating`/`totalReviews`/`reviews`. Remove the temporary `console.log` before moving on.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useGoogleReviews.ts
git commit -m "feat: add useGoogleReviews React Query hook"
```

---

## Task 3: Rewrite `GoogleReviewsCarousel.tsx` to use live data

**Files:**
- Modify: `src/components/GoogleReviewsCarousel.tsx` (full rewrite of the file body; the export name `GoogleReviewsCarousel` and its zero-argument signature stay the same so `Index.tsx:31` and `ProductDetail.tsx:708` need no changes)

**Interfaces:**
- Consumes: `useGoogleReviews()` from `src/hooks/useGoogleReviews.ts` (Task 2); `Avatar`, `AvatarImage`, `AvatarFallback` from `src/components/ui/avatar.tsx`.
- Produces: `export const GoogleReviewsCarousel: () => JSX.Element | null` — same public shape as before (default export was never used; existing imports use the named export, unchanged).

- [ ] **Step 1: Write the new component**

Uses plain native `<select>` elements (styled with Tailwind to match the existing card's rounded/bordered look) for the two dropdowns rather than the shadcn `Select` — simpler, no extra dependency wiring, and native `<select>` is fully sufficient for two flat option lists.

Replace the entire contents of `src/components/GoogleReviewsCarousel.tsx`. This version assumes `src/components/ui/select.tsx` exists (swap the `<select>` block for native elements per Step 1 if it doesn't):

```tsx
import { useCallback, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { useGoogleReviews } from '@/hooks/useGoogleReviews';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { GoogleReview } from '@/lib/googlePlaces';

type StarFilter = 'all' | 1 | 2 | 3 | 4 | 5;
type SortMode = 'newest' | 'highest';

function ReviewCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#1c2418] p-5 h-[180px] animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-white/10" />
        <div className="flex-1">
          <div className="h-3 w-24 bg-white/10 rounded mb-2" />
          <div className="h-2 w-16 bg-white/10 rounded" />
        </div>
      </div>
      <div className="h-2 w-full bg-white/10 rounded mb-2" />
      <div className="h-2 w-4/5 bg-white/10 rounded" />
    </div>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 140;
  const displayText = expanded || !isLong ? review.text : `${review.text.slice(0, 140)}...`;
  const initial = review.authorName.charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl bg-[#1c2418] p-5 h-full flex flex-col gap-3 shadow-md">
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9">
          {review.authorPhotoUrl && <AvatarImage src={review.authorPhotoUrl} alt={review.authorName} />}
          <AvatarFallback className="bg-[#4f7a2e] text-white text-sm font-semibold">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{review.authorName}</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < review.rating ? 'fill-[#f5a623] text-[#f5a623]' : 'fill-transparent text-white/20'}`}
              />
            ))}
            <span className="text-xs text-white/50 ml-1">{review.relativeTime}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-white/80 leading-relaxed flex-1">
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[#8fc95a] font-semibold ml-1 hover:underline"
          >
            {expanded ? 'Less' : 'More'}
          </button>
        )}
      </p>
    </div>
  );
}

export const GoogleReviewsCarousel = () => {
  const { rating, totalReviews, reviews, isLoading, isError } = useGoogleReviews();
  const [starFilter, setStarFilter] = useState<StarFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  const autoplay = Autoplay({ delay: 2800, stopOnInteraction: false, stopOnMouseEnter: true });
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [autoplay]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const visibleReviews = useMemo(() => {
    let result = reviews;
    if (starFilter !== 'all') {
      result = result.filter((r) => r.rating === starFilter);
    }
    result = [...result].sort((a, b) => {
      if (sortMode === 'highest') return b.rating - a.rating;
      return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
    });
    return result;
  }, [reviews, starFilter, sortMode]);

  if (isError && reviews.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="pt-10 md:pt-14 pb-4 px-4 bg-[#f9f6f0]">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4f7a2e]">Google Reviews</p>
              <div className="flex items-center gap-1 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'fill-[#f5a623] text-[#f5a623]' : 'fill-transparent text-[#f5a623]/30'}`}
                  />
                ))}
                <span className="text-sm font-bold text-[#2a3625] ml-1">{rating.toFixed(1)}</span>
                <span className="text-xs text-[#6a7462] ml-1">· {totalReviews.toLocaleString()}+ reviews</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={starFilter === 'all' ? 'all' : String(starFilter)}
              onChange={(e) => setStarFilter(e.target.value === 'all' ? 'all' : (Number(e.target.value) as StarFilter))}
              className="text-xs font-semibold text-[#2a3625] bg-white border border-[#2a3625]/10 rounded-full px-3 py-1.5"
              aria-label="Filter by rating"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="text-xs font-semibold text-white bg-[#2a3625] rounded-full px-3 py-1.5"
              aria-label="Sort reviews"
            >
              <option value="newest">Latest Ratings</option>
              <option value="highest">Highest Ratings</option>
            </select>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={scrollPrev}
                className="w-9 h-9 rounded-full border border-[#2a3625]/10 bg-white flex items-center justify-center text-[#2a3625] hover:bg-[#2a3625] hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                className="w-9 h-9 rounded-full border border-[#2a3625]/10 bg-white flex items-center justify-center text-[#2a3625] hover:bg-[#2a3625] hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 md:gap-4">
            {isLoading &&
              [...Array(4)].map((_, index) => (
                <div key={index} className="flex-[0_0_80%] sm:flex-[0_0_46%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0">
                  <ReviewCardSkeleton />
                </div>
              ))}
            {!isLoading &&
              visibleReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-[0_0_80%] sm:flex-[0_0_46%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
          </div>
        </div>

        {/* Mobile swipe hint */}
        {!isLoading && visibleReviews.length > 0 && (
          <p className="text-center text-xs text-[#6a7462]/60 mt-4 md:hidden">Swipe to see more reviews</p>
        )}
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Remove the now-unused `reviews-list.ts` import elsewhere in the file (verify none remains)**

Run: `grep -n "reviews-list" src/components/GoogleReviewsCarousel.tsx` (Bash tool) — expected: no output, confirming the rewrite in Step 2 already dropped the import.

- [ ] **Step 3: Manual verification in both mount points**

Run: `npm run dev`, then in the browser:
1. Visit `http://localhost:5173/` — confirm the "Google Reviews" section (below the hero/social proof bar) shows the real average rating and review count in the header, real reviewer cards in the carousel, and prev/next buttons still scroll it.
2. Visit any product detail page — confirm the same live section renders there too.
3. Use the "All Ratings" and "Latest Ratings" dropdowns — confirm the visible cards filter/reorder accordingly, without a network request firing (check devtools Network tab — filtering/sorting must not refetch).
4. Click "More" on a long review — confirm it expands/collapses the text.
5. Temporarily set `VITE_GOOGLE_PLACE_ID` in `.env` to an invalid value, clear `localStorage`, restart `npm run dev`, and reload — confirm the section disappears entirely (renders nothing) rather than showing a broken/empty box. Then restore the real `VITE_GOOGLE_PLACE_ID` value and restart the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/GoogleReviewsCarousel.tsx
git commit -m "feat: drive GoogleReviewsCarousel from live Google Places API data"
```

---

## Task 4: Type-check and build verification

**Files:** none (verification only)

- [ ] **Step 1: Run the TypeScript/lint check**

Run: `npm run lint`
Expected: no new errors introduced by the three changed/added files (pre-existing unrelated errors, if any, are out of scope).

- [ ] **Step 2: Run a production build**

Run: `npm run build`
Expected: build succeeds; confirms `import.meta.env.VITE_GOOGLE_PLACES_API_KEY`/`VITE_GOOGLE_PLACE_ID` usage and the rewritten component compile cleanly for production, matching how the Docker build (`Dockerfile`) and Netlify build actually produce the deployed bundle.

- [ ] **Step 3: Commit (only if Steps 1-2 required fixes)**

If lint or build required any fixes, stage and commit them:

```bash
git add -A
git commit -m "fix: resolve lint/build issues in Google reviews integration"
```

If no fixes were needed, skip this step — nothing to commit.
