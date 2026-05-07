import { Star } from "lucide-react";

const avatars = ["P", "R", "A", "K"];
const avatarColors = ["#4f7a2e", "#2e4e18", "#5c6e58", "#8a5a2e"];

const SocialProofBar = () => (
  <div className="w-full bg-[#fffbf5] border-b border-[#2e3f25]/5 py-4 px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 flex-wrap md:flex-nowrap">
      {/* Overlapping avatars with subtle shadows */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {avatars.map((initial, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest ring-4 ring-[#fffbf5] shadow-sm transform hover:-translate-y-1 transition-transform"
              style={{ background: avatarColors[i] }}
            >
              {initial}
            </div>
          ))}
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f9f6f0] text-[#5c6e58] text-[9px] font-black uppercase tracking-widest ring-4 ring-[#fffbf5] shadow-sm">
            +1.2k
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#c9a05a] text-[#c9a05a]" />
            ))}
            <span className="ml-1 text-xs font-black text-[#2a3625]">4.7/5</span>
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5c6e58]/60">Verified Customer Rating</p>
        </div>
      </div>

      {/* Divider for desktop */}
      <div className="hidden md:block w-[1px] h-8 bg-[#2e3f25]/10"></div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#2a3625]">
            500+ orders <span className="text-[#4f7a2e]">this month</span>
          </span>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5c6e58]/60">Trending in Wellness</p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#4f7a2e]/5 border border-[#4f7a2e]/10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4f7a2e] animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#4f7a2e]">Live</span>
        </div>
      </div>
    </div>
  </div>
);

export default SocialProofBar;
