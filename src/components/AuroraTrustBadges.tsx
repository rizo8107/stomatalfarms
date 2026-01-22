import { FlaskConical, Leaf, Flame, Clock, Package } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const badges = [
  {
    icon: FlaskConical,
    title: "Lab-Tested",
    description: "Tested to meet safety and quality standards before reaching you.",
  },
  {
    icon: Leaf,
    title: "Chemical-Free",
    description: "Made without synthetic fragrances, chemical fillers, or harmful additives.",
  },
  {
    icon: Flame,
    title: "Natural Burning Ingredients",
    description: "No artificial or chemical burning agents are used.",
  },
  {
    icon: Clock,
    title: "Traditionally Crafted",
    description: "Prepared using time-tested methods inspired by traditional practices.",
  },
  {
    icon: Package,
    title: "Small-Batch Made",
    description: "Produced in limited batches with close attention to every step.",
  },
];

const AuroraTrustBadges = () => {
  return (
    <section className="py-6 md:py-8 rounded-xl bg-sage-light/20 border border-border/30">
      <div className="px-4">
        <TooltipProvider>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {badges.map((badge, index) => (
              <Tooltip key={badge.title}>
                <TooltipTrigger asChild>
                  <div
                    className="flex flex-col items-center text-center animate-fade-in cursor-help"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#8dcc5b]/10 border-2 border-[#8dcc5b]/20 flex items-center justify-center mb-2 transition-all hover:bg-[#8dcc5b]/20 hover:border-[#8dcc5b]/40">
                      <badge.icon className="w-4 h-4 md:w-5 md:h-5 text-[#8dcc5b]" />
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
