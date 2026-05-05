const reasons = [
  { image: "/whyus_farm.png", title: "Farm to home", body: "Directly from our farm to your doorstep — no middlemen, no mystery ingredients." },
  { image: "/whyus_tradition.png", title: "Rooted in tradition", body: "Each product follows traditional aromatic formulas used in Indian homes for generations." },
  { image: "/whyus_natural.png", title: "No synthetic fillers", body: "Natural binders, sun-drying, and chemical-free processes across every product." },
  { image: "/whyus_star.png", title: "4.7 star rated", body: "100+ verified customers rate us 4.7/5 for fragrance quality, packaging, and delivery." },
  { image: "/whyus_gift.png", title: "Gift-ready always", body: "Every order is packaged thoughtfully — perfect for Diwali, housewarmings & festive giving." },
  { image: "/whyus_support.png", title: "Real support", body: "Reach us on WhatsApp or email. Real people respond, same day." },
];

const WhyUs = () => (
  <section className="py-24 md:py-32 px-4 bg-[#fffbf5] relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-[#4f7a2e]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a8c690]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-20 md:mb-28">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#4f7a2e]/5 border border-[#4f7a2e]/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4f7a2e]" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4f7a2e]">
            The Stomatal Promise
          </span>
        </div>
        <h2
          className="text-4xl md:text-6xl text-[#2a3625] mb-6 tracking-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
        >
          Rooted in nature, <span className="italic">crafted for you.</span>
        </h2>
        <p className="text-lg text-[#6a7462] font-light max-w-2xl mx-auto leading-relaxed">
          We believe in aromatics that honor both your health and ancient traditions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
        {reasons.map((r) => (
          <div key={r.title} className="flex flex-col items-center text-center group">
            <div
              className="w-40 h-40 md:w-56 md:h-56 rounded-full mb-8 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 shadow-[0_20px_50px_rgba(46,78,24,0.08)] overflow-hidden relative"
              style={{ background: "#ffffff", border: "1px solid rgba(46,63,37,0.05)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4f7a2e]/5 to-transparent opacity-50" />
              <img src={r.image} alt={r.title} className="w-[85%] h-[85%] object-contain opacity-95 mix-blend-multiply relative z-10" />
            </div>
            <h3
              className="text-2xl text-[#2a3625] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              {r.title}
            </h3>
            <p className="text-base text-[#6a7462] leading-relaxed font-light px-4 md:px-6">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUs;
