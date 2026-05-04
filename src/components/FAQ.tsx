import { useState } from "react";

const faqs = [
  {
    q: "Which product should I start with?",
    a: "Incense sticks are easiest for daily use. Cups offer a deeper, longer experience. Ghee lamps are perfect for puja corners. Combo packs are the best first order.",
  },
  {
    q: "Are these safe for children and elders?",
    a: "Yes — all Aurora products use natural, chemical-free ingredients with no synthetic binders. Safe for homes with children and elderly.",
  },
  {
    q: "How long does each product last?",
    a: "Sticks ~45 min, cups 90–120 min, ghee lamps 4–6 hours. One pack of sticks lasts a month of daily use.",
  },
  {
    q: "Is gifting packaging available?",
    a: "Combo packs come gift-ready. Single items can be requested with gift wrap at checkout on our store.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-16 px-4 bg-[#f7f1e8]">
      <div className="max-w-2xl mx-auto">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#6a7462] text-center mb-3">
          ✦ Quick Answers
        </p>
        <h2
          className="text-center text-2xl md:text-4xl text-[#1e2519] mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          Common questions.
        </h2>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border overflow-hidden"
              style={{ background: "#fffbf5", borderColor: "rgba(46,63,37,0.12)" }}
            >
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 font-semibold text-[#1e2519] text-sm"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #2e4e18, #4f7a2e)",
                    transform: open === i ? "rotate(45deg)" : "none",
                  }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-[#6a7462] leading-relaxed font-light border-t border-[rgba(46,63,37,0.08)]">
                  <p className="pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
