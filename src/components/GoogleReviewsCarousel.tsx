import { useCallback, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { useGoogleReviews } from '@/hooks/useGoogleReviews';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { GoogleReview } from '@/lib/googlePlaces';

type StarFilter = 'all' | 1 | 2 | 3 | 4 | 5;
type SortMode = 'newest' | 'highest';

const AVATAR_COLORS = [
  'bg-[#4285F4]', // blue
  'bg-[#9c6ade]', // purple
  'bg-[#0f9d8f]', // teal
  'bg-[#ea4335]', // red
  'bg-[#f5a623]', // amber
  'bg-[#34a853]', // green
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + second).toUpperCase();
}

function ReviewCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-[#2a3625]/10 p-5 h-[180px] animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-[#2a3625]/10" />
        <div className="flex-1">
          <div className="h-3 w-24 bg-[#2a3625]/10 rounded mb-2" />
          <div className="h-2 w-16 bg-[#2a3625]/10 rounded" />
        </div>
      </div>
      <div className="h-2 w-full bg-[#2a3625]/10 rounded mb-2" />
      <div className="h-2 w-4/5 bg-[#2a3625]/10 rounded" />
    </div>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 140;
  const displayText = expanded || !isLong ? review.text : `${review.text.slice(0, 140)}...`;

  return (
    <div className="rounded-2xl bg-white border border-[#2a3625]/10 p-5 h-full flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9">
          {review.authorPhotoUrl && <AvatarImage src={review.authorPhotoUrl} alt={review.authorName} />}
          <AvatarFallback className={`${avatarColor(review.authorName)} text-white text-xs font-semibold`}>
            {initials(review.authorName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1a1f16] truncate">{review.authorName}</p>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < review.rating ? 'fill-[#f5a623] text-[#f5a623]' : 'fill-transparent text-[#2a3625]/15'}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-[#5b6455] leading-relaxed flex-1">
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[#4f7a2e] font-semibold ml-1 hover:underline"
          >
            {expanded ? 'Less' : 'More'}
          </button>
        )}
      </p>
      <div className="border-t border-[#2a3625]/10 pt-3">
        <span className="text-xs text-[#8a927f]">{review.relativeTime}</span>
      </div>
    </div>
  );
}

export const GoogleReviewsCarousel = () => {
  const { rating, totalReviews, reviews, isLoading, isError } = useGoogleReviews();
  const [starFilter, setStarFilter] = useState<StarFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  const autoplay = Autoplay({ delay: 2800, stopOnInteraction: false, stopOnMouseEnter: true });
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false, duration: 25 },
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
