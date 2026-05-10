import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const stats = [
  { value: "4.7★", label: "Avg. Rating" },
  { value: "1,200+", label: "Happy Homes" },
  { value: "100%", label: "Natural" },
  { value: "5+", label: "Yrs of Craft" },
];

const HeroSection = () => (
  <section className="relative w-full overflow-hidden bg-[#1a2416]">
    {/* Background */}
    <div className="absolute inset-0">
      <img
        src="https://cdn.shopify.com/s/files/1/0735/4469/5965/files/banner_hero.jpg?v=1778374221"
        alt="Aurora Aromatic Wellness"
        className="w-full h-full object-cover object-center scale-105"
      />
    </div>
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(to right, rgba(15,22,10,0.85) 0%, rgba(15,22,10,0.45) 55%, rgba(15,22,10,0.08) 100%), linear-gradient(to top, rgba(15,22,10,0.6) 0%, transparent 50%)",
      }}
    />

    {/* Main content */}
    <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 py-6 md:py-10 flex flex-col gap-4 md:gap-6">

      {/* Row 1: Logo + Heading & Stars */}
      <div className="flex flex-row items-center gap-3 md:gap-6">
        <img
          src="/aurora-logo.png"
          alt="Aurora by Stomatal Farms"
          className="h-28 w-28 md:h-40 md:w-40 object-contain flex-shrink-0"
        />

        <div className="flex flex-col gap-2">
          <h1
            className="text-white leading-[1.08] tracking-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.5rem, 3.2vw, 2.8rem)",
              fontWeight: 600,
            }}
          >
            Natural Incense.<br />
            <span className="italic text-[#a8c690]">No Chemicals.</span><br />
            No Compromise.
          </h1>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm whitespace-nowrap w-fit">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-[#f5c842] text-[#f5c842]" />
            ))}
            <span className="text-[9px] font-bold text-white/80 ml-1">4.7 · 1,200+ verified</span>
          </div>
        </div>
      </div>

      {/* Row 2: Sub-headline + description */}
      <div className="flex flex-col gap-1.5">
        <p
          className="text-white/60 max-w-xs md:max-w-sm leading-snug"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          From cow dung to <span className="text-[#a8c690] not-italic font-semibold">divine</span> aroma — the way nature intended.
        </p>
        <p className="text-white/50 text-[11px] font-light max-w-xs leading-relaxed">
          Pure. Sacred. Trusted by 1,200+ homes. No charcoal. No synthetics. Ever.
        </p>
      </div>

      {/* Row 3: Buttons */}
      <div className="flex flex-row gap-3 flex-nowrap">
        <Link
          to="/collections"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 whitespace-nowrap"
          style={{ background: "#b56c3d" }}
        >
          Shop Aurora
        </Link>
        <Link
          to="/collections?category=combos"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white border border-white/25 backdrop-blur-md transition-all hover:bg-white/10 whitespace-nowrap"
        >
          View Ritual Bundle
        </Link>
      </div>

      {/* Row 4: Stats strip */}
      <div className="flex items-center border-t border-white/15 pt-3 overflow-x-auto scrollbar-hide">
        {stats.map((s, i) => (
          <div key={s.label} className="flex items-center flex-shrink-0">
            {i > 0 && <div className="w-px h-6 bg-white/15 mx-4 md:mx-6" />}
            <div className="flex flex-col gap-0.5">
              <p
                className="font-bold leading-none text-[#a8c690]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem" }}
              >
                {s.value}
              </p>
              <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-white/40 whitespace-nowrap">
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
