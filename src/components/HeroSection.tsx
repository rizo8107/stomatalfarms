import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuroraTrustBadges from "@/components/AuroraTrustBadges";
import FreshProduceTrustBadges from "@/components/FreshProduceTrustBadges";

const HeroSection = () => {
  return (
    <section className="pt-2 md:pt-16 pb-20 md:pb-32 bg-secondary relative">
      <div className="container px-3 md:px-4">
        {/* Two Column Layout with Cards and Trust Badges */}
        <div className="grid grid-cols-2 gap-3 md:gap-8">
          {/* Column 1 - Aurora */}
          <div className="space-y-6">
            {/* Card 1 - Aurora */}
            <Link 
              to="/collections?category=all"
              className="group relative block overflow-hidden rounded-2xl aspect-[1/1.1] sm:aspect-[4/5] md:aspect-[5/6] lg:aspect-[6/7] animate-fade-in-up border border-border/10 shadow-xl cursor-pointer"
            >
              <img
                src="/aurora.jfif"
                alt="Aurora - Aromatic Wellness"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-start p-3 md:p-6 lg:p-7">
                <span className="text-warm-white/70 text-[9px] md:text-[10px] uppercase tracking-[0.12em] md:tracking-[0.15em] mb-0.5 md:mb-1">
                  Aurora
                </span>
                <h1 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl text-warm-white mb-1 md:mb-2 leading-tight">
                  Aromatic Wellness
                </h1>
                <p className="text-warm-white/80 text-[10px] md:text-xs mb-2 md:mb-3 max-w-[150px] md:max-w-[200px] leading-relaxed hidden sm:block">
                  A curated range of incense, bath salts, and self-care essentials.
                </p>
                <div className="space-y-1.5">
                  <div className="w-fit text-[10px] md:text-xs bg-warm-white text-earth hover:bg-warm-white/90 px-3 md:px-4 py-1.5 md:py-2 h-auto rounded-full font-bold inline-flex items-center justify-center transition-colors">
                    Shop Aurora
                  </div>
                </div>
              </div>
            </Link>

            <p className="text-white text-[10px] md:text-xs text-center font-medium tracking-wide uppercase">
              Natural • Chemical-Free • Lab-Tested
            </p>

            {/* Aurora Trust Badges */}
            <AuroraTrustBadges />
          </div>

          {/* Column 2 - Fresh Produce */}
          <div className="space-y-6">
            {/* Card 2 - Fresh Produce */}
            <Link 
              to="/collections?category=microgreens"
              className="group relative block overflow-hidden rounded-2xl aspect-[1/1.1] sm:aspect-[4/5] md:aspect-[5/6] lg:aspect-[6/7] animate-fade-in-up border border-border/10 shadow-xl cursor-pointer"
              style={{ animationDelay: "0.15s" }}
            >
              <img
                src="/stomatal.jfif"
                alt="Stomatal Farms - Farm Fresh Produce"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-start p-3 md:p-6 lg:p-7">
                <span className="text-warm-white/70 text-[9px] md:text-[10px] uppercase tracking-[0.12em] md:tracking-[0.15em] mb-0.5 md:mb-1">
                  Stomatal
                </span>
                <h2 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl text-warm-white mb-1 md:mb-2 leading-tight">
                  By Stomatal Farms
                </h2>
                <p className="text-warm-white/80 text-[10px] md:text-xs mb-2 md:mb-3 max-w-[150px] md:max-w-[200px] leading-relaxed hidden sm:block">
                  Freshly harvested microgreens, leafy greens, and nutrient-rich farm produce.
                </p>
                <div className="space-y-1.5">
                  <div className="w-fit text-[10px] md:text-xs border border-warm-white text-warm-white hover:bg-warm-white hover:text-earth px-3 md:px-4 py-1.5 md:py-2 h-auto rounded-full font-bold inline-flex items-center justify-center transition-colors">
                    Shop Farm Fresh Produce
                  </div>
                </div>
              </div>
            </Link>

            <p className="text-white text-[10px] md:text-xs text-center font-medium tracking-wide uppercase">
              Fresh • Nutrient-Dense • Responsibly Grown
            </p>

            {/* Fresh Produce Trust Badges */}
            <FreshProduceTrustBadges />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
