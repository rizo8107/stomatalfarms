import { Flame, Moon, ShieldCheck, Leaf, Heart } from "lucide-react";

const reasons = [
  { 
    icon: <Flame className="w-8 h-8 text-purple-400" />, 
    title: "Vedic Tradition", 
    body: "Yagnas, homams & Vastu — honoured in every batch" 
  },
  { 
    icon: <Moon className="w-8 h-8 text-amber-400" />, 
    title: "Mindful Living", 
    body: "Morning puja to quiet evening — one ritual, every day" 
  },
  { 
    icon: <ShieldCheck className="w-8 h-8 text-blue-400" />, 
    title: "Family Safe", 
    body: "Food-grade binders. Zero irritants. Safe for all ages." 
  },
  { 
    icon: <Leaf className="w-8 h-8 text-emerald-400" />, 
    title: "Zero Waste", 
    body: "Ash rich in N-P-K — feeds your garden, not the landfill" 
  },
  { 
    icon: <Heart className="w-8 h-8 text-rose-400" />, 
    title: "Noble Cause", 
    body: "Every purchase supports sacred cow rescue & welfare" 
  },
];

const WhyUs = () => (
  <section className="py-24 md:py-32 px-4 bg-[#0a0c09] relative overflow-hidden">
    {/* Decorative Background Elements */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4f7a2e]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#a8c690]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16 md:mb-24">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a8c690]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a8c690]">
            The Stomatal Promise
          </span>
        </div>
        <h2
          className="text-4xl md:text-6xl text-white mb-6 tracking-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
        >
          Rooted in nature, <span className="italic text-[#a8c690]">crafted for you.</span>
        </h2>
        <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
          We believe in aromatics that honor both your health and ancient traditions.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-8 max-w-5xl mx-auto">
        {reasons.map((r, index) => (
          <div 
            key={r.title} 
            className={`group relative p-5 md:p-10 rounded-[24px] md:rounded-[32px] bg-white/[0.03] border border-white/10 transition-all duration-500 hover:bg-white/[0.06] hover:-translate-y-2 overflow-hidden ${
              index === 4 ? "col-span-2 md:max-w-md md:mx-auto w-full" : ""
            }`}
          >
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="mb-4 md:mb-8 p-3 md:p-4 w-fit rounded-xl md:rounded-2xl bg-white/5 border border-white/5 transition-transform duration-500 group-hover:scale-110">
                {r.icon}
              </div>
              <h3
                className="text-lg md:text-2xl text-white mb-2 md:mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
              >
                {r.title}
              </h3>
              <p className="text-xs md:text-base text-gray-400 leading-relaxed font-light">
                {r.body}
              </p>
            </div>

            {/* Hover Underline Animation */}
            <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#4f7a2e] to-[#a8c690] w-0 transition-all duration-700 ease-out group-hover:w-full" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUs;

