import { Leaf } from "lucide-react";

const IntroSection = () => {
  return (
    <section className="pt-24 md:pt-28 pb-8 md:pb-12">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight tracking-tight">
            Consciously grown. <br className="hidden md:block" /> Thoughtfully crafted.
          </h1>
          <div className="flex justify-center mb-6">
            <Leaf className="w-6 h-6 text-primary/60 rotate-45" />
          </div>
          <p className="text-muted-foreground text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            Two paths. One philosophy — purity in what we grow and integrity in how we live.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
