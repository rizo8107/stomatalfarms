
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
  const response = await fetch("/api/reviews");
  if (!response.ok) {
    throw new Error(`Failed to fetch place reviews: ${response.statusText}`);
  }

  const data = await response.json() as {
    rating: number;
    totalReviews: number;
    reviews: GoogleReviewRow[];
  };

  return {
    rating: data.rating,
    totalReviews: data.totalReviews,
    reviews: (data.reviews ?? []).map(mapRow),
  };
}
