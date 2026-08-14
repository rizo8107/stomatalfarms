const steps = [
  {
    image: "/step1.png",
    number: "01",
    title: "Choose your ritual",
    body: "Pick your product — sticks for quick daily calm, cups for deeper sessions, ghee lamp for sacred spaces.",
  },
  {
    image: "/step2.png",
    number: "02",
    title: "Prepare your space",
    body: "Place in a ventilated room or puja corner. Keep away from flammable items. Use a proper holder.",
  },
  {
    image: "/step3.png",
    number: "03",
    title: "Light & let go",
    body: "Light the tip, blow out the flame after 10 seconds. Let the natural fragrance fill your space slowly.",
  },
  {
    image: "/step4.png",
    number: "04",
    title: "Sit, breathe, be present",
    body: "Take 3 slow breaths. Let the aroma guide your mind into stillness, prayer, or quiet reflection.",
  },
];

const HowToUse = () => (
  <section className="py-24 md:py-32 px-4 bg-[#f9f6f0] relative overflow-hidden">
    {/* Subtle decorative background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#4f7a2e]/10 to-transparent"></div>
    
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-20 md:mb-28">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#4f7a2e]/5 border border-[#4f7a2e]/10">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4f7a2e]">The Ritual Guide</span>
        </div>
        <h2
          className="text-4xl md:text-6xl text-[#2a3625] mb-6 tracking-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
        >
          Simple rituals, <span className="italic">profound calm.</span>
        </h2>
        <p className="max-w-lg mx-auto text-[#6a7462] font-light text-lg leading-relaxed">
          Embrace the quiet moments of your day with our natural aromatic blends.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 mb-8 overflow-hidden rounded-full bg-white shadow-[0_20px_50px_rgba(46,78,24,0.05)] border border-[#4f7a2e]/5 flex items-center justify-center transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-2 relative">
              {/* Animated hover glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4f7a2e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img src={step.image} alt={step.title} className="w-[85%] h-[85%] object-contain opacity-95 mix-blend-multiply relative z-10" loading="lazy" />
              
              {/* Step number badge */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#2a3625] text-white flex items-center justify-center text-[10px] font-black tracking-widest z-20 shadow-lg">
                {step.number}
              </div>
            </div>

            <h3
              className="text-2xl text-[#2a3625] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              {step.title}
            </h3>
            <p className="text-base text-[#6a7462] leading-relaxed font-light px-4">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowToUse;
