import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const FinalCTA = () => (
  <section className="relative py-24 md:py-40 px-6 overflow-hidden">
    {/* Rich gradient background */}
    <div 
      className="absolute inset-0 z-0"
      style={{ background: "linear-gradient(135deg, #1e3612 0%, #2e4e18 100%)" }}
    />
    
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4f7a2e]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#a8c690]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
    
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
        <Sparkles className="w-3.5 h-3.5 text-[#a8c690]" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">
          Begin Your Ritual
        </span>
      </div>
      
      <h2
        className="text-4xl md:text-7xl text-white mb-8 leading-[1.1] tracking-tight"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
      >
        Transform your space into<br />
        <span className="italic text-[#a8c690]">a sanctuary.</span>
      </h2>
      
      <p className="text-lg md:text-xl text-white/70 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
        Experience the purity of farm-sourced, natural aromatics. Every order is packed with intention and delivered with care.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
        <Link
          to="/collections"
          className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] text-[#1e3612] bg-white shadow-2xl transition-all hover:bg-[#f9f6f0] hover:-translate-y-1 active:translate-y-0"
        >
          Shop Collection
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center w-full sm:w-auto px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white border border-white/30 backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-1 active:translate-y-0"
        >
          Contact Our Team
        </Link>
      </div>

      <div className="flex flex-wrap justify-center gap-8 py-6 border-t border-white/10 max-w-lg mx-auto">
        {[
          "100% Pure Natural",
          "Chemical-Free Formulas",
          "Ancient Vedic Methods",
        ].map((point) => (
          <div key={point} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#a8c690]"></div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">{point}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FinalCTA;
