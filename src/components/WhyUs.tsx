import { useState } from "react";
import { Link } from "react-router-dom";

const reasons = [
  { image: "/whyus_farm.png", title: "Farm to home", body: "Directly from our farm to your doorstep — no middlemen, no mystery ingredients." },
  { image: "/whyus_tradition.png", title: "Rooted in tradition", body: "Each product follows traditional aromatic formulas used in Indian homes for generations." },
  { image: "/whyus_natural.png", title: "No synthetic fillers", body: "Natural binders, sun-drying, and chemical-free processes across every product." },
  { image: "/whyus_star.png", title: "4.9 star rated", body: "1,200+ verified customers rate us 4.9/5 for fragrance quality, packaging, and delivery." },
  { image: "/whyus_gift.png", title: "Gift-ready always", body: "Every order is packaged thoughtfully — perfect for Diwali, housewarmings & festive giving." },
  { image: "/whyus_support.png", title: "Real support", body: "Reach us on WhatsApp or email. Real people respond, same day." },
];

const tabs = [
  {
    id: "inside",
    label: "Inside",
    emoji: "🌿",
    heading: "Cow dung base.\nNot charcoal.",
    aurora: ["Gomaya base", "Sourced herbs", "Natural binders", "Family safe"],
    regular: ["Charcoal core", "Synthetic aroma", "Chemical binders", "No safety data"],
  },
  {
    id: "burns",
    label: "Burns",
    emoji: "🔥",
    heading: "20 sec to light.\nProof of purity.",
    aurora: ["Clove-activated", "No chemical rush", "45 min clean burn"],
    regular: ["1 sec — chemicals", "Harsh smoke", "Gone mid-puja"],
  },
  {
    id: "safety",
    label: "Safety",
    emoji: "🔬",
    heading: "Lab tested.\nNothing hidden.",
    aurora: ["Independently tested", "Safe for kids & pets", "Report on request"],
    regular: ["No testing done", "Chemical smoke daily", "No one talks about it"],
  },
  {
    id: "after",
    label: "After",
    emoji: "🪷",
    heading: "Ash becomes\nvibhoothi.",
    aurora: ["Solar dried", "Handcrafted", "Ash → vibhoothi", "Zero waste"],
    regular: ["Machine processed", "Ash is waste", "Nothing reusable"],
  },
];

const bottomStats = [
  { value: "4.9★", label: "Rating" },
  { value: "100+", label: "Homes" },
  { value: "100%", label: "Natural" },
];

const WhyUs = () => {
  const [activeTab, setActiveTab] = useState("inside");
  const tab = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="py-24 md:py-32 px-4 bg-[#fffbf5] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#4f7a2e]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a8c690]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Why-us grid */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 mb-32">
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

        {/* Tabbed comparison */}
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4f7a2e] mb-2">
            Aurora vs Regular Incense
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#2a3625] mb-8 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            The difference<br />is in <span className="italic">every</span> detail.
          </h2>

          {/* Tab bar */}
          <div className="flex border-b border-[#2e3f25]/10 mb-8">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-[0.18em] transition-all duration-200 border-b-2 ${activeTab === t.id
                    ? "border-[#4f7a2e] text-[#4f7a2e]"
                    : "border-transparent text-[#6a7462] hover:text-[#2a3625]"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab panel */}
          <div className="bg-white rounded-[28px] p-8 shadow-sm border border-[#f1eae0]">
            <p
              className="text-2xl md:text-3xl text-[#2a3625] mb-6 leading-snug whitespace-pre-line"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              {tab.emoji}{"  "}{tab.heading}
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4f7a2e] mb-3">
                  + Aurora
                </p>
                <ul className="space-y-2">
                  {tab.aurora.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#2a3625]">
                      <span className="text-[#4f7a2e] font-bold mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6a7462]/50 mb-3">
                  ✕ Regular
                </p>
                <ul className="space-y-2">
                  {tab.regular.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#6a7462]/60">
                      <span className="text-[#c0392b]/50 font-bold mt-0.5">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Stats + CTA bar */}
          <div className="mt-5 flex items-stretch rounded-[20px] overflow-hidden border border-[#2e3f25]/8 bg-white">
            {bottomStats.map((s, i) => (
              <div
                key={s.label}
                className={`flex-1 flex flex-col items-center justify-center py-4 ${i < bottomStats.length - 1 ? "border-r border-[#2e3f25]/8" : ""
                  }`}
              >
                <p
                  className="text-xl text-[#2a3625] font-semibold leading-none mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {s.value}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6a7462]/50">
                  {s.label}
                </p>
              </div>
            ))}
            <Link
              to="/collections"
              className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-white whitespace-nowrap flex items-center"
              style={{ background: "#b56c3d" }}
            >
              Shop Aurora →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
