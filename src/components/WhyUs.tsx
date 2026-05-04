const reasons = [
  { icon: "🌿", title: "Farm to home", body: "Directly from our farm to your doorstep — no middlemen, no mystery ingredients." },
  { icon: "🙏", title: "Rooted in tradition", body: "Each product follows traditional aromatic formulas used in Indian homes for generations." },
  { icon: "💚", title: "No synthetic fillers", body: "Natural binders, sun-drying, and chemical-free processes across every product." },
  { icon: "⭐", title: "4.9 star rated", body: "1,200+ verified customers rate us 4.9/5 for fragrance quality, packaging, and delivery." },
  { icon: "🎁", title: "Gift-ready always", body: "Every order is packaged thoughtfully — perfect for Diwali, housewarmings & festive giving." },
  { icon: "📞", title: "Real support", body: "Reach us on WhatsApp or email. Real people respond, same day." },
];

const comparisonRows = [
  { feature: "Ingredients", aurora: "Natural herbs, resins & ghee", generic: "Synthetic fragrance oils & paraffin" },
  { feature: "Binders used", aurora: "Plant-based gum & ghee", generic: "Chemical adhesives & DEP/DOP" },
  { feature: "Smoke quality", aurora: "Light, clean, therapeutic", generic: "Heavy, irritating, artificial" },
  { feature: "Fragrance source", aurora: "Real florals & herbal extracts", generic: "Lab-made synthetic compounds" },
  { feature: "Drying method", aurora: "Sun-dried naturally", generic: "Industrial oven-dried" },
  { feature: "Packaging", aurora: "Eco-conscious, minimal", generic: "Plastic-heavy, generic" },
  { feature: "Safe for prayer?", aurora: "✓ Yes — Panchagavya based", generic: "Not recommended for sacred use" },
];

const WhyUs = () => (
  <section className="py-12 md:py-16 px-4 bg-[#f7f1e8]">
    <div className="max-w-7xl mx-auto">
      {/* Why Us grid */}
      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#6a7462] text-center mb-3">
        ✦ Why Stomatal Farms
      </p>
      <h2
        className="text-center text-2xl md:text-4xl text-[#1e2519] mb-10"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
      >
        Why thousands choose Aurora.
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
        {reasons.map((r) => (
          <div
            key={r.title}
            className="rounded-xl p-4 md:p-5 border"
            style={{ background: "#fffbf5", borderColor: "rgba(46,63,37,0.10)" }}
          >
            <span className="text-2xl block mb-2">{r.icon}</span>
            <h3
              className="text-base font-semibold text-[#1e2519] mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {r.title}
            </h3>
            <p className="text-xs text-[#6a7462] leading-relaxed font-light">{r.body}</p>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#6a7462] text-center mb-3">
        ✦ Aurora vs Generic Brands
      </p>
      <h2
        className="text-center text-2xl md:text-3xl text-[#1e2519] mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
      >
        The difference is in every detail.
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-[rgba(46,63,37,0.12)] shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}>
              <th className="text-left py-3 px-4 text-white font-bold text-xs uppercase tracking-wide">Feature</th>
              <th className="text-left py-3 px-4 text-white font-bold text-xs uppercase tracking-wide">Aurora</th>
              <th className="text-left py-3 px-4 text-white font-bold text-xs uppercase tracking-wide">Generic</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, i) => (
              <tr
                key={row.feature}
                style={{ background: i % 2 === 0 ? "#fffbf5" : "rgba(79,122,46,0.04)" }}
              >
                <td className="py-3 px-4 text-[#1e2519] font-semibold text-xs">{row.feature}</td>
                <td className="py-3 px-4 text-[#4f7a2e] text-xs font-medium">{row.aurora}</td>
                <td className="py-3 px-4 text-[#6a7462] text-xs">{row.generic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default WhyUs;
