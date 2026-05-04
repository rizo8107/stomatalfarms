import { Link } from "react-router-dom";

const FinalCTA = () => (
  <section
    className="py-14 md:py-20 px-4 text-center relative overflow-hidden"
    style={{ background: "linear-gradient(135deg, #2e4e18 0%, #4f7a2e 100%)" }}
  >
    {/* Subtle decorative circles */}
    <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full opacity-10 bg-white" />
    <div className="absolute -bottom-16 -right-10 w-64 h-64 rounded-full opacity-10 bg-white" />

    <div className="relative z-10 max-w-xl mx-auto">
      <span className="inline-block mb-4 text-xs font-bold uppercase tracking-widest text-white/70 border border-white/25 rounded-full px-4 py-1.5">
        ✦ Aurora Collection
      </span>
      <h2
        className="text-white text-3xl md:text-5xl mb-4 leading-snug"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
      >
        Begin your aromatic<br />ritual today.
      </h2>
      <p className="text-white/75 text-sm md:text-base font-light mb-8 leading-relaxed">
        Natural, beautiful, and made for Indian homes.<br />Every order ships with love.
      </p>

      <Link
        to="/collections"
        className="inline-flex items-center px-10 py-4 rounded-full text-sm font-black text-[#1e2519] bg-[#f7f1e8] shadow-lg hover:bg-white transition-all active:scale-95"
      >
        Shop stomatalfarms.com →
      </Link>

      <p className="mt-5 text-white/55 text-xs font-medium tracking-wide">
        Free shipping above ₹599 · Gift packaging available
      </p>
    </div>
  </section>
);

export default FinalCTA;
