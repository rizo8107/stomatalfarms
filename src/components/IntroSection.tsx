import { Leaf } from "lucide-react";

const IntroSection = () => {
  return (
    <section className="pt-24 md:pt-32 pb-4 md:pb-12 bg-[#1a2316] relative">
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight tracking-tight">
            Consciously grown. <br className="hidden md:block" /> Thoughtfully crafted.
          </h1>
          <p className="text-[#faf7f2]/80 text-sm sm:text-base md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            Two paths. One philosophy — purity in what we grow and integrity in how we live.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
