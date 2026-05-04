import { Link } from "react-router-dom";

const pillBadges = [
  "🌿 100% Natural",
  "🚫 No Chemicals",
  "🤲 Prayer-ready",
  "🎁 Gift-perfect",
  "🚚 Free Ship ₹599+",
];

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "88vw", maxHeight: 700 }}>
      {/* Full-bleed hero image */}
      <img
        src="/aurora.jfif"
        alt="Aurora Aromatic Wellness"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ minHeight: "88vw", maxHeight: 700 }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(20,28,15,0.10) 0%, rgba(20,28,15,0.72) 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-5 pb-8 pt-24 md:pt-32 md:pb-14 max-w-2xl mx-auto md:mx-0 md:ml-16">
        {/* Collection badge */}
        <span
          className="inline-block mb-3 text-xs font-bold uppercase tracking-widest text-white/80 border border-white/25 rounded-full px-4 py-1.5 w-fit"
          style={{ backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.08)" }}
        >
          ✦ Aurora Collection
        </span>

        <h1
          className="text-white mb-3 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 7vw, 3.25rem)", fontWeight: 600 }}
        >
          Calm, fragrance &amp;<br />intention — daily.
        </h1>
        <p className="text-white/80 text-sm md:text-base font-light mb-6 max-w-sm leading-relaxed">
          Natural aromatic wellness for prayer, gifting &amp; everyday rituals.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 mb-7">
          <Link
            to="/collections"
            className="inline-flex items-center px-7 py-3 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
          >
            Shop Aurora
          </Link>
          <Link
            to="/collections?category=combos"
            className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold text-white border border-white/40 transition-all hover:bg-white/10 active:scale-95"
            style={{ backdropFilter: "blur(4px)" }}
          >
            View Combos ₹999
          </Link>
        </div>

        {/* Pill badges */}
        <div className="flex flex-wrap gap-2">
          {pillBadges.map((b) => (
            <span
              key={b}
              className="text-[11px] font-medium text-white/90 rounded-full px-3 py-1 border border-white/20"
              style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(4px)" }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
