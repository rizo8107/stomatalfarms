import { Leaf, Heart, Sparkles, Globe } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Pure botanicals & resins",
  },
  {
    icon: Heart,
    title: "Hand-Crafted",
    description: "Made with intention",
  },
  {
    icon: Sparkles,
    title: "Ancient Recipes",
    description: "Traditional methods",
  },
  {
    icon: Globe,
    title: "Ethically Sourced",
    description: "Sustainable practices",
  },
];

const FeaturesBar = () => {
  return (
    <section className="py-8 md:py-12 border-y border-border/50 bg-card/50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-sage-light flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="text-sm md:text-base font-medium text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
