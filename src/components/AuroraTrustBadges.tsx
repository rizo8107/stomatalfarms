import labIcon from "@/assets/icons/lab.png";
import leafIcon from "@/assets/icons/leaf.png";
import fireIcon from "@/assets/icons/fire.png";
import clockIcon from "@/assets/icons/clock.png";
import packageIcon from "@/assets/icons/package.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const badges = [
  {
    image: labIcon,
    title: "Lab-Tested",
    description: "Tested to meet safety and quality standards before reaching you.",
  },
  {
    image: leafIcon,
    title: "100% Natural",
    description: "Made with 100% natural ingredients, free from synthetic fragrances and harmful additives.",
  },
  {
    image: clockIcon,
    title: "Traditionally Crafted",
    description: "Prepared using time-tested methods inspired by traditional practices.",
  },
  {
    image: packageIcon,
    title: "Small-Batch Made",
    description: "Produced in limited batches with close attention to every step.",
  },
];

const AuroraTrustBadges = () => {
  return (
    <section className="py-3 md:py-8 rounded-xl bg-sage-light/20 border border-border/30">
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
                      {badge.title.split(' ').slice(0, 2).join(' ')}
                    </h4>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-center">
                  <p className="text-xs">{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
};

export default AuroraTrustBadges;
