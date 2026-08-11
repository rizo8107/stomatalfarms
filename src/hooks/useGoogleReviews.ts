import { useQuery } from "@tanstack/react-query";
import { fetchPlaceReviews, type GoogleReview } from "@/lib/googlePlaces";

const STALE_TIME_MS = 60 * 60 * 1000; // InsForge data itself only refreshes once a day; an hour keeps this responsive to same-day edits without refetching on every render

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
