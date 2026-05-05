import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const stats = [
  { value: "4.9★", label: "Avg. Rating" },
  { value: "100+", label: "Happy Homes" },
  { value: "100%", label: "Natural · Lab Tested" },
  { value: "5+", label: "Yrs of Craft" },
];

const HeroSection = () => (
  <section
    className="relative w-full overflow-hidden bg-[#1a2416]"
    style={{ height: "100svh", maxHeight: 720 }}
  >
    {/* Background */}
    <div className="absolute inset-0 scale-105">
      <img
        src="/aurora.jfif"
        alt="Aurora Aromatic Wellness"
        className="w-full h-full object-cover object-center opacity-65"
      />
    </div>
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(to right, rgba(15,22,10,0.92) 0%, rgba(15,22,10,0.55) 55%, rgba(15,22,10,0.15) 100%), linear-gradient(to top, rgba(15,22,10,0.7) 0%, transparent 50%)",
      }}
    />

    {/* Main content */}
    <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-center pt-20 pb-6">
      {/* Top badge row */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">
          Aurora by Stomatal Farms
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-[#f5c842] text-[#f5c842]" />
          ))}
          <span className="text-[10px] font-bold text-white/80 ml-1">4.9 · 1,200+ verified</span>
        </div>
      </div>

      {/* Headline */}
      <h1
        className="text-white leading-[1.05] tracking-tight mb-5 max-w-2xl"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2.8rem, 8vw, 5rem)",
          fontWeight: 600,
        }}
      >
        Natural Incense.<br />
        <span className="italic text-[#a8c690]">No Chemicals.</span><br />
        No Compromise.
      </h1>

      {/* Sub-headline */}
      <p
        className="text-white/60 mb-3 max-w-md leading-snug"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
          fontStyle: "italic",
          fontWeight: 400,
        }}
      >
        Cow dung-based incense. A{" "}
        <span className="text-[#a8c690] not-italic font-semibold">divine</span> aroma — drawn from
        hydrodistilled botanical essence.
      </p>

      <p className="text-white/50 text-sm font-light max-w-sm mb-8 leading-relaxed">
        Sacred Gomaya base, natural ignition — no charcoal, no synthetics. Light it once and let
        the divine aroma fill every corner of your home. Trusted in 1,200+ Indian homes.
      </p>

      {/* CTAs */}
      <div className="flex flex-row flex-wrap gap-3 mb-10">
        <Link
          to="/collections"
          className="group inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5"
          style={{ background: "#b56c3d" }}
        >
          Shop Aurora →
        </Link>
        <Link
          to="/collections?category=combos"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white border border-white/25 backdrop-blur-md transition-all hover:bg-white/10"
        >
          View Ritual Bundle
        </Link>
      </div>

      {/* Stats strip */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 pb-2 border-t border-white/10 pt-6">
        {stats.map((s, i) => (
          <div key={s.label} className="flex items-start gap-4">
            {i > 0 && <div className="hidden sm:block w-px h-8 bg-white/10 self-center" />}
            <div>
              <p
                className="text-white font-semibold leading-none mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}
              >
                {s.value}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

  </section>
);

export default HeroSection;
