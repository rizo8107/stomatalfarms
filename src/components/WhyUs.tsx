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
      <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-xl mx-auto">
        {badges.map((b, i) => (
          <div
            key={b.label}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full border bg-[#f5c842] border-[#f5c842] text-[#1a1a0a] text-[11px] md:text-sm font-semibold transition-all hover:-translate-y-0.5"
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
