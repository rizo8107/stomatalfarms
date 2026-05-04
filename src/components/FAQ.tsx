import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Which product should I start with?",
    a: "Our incense sticks are perfect for daily use, while cups offer a deeper, more therapeutic experience. If you're new, the Combo packs are our most loved starting point.",
  },
  {
    q: "Are these safe for children and elders?",
    a: "Absolutely. Every Aurora product is crafted from 100% natural, chemical-free ingredients with no synthetic binders, making them safe for everyone in your family.",
  },
  {
    q: "How long does each product last?",
    a: "Our sticks burn for ~45 minutes, while cups provide a 90–120 minute experience. Ghee lamps can light up your space for 4–6 hours.",
  },
  {
    q: "Is gifting packaging available?",
    a: "Yes, our Ritual Bundles come beautifully gift-ready. For individual items, you can request special gift wrapping at checkout.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 px-4 bg-[#f9f6f0] relative overflow-hidden">
      {/* Subtle decorative background */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4f7a2e]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#4f7a2e]/5 border border-[#4f7a2e]/10">
            <HelpCircle className="w-3 h-3 text-[#4f7a2e]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4f7a2e]">Common Inquiries</span>
          </div>
          <h2
            className="text-4xl md:text-5xl text-[#2a3625] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            Thoughtfully answered.
          </h2>
          <p className="text-[#6a7462] font-light max-w-lg mx-auto">
            Everything you need to know about our natural aromatics and how to integrate them into your daily life.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-[32px] overflow-hidden transition-all duration-500 border ${
                open === i 
                  ? "bg-white shadow-xl border-[#2e3f25]/10" 
                  : "bg-white/40 border-transparent hover:bg-white/60"
              }`}
            >
              <button
                className="w-full text-left px-8 py-6 flex items-center justify-between gap-6 outline-none group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`text-base md:text-lg font-medium transition-colors duration-300 ${open === i ? "text-[#4f7a2e]" : "text-[#2a3625]"}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {faq.q}
                </span>
                <div 
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    open === i ? "bg-[#4f7a2e] text-white rotate-180" : "bg-white text-[#2a3625] shadow-sm group-hover:shadow-md"
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  open === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 pb-8 text-sm md:text-base text-[#6a7462] leading-relaxed font-light">
                  <div className="w-full h-[1px] bg-[#2e3f25]/5 mb-6"></div>
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Support link */}
        <div className="mt-16 text-center">
          <p className="text-sm text-[#6a7462]">
            Still have questions? <Link to="/contact" className="text-[#4f7a2e] font-bold border-b border-[#4f7a2e]/30 hover:border-[#4f7a2e] transition-all">Reach out to us</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
