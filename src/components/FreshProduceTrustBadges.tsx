import { Sprout, Droplets, Sun, Heart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const badges = [
  {
    icon: Sprout,
    title: "100% Organic",
    description: "Sustainably cultivated on our own farms ensuring certified organic quality.",
  },
  {
    icon: Droplets,
    title: "Hydro-Grown",
    description: "Grown using advanced hydroponic techniques for purity and consistency.",
    note: "Pesticide-free",
  },
  {
    icon: Sun,
    title: "Freshly Harvested",
    description: "Harvested daily at peak ripeness for maximum nutrition and flavor.",
  },
  {
    icon: Heart,
    title: "Nutrient-Focused",
    description: "Optimized for high nutritional value to support your healthy lifestyle.",
  },
];

const FreshProduceTrustBadges = () => {
  return (
    <section className="py-3 md:py-8 rounded-xl bg-primary border border-white/10 shadow-md">
      <div className="px-4">
        <TooltipProvider>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {badges.map((badge, index) => (
              <Tooltip key={badge.title}>
                <TooltipTrigger asChild>
                  <div
                    className="flex flex-col items-center text-center animate-fade-in cursor-help group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center mb-2 transition-transform hover:scale-110 duration-300">
                      <badge.icon className="w-full h-full stroke-[1.2] text-accent drop-shadow-[0_0_8px_rgba(209,231,210,0.3)] opacity-95 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-[10px] md:text-xs font-medium text-white/90 leading-tight">
                      {badge.title.replace('-', ' ')}
                    </h4>
                    {badge.note && (
                      <p className="text-[8px] md:text-[9px] text-white/50 italic hidden md:block">
                        {badge.note}
                      </p>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-center">
                  <p className="text-xs">{badge.description}</p>
                  {badge.note && <p className="text-[10px] text-muted-foreground italic mt-1">{badge.note}</p>}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
};

export default FreshProduceTrustBadges;
