import { FlaskConical, Leaf, Sparkles, Box } from "lucide-react";
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
    title: "100% Natural",
    description: "Made with 100% natural ingredients, free from synthetic fragrances and harmful additives.",
  },
  {
    icon: Sparkles,
    title: "Traditionally Crafted",
    description: "Prepared using time-tested methods inspired by traditional practices.",
  },
  {
    icon: Box,
    title: "Small-Batch Made",
    description: "Produced in limited batches with close attention to every step.",
  },
];

const AuroraTrustBadges = () => {
  return (
    <section className="py-3 md:py-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-md">
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
                      <badge.icon className="w-full h-full stroke-[1.2] text-[#5a8739] drop-shadow-[0_0_8px_rgba(90,135,57,0.3)] opacity-95 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-[10px] md:text-xs font-medium text-white/90 leading-tight">
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
