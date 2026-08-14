import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Instagram } from 'lucide-react';

const instagramMedia = [
  { type: 'image', url: '/instagram/1.jpg' },
  { type: 'image', url: '/instagram/2.jpg' },
  { type: 'image', url: '/instagram/3.jpg' },
  { type: 'image', url: '/instagram/4.jpg' },
  { type: 'image', url: '/instagram/5.jpg' },
  { type: 'video', url: '/instagram/6.mp4' },
];

export const InstagramCarousel = () => {
  const autoplay = Autoplay({ delay: 3200, stopOnInteraction: false, stopOnMouseEnter: true });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', skipSnaps: false },
    [autoplay]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-24 md:py-32 px-4 bg-[#fffbf5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5c6e58] mb-4 flex items-center justify-center gap-3">
            <Instagram className="w-4 h-4" />
            Join our community
          </p>
          <h2
            className="text-3xl md:text-5xl text-[#2a3625] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            Aromatics in real life.
          </h2>
          <p className="text-[#6a7462] font-light max-w-lg mx-auto">
            See how our community uses Aurora to transform their daily rituals. Tag us @stomatalfarms to be featured.
          </p>
        </div>

        <div className="relative group">
          <div className="overflow-hidden rounded-[40px]" ref={emblaRef}>
            <div className="flex -ml-4 md:-ml-8">
              {instagramMedia.map((media, index) => (
                <div key={index} className="flex-[0_0_85%] min-w-0 pl-4 md:flex-[0_0_35%] md:pl-8">
                  <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-xl border border-[#2e3f25]/5 group/item">
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={`Instagram post ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Instagram className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="hidden md:flex absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md items-center justify-center text-[#2a3625] shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md items-center justify-center text-[#2a3625] shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            onClick={scrollNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {instagramMedia.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#5c6e58]/20" />
          ))}
        </div>
      </div>
    </section>
  );
};
