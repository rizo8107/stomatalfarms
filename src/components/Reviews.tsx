import { Star } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const reviews = [
  {
    name: "Priya M.",
    location: "Mumbai",
    text: "The incense cups are incredible. My puja room smells divine every morning. Worth every rupee!",
    stars: 5,
    initial: "P",
  },
  {
    name: "Rajan K.",
    location: "Bangalore",
    text: "Bought the combo as a gift — beautifully packaged, arrived fast. Everyone loved it. Will reorder.",
    stars: 5,
    initial: "R",
  },
  {
    name: "Anita S.",
    location: "Delhi",
    text: "Ghee lamps are so pure. No smoke, just a beautiful warm glow and fragrance. Completely different from market brands.",
    stars: 5,
    initial: "A",
  },
  {
    name: "Vikram R.",
    location: "Chennai",
    text: "Authentic fragrance that isn't overpowering. The natural cow dung base really makes a difference in the quality of smoke.",
    stars: 5,
    initial: "V",
  },
  {
    name: "Meera G.",
    location: "Hyderabad",
    text: "Finally found chemical-free incense. The botanical essence is so calming for meditation. Truly a premium product.",
    stars: 5,
    initial: "M",
  },
];

const Reviews = () => {
  const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false });
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [autoplay]);

  return (
    <section className="py-16 md:py-24 px-4 bg-[#fcfaf7] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5c6e58] mb-4 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-[#5c6e58]/30"></span>
            Customer Stories
            <span className="w-8 h-[1px] bg-[#5c6e58]/30"></span>
          </p>
          <h2
            className="text-3xl md:text-5xl text-[#2a3625] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, letterSpacing: "-0.02em" }}
          >
            Real people. Real rituals.
          </h2>
          <p className="max-w-lg mx-auto text-[#6a7462] font-light md:text-lg">
            Join our community of over 1,200+ individuals finding daily calm.
          </p>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {reviews.map((r, index) => (
              <div
                key={index}
                className="flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_31%] min-w-0"
              >
                <div className="rounded-[32px] h-full p-8 md:p-10 flex flex-col gap-6 bg-white shadow-sm border border-[#f1eae0]">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-lg text-[#2a3625] leading-relaxed font-normal flex-1 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    "{r.text}"
                  </p>

                  {/* Reviewer */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[#f1eae0]">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-[#2a3625] text-lg font-medium flex-shrink-0 bg-[#f9f6f0] border border-[#e8e4dc]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {r.initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2a3625]">{r.name}</p>
                      <p className="text-xs text-[#8a9284]">{r.location}</p>
                    </div>
                    <span
                      className="ml-auto text-[10px] font-bold text-[#5c6e58] px-3 py-1 rounded-full uppercase tracking-wider hidden sm:block"
                      style={{ background: "rgba(92,110,88,0.08)" }}
                    >
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile swipe hint */}
        <p className="text-center text-xs text-[#6a7462]/60 mt-8 md:hidden italic">
          Swipe to explore more stories
        </p>
      </div>
    </section>
  );
};

export default Reviews;
