const badges = [
  { emoji: "🔥", label: "Rooted in Vedic Tradition" },
  { emoji: "🧘", label: "Elevates Daily Ritual" },
  { emoji: "🐄", label: "Supports Cow Welfare" },
  { emoji: "🌿", label: "Ash → Garden Fertiliser" },
  { emoji: "🛡️", label: "Safe for Kids & Pets" },
  { emoji: "🔥", label: "Zero Chemical Burn" },
];

const WhyUs = () => (
  <section className="py-12 md:py-16 px-4 bg-[#0e1610]">
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-wrap gap-3 justify-center">
        {badges.map((b, i) => (
          <div
            key={b.label}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all ${
              i % 3 === 0
                ? "bg-[#f5c842] border-[#f5c842] text-[#1a1a0a]"
                : "bg-transparent border-white/20 text-white/80 hover:border-white/40"
            }`}
          >
            <span className="text-base">{b.emoji}</span>
            {b.label}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUs;
