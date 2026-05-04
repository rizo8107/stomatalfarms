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
  <section className="py-12 md:py-16 px-4 bg-[#fffbf5]">
    <div className="max-w-7xl mx-auto">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#6a7462] text-center mb-3">
        ✦ Customer Reviews
      </p>
      <h2
        className="text-center text-2xl md:text-4xl text-[#1e2519] mb-2"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
      >
        Real people. Real rituals.
      </h2>
      <p className="text-center text-sm text-[#6a7462] mb-8 font-light">
        Rated 4.9 ★ by 1,200+ customers across India
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="rounded-2xl p-5 md:p-6 flex flex-col gap-3 border"
            style={{ background: "#f7f1e8", borderColor: "rgba(46,63,37,0.10)" }}
          >
            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: r.stars }).map((_, i) => (
                <span key={i} style={{ color: "#c9a05a" }}>★</span>
              ))}
            </div>

            {/* Review text */}
            <p className="text-sm text-[#1e2519] leading-relaxed font-light flex-1">
              "{r.text}"
            </p>

            {/* Reviewer */}
            <div className="flex items-center gap-3 pt-2 border-t border-[rgba(46,63,37,0.10)]">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
              >
                {r.initial}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1e2519]">{r.name}</p>
                <p className="text-xs text-[#6a7462]">{r.location}</p>
              </div>
              <span
                className="ml-auto text-[10px] font-bold text-[#4f7a2e] px-2 py-1 rounded-full"
                style={{ background: "rgba(79,122,46,0.10)" }}
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
