import { Button } from "@/components/ui/button";

const RitualsSection = () => {
  return (
    <section id="rituals" className="py-16 md:py-24 bg-sage-light/50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-primary text-xs uppercase tracking-[0.2em] mb-3 block">
            Daily Practice
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            Elevate Your Rituals
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
            Incense has been used for millennia to purify spaces, enhance meditation, 
            and create sacred moments in everyday life. Our artisan blends honor these 
            ancient traditions while bringing their timeless benefits to your modern practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero">
              Start Your Journey
            </Button>
            <Button variant="subtle">
              Learn About Rituals →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RitualsSection;
