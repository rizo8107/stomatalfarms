import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { reviews } from './reviews-list';

export const GoogleReviewsCarousel = () => {
  const autoplay = Autoplay({ delay: 2800, stopOnInteraction: false, stopOnMouseEnter: true });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [autoplay]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="pt-10 md:pt-14 pb-4 px-4 bg-[#f9f6f0]">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            {/* Google G logo */}
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
                  <Star key={i} className="w-3.5 h-3.5 fill-[#f5a623] text-[#f5a623]" />
                ))}
                <span className="text-sm font-bold text-[#2a3625] ml-1">4.7</span>
                <span className="text-xs text-[#6a7462] ml-1">· 1,200+ reviews</span>
              </div>
            </div>
          </div>

          {/* Nav buttons — desktop */}
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

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 md:gap-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex-[0_0_80%] sm:flex-[0_0_46%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0"
              >
                <div className="rounded-2xl overflow-hidden shadow-md border border-[#2e3f25]/5 bg-white isolate">
                  <img
                    src={review.src}
                    alt={review.alt}
                    className="w-full h-auto object-contain block"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile swipe hint */}
        <p className="text-center text-xs text-[#6a7462]/60 mt-4 md:hidden">Swipe to see more reviews</p>
      </div>
    </section>
  );
};
