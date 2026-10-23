import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface InstagramPost {
  type: 'image' | 'video';
  url: string;
  hasPlay?: boolean;
  alt: string;
}

const instagramMedia: InstagramPost[] = [
  {
    type: 'image',
    url: '/instagram/1.jpg',
    hasPlay: true,
    alt: 'Aurora floral incense sticks in sunlight',
  },
  {
    type: 'image',
    url: '/instagram/2.jpg',
    hasPlay: false,
    alt: "Yes it's made of cow dung incense cups",
  },
  {
    type: 'image',
    url: '/instagram/3.jpg',
    hasPlay: true,
    alt: 'Aurora incense for festive Thamboolam and Golu celebrations',
  },
  {
    type: 'image',
    url: '/instagram/4.jpg',
    hasPlay: false,
    alt: 'Aurora natural aromatics collection',
  },
  {
    type: 'image',
    url: '/instagram/5.jpg',
    hasPlay: false,
    alt: 'Handcrafted cow dung incense sticks from Stomatal Farms',
  },
  {
    type: 'video',
    url: '/instagram/6.mp4',
    hasPlay: true,
    alt: 'Gentle smoke and calm burning ritual',
  },
];

export const InstagramCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const profileUrl = 'https://www.instagram.com/aurorarituals.store/';

  return (
    <section className="py-16 md:py-24 px-4 bg-[#FFFDF7] relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2
            className="text-3xl md:text-5xl text-[#1F3B2D] font-medium tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Join our community
          </h2>
        </div>

        {/* Carousel / Cards Row */}
        <div className="relative px-2 md:px-6">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-3 md:-ml-4">
              {instagramMedia.map((media, index) => (
                <div
                  key={index}
                  className="flex-[0_0_84%] sm:flex-[0_0_48%] md:flex-[0_0_33.3333%] min-w-0 pl-3 md:pl-4"
                >
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-black/5 bg-[#F2EDE4] group cursor-pointer"
                    aria-label={media.alt}
                  >
                    <img
                      src={media.url}
                      alt={media.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Centered Play Button Overlay for Reels/Videos */}
                    {media.hasPlay && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/85 backdrop-blur-sm shadow-md flex items-center justify-center pl-0.5 text-[#1F3B2D] group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                      </div>
                    )}

                    {/* Subtle Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            className="absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#1F3B2D] shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>
          <button
            type="button"
            className="absolute right-0 md:-right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#1F3B2D] shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 stroke-[2]" />
          </button>
        </div>

        {/* Handle Link */}
        <div className="text-center mt-10 md:mt-12">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[#1F3B2D] hover:text-[#2E7D4F] text-base md:text-lg font-medium tracking-wide underline underline-offset-8 decoration-1 decoration-[#1F3B2D] hover:decoration-[#2E7D4F] transition-colors"
          >
            @aurorarituals.store
          </a>
        </div>

        {/* Prompt Text */}
        <p className="text-center text-[#4F473F] text-sm md:text-base max-w-md mx-auto mt-6 mb-6 leading-relaxed">
          Follow along for new aromas, festive offers and a look inside the farm.
        </p>

        {/* Follow CTA Button */}
        <div className="text-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 min-h-[50px] bg-[#2E7D4F] hover:bg-[#236A40] text-white text-xs md:text-sm font-semibold tracking-[0.14em] uppercase rounded-sm shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 md:w-5 md:h-5"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="1" />
            </svg>
            <span>FOLLOW @AURORARITUALS.STORE</span>
          </a>
        </div>
      </div>
    </section>
  );
};

