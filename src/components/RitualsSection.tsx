import { Button } from "@/components/ui/button";

const RitualsSection = () => {
  return (
    <section id="rituals" className="py-16 md:py-24 bg-gradient-to-t from-sage-light/40 via-sage-light/10 to-transparent border-t border-border/40 relative">
      <div className="container px-4 max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 text-xs md:text-sm font-semibold uppercase tracking-widest text-primary mb-4 border border-primary/20">
            Daily Practice
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight tracking-tight">
            Elevate Your Rituals
          </h2>
          <div className="w-12 h-0.5 bg-primary/30 mb-6 rounded-full mx-auto" />
          <p className="text-muted-foreground text-base md:text-lg font-light leading-relaxed mb-10 max-w-2xl">
            Incense has been used for millennia to purify spaces, enhance meditation,
            and create sacred moments in everyday life. Our artisan blends honor these
            ancient traditions while bringing their timeless benefits to your modern practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Button className="bg-[#8dcc5b] hover:bg-[#8dcc5b]/90 text-white rounded-full px-8 py-6 text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all">
              Start Your Journey
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-6 text-sm font-semibold tracking-wide border-border hover:border-[#8dcc5b] hover:text-[#8dcc5b] transition-all bg-card/50 backdrop-blur-sm">
              Learn About Rituals →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RitualsSection;
