import { Leaf } from "lucide-react";

const IntroSection = () => {
  return (
    <section className="pt-20 md:pt-28 pb-2 md:pb-8">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground mb-3 leading-tight tracking-tight">
            Consciously grown. <br className="hidden md:block" /> Thoughtfully crafted.
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            Two paths. One philosophy — purity in what we grow and integrity in how we live.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
