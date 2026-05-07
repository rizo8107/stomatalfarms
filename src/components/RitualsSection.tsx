import { Button } from "@/components/ui/button";

const RitualsSection = () => {
  return (
    <section id="rituals" className="py-24 md:py-32 bg-[#2a3625] relative overflow-hidden z-20 w-full rounded-t-3xl md:rounded-t-[3rem] -mt-6 md:-mt-10 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] border-t border-white/10">
      {/* Decorative texture/glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#5a8739]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-4 max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-widest text-[#5a8739] mb-6 border border-white/10 backdrop-blur-sm">
            Daily Practice
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight tracking-tight">
            Elevate Your Rituals
          </h2>
          <div className="w-16 h-0.5 bg-[#5a8739]/50 mb-8 rounded-full mx-auto" />
          <p className="text-white/80 text-base md:text-xl font-light leading-relaxed mb-12 max-w-2xl">
            Incense has been used for millennia to purify spaces, enhance meditation,
            and create sacred moments in everyday life. Our artisan blends honor these
            ancient traditions while bringing their timeless benefits to your modern practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Button className="bg-[#5a8739] hover:bg-[#7abd49] text-white rounded-full px-7 py-5 text-sm font-semibold tracking-wide shadow-lg shadow-[#5a8739]/20 hover:shadow-xl transition-all hover:-translate-y-1">
              Start Your Journey
            </Button>
            <Button variant="outline" className="rounded-full px-7 py-5 text-sm font-semibold tracking-wide border-white/20 text-white hover:bg-white hover:text-[#2a3625] transition-all hover:-translate-y-1 bg-transparent backdrop-blur-sm">
              Learn About Rituals →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RitualsSection;

