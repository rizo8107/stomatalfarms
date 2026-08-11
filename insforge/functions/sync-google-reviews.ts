const PLACE_ID = "ChIJ0WAVLno-pGcRr0yNSWn8bxA";
const APIFY_ACTOR = "compass~google-maps-reviews-scraper";
const AVATAR_BUCKET = "review-avatars";

// Google's profile photo URLs get blocked client-side by Chromium's Opaque
// Response Blocking (ORB) when hotlinked cross-origin, even with crossOrigin
// set, because Google's photo servers don't send the headers ORB requires.
// Downloading server-side (no browser involved, so ORB doesn't apply) and
// re-hosting in our own bucket is the only reliable fix. The object key is
// derived from the review id; PUT-to-an-existing-key still auto-renames
// instead of overwriting, so the existing object is deleted first (best
// effort) to avoid accumulating a renamed duplicate on every daily re-run.
async function rehostPhoto(
  baseUrl: string,
  apiKey: string,
  photoUrl: string,
  reviewId: string
): Promise<string | null> {
  try {
    const photoRes = await fetch(photoUrl);
    if (!photoRes.ok) return null;
    const blob = await photoRes.blob();

    const key = `${encodeURIComponent(reviewId)}.jpg`;

    await fetch(`${baseUrl}/api/storage/buckets/${AVATAR_BUCKET}/objects/${key}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiKey}` },
    }).catch(() => {});

    const form = new FormData();
    form.append("file", blob, key);

    const uploadRes = await fetch(
      `${baseUrl}/api/storage/buckets/${AVATAR_BUCKET}/objects/${key}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      }
    );
    if (!uploadRes.ok) return null;

    const data = (await uploadRes.json()) as { url: string };
    return data.url.startsWith("http") ? data.url : `${baseUrl}${data.url}`;
  } catch {
    return null;
  }
}

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
  const apifyToken = Deno.env.get("APIFY_TOKEN");

  try {
    if (!apifyToken) {
      throw new Error("Missing APIFY_TOKEN secret");
    }

    const apifyRes = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${apifyToken}`,
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
    const rawItems = (await apifyRes.json()) as Array<Record<string, unknown>>;

    if (rawItems.length === 0) {
      return jsonResponse({ synced: 0, message: "No reviews returned" }, 200);
    }

    // A single INSERT ... ON CONFLICT DO UPDATE cannot apply the same update
    // twice in one statement, so de-duplicate by review id first -- Apify
    // occasionally returns the same review twice within one run (e.g. at a
    // pagination boundary).
    const seen = new Set<string>();
    const items = rawItems.filter((item) => {
      const id = String(item.reviewId);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    const reviewRows = await Promise.all(
      items.map(async (item) => {
        const reviewId = String(item.reviewId);
        const photoUrl = item.reviewerPhotoUrl
          ? await rehostPhoto(baseUrl!, apiKey!, String(item.reviewerPhotoUrl), reviewId)
          : null;
        return {
          external_review_id: reviewId,
          author_name: String(item.name ?? "Google User"),
          author_photo_url: photoUrl,
          rating: Number(item.stars),
          review_text: String(item.text ?? ""),
          published_at: String(item.publishedAtDate),
        };
      })
    );

    const upsertRes = await fetch(`${baseUrl}/api/database/records/google_reviews?on_conflict=external_review_id`, {
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
