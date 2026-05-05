import { Star } from 'lucide-react';

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
];

const Reviews = () => (
  <section className="py-16 md:py-24 px-4 bg-[#fcfaf7]">
    <div className="max-w-6xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="rounded-[32px] p-8 md:p-10 flex flex-col gap-6 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md border border-[#f1eae0]"
          >
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
                className="ml-auto text-[10px] font-bold text-[#5c6e58] px-3 py-1 rounded-full uppercase tracking-wider"
                style={{ background: "rgba(92,110,88,0.08)" }}
              >
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
