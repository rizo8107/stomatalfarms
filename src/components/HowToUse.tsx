const steps = [
  {
    icon: "🕯",
    number: "01",
    title: "Choose your ritual",
    body: "Pick your product — sticks for quick daily calm, cups for deeper sessions, ghee lamp for sacred spaces.",
  },
  {
    icon: "🏠",
    number: "02",
    title: "Prepare your space",
    body: "Place in a ventilated room or puja corner. Keep away from flammable items. Use a proper holder.",
  },
  {
    icon: "🔥",
    number: "03",
    title: "Light & let go",
    body: "Light the tip, blow out the flame after 10 seconds. Let the natural fragrance fill your space slowly.",
  },
  {
    icon: "🧘",
    number: "04",
    title: "Sit, breathe, be present",
    body: "Take 3 slow breaths. Let the aroma guide your mind into stillness, prayer, or quiet reflection.",
  },
];

const HowToUse = () => (
  <section className="py-12 md:py-16 px-4 bg-[#fffbf5]">
    <div className="max-w-7xl mx-auto">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#6a7462] text-center mb-3">
        ✦ How to Use
      </p>
      <h2
        className="text-center text-2xl md:text-4xl text-[#1e2519] mb-10"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
      >
        Simple rituals, profound calm.
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-xl md:rounded-2xl p-5 flex flex-col gap-3 border"
            style={{ background: "#f7f1e8", borderColor: "rgba(46,63,37,0.10)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{step.icon}</span>
              <span
                className="text-[10px] font-black tracking-widest uppercase"
                style={{ color: "#4f7a2e" }}
              >
                STEP {step.number}
              </span>
            </div>
            <h3
              className="text-base font-semibold text-[#1e2519] leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {step.title}
            </h3>
            <p className="text-xs text-[#6a7462] leading-relaxed font-light">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowToUse;
