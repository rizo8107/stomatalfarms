import craftTradition from "@/assets/craft-tradition-illust.jpg";
import craftMindfulness from "@/assets/craft-mindfulness-illust.jpg";
import craftSafe from "@/assets/craft-safe-illust.jpg";
import craftNoble from "@/assets/craft-noble-illust.jpg";
import craftGarden from "@/assets/craft-garden-illust.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const craftSteps = [
  {
    title: "Tradition Meets Purity",
    description: "Bring home incense that purifies the air, clears negativity, and fills your space with sacred harmony.",
    image: craftTradition,
  },
  {
    title: "Embrace Mindfulness",
    description: "Find peace in meditation, prayers, or quiet time with soothing aromas that center your soul.",
    image: craftMindfulness,
  },
  {
    title: "Perfectly Safe for Children",
    description: "Crafted from natural herbs and flowers, our incense is gentle, toxin-free, and safe for kids & pets.",
    image: craftSafe,
  },
  {
    title: "Support a Noble Cause",
    description: "Every purchase helps support cow welfare and rescue initiatives, good for you, good for the world.",
    image: craftNoble,
  },
  {
    title: "Boost Your Garden's Vitality",
    description: "Turn incense ash into natural fertilizer, nourishing your garden with rich minerals for healthy growth.",
    image: craftGarden,
  },
];

const CraftPuritySection = () => {
  return (
    <section className="py-16 md:py-24 bg-cream/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground italic">
            How We Craft Purity,
            <br />
            Step by Step
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {craftSteps.map((step, index) => (
              <CarouselItem key={step.title} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div
                  className="group bg-cream rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full"
                >
                  {/* Image Container */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 md:p-5">
                    <h3 className="font-serif text-base md:text-lg text-earth font-semibold leading-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-earth/70 text-xs md:text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 -translate-x-1/2 bg-cream border-sage hover:bg-sage hover:text-warm-white" />
          <CarouselNext className="right-0 translate-x-1/2 bg-cream border-sage hover:bg-sage hover:text-warm-white" />
        </Carousel>
      </div>
    </section>
  );
};

export default CraftPuritySection;
