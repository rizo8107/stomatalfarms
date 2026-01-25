import sproutIcon from "@/assets/icons/sprout.png";
import leafIcon from "@/assets/icons/leaf.png";
import waterIcon from "@/assets/icons/water.png";
import calendarIcon from "@/assets/icons/calendar.png";
import heartIcon from "@/assets/icons/heart.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const badges = [
  {
    image: leafIcon,
    title: "Organic & Farm-Grown",
    description: "Sustainably cultivated on our own farms ensuring certified organic quality.",
  },
  {
    image: waterIcon,
    title: "Hydro-Grown",
    description: "Grown using advanced hydroponic techniques for purity and consistency.",
    note: "Pesticide-free",
  },
  {
    image: sproutIcon,
    title: "Freshly Harvested",
    description: "Harvested daily at peak ripeness for maximum nutrition and flavor.",
  },
  {
    image: heartIcon,
    title: "Nutrient-Focused",
    description: "Optimized for high nutritional value to support your healthy lifestyle.",
  },
];

const FreshProduceTrustBadges = () => {
  return (
    <section className="py-6 md:py-8 rounded-xl bg-sage-light/20 border border-border/30">
      <div className="px-4">
        <TooltipProvider>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {badges.map((badge, index) => (
              <Tooltip key={badge.title}>
                <TooltipTrigger asChild>
                  <div
                    className="flex flex-col items-center text-center animate-fade-in cursor-help"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-2 transition-transform hover:scale-110 duration-300">
                      <img
                        src={badge.image}
                        alt={badge.title}
                        className="w-full h-full object-contain drop-shadow-sm"
                      />
                    </div>
                    <h4 className="text-[10px] md:text-xs font-medium text-foreground leading-tight">
                      {badge.title.replace('-', ' ')}
                    </h4>
                    {badge.note && (
                      <p className="text-[8px] md:text-[9px] text-muted-foreground italic hidden md:block">
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
