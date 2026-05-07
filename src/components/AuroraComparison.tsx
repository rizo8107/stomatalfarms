import { useState } from "react";
import { Link } from "react-router-dom";

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
  { value: "4.7★", label: "Rating" },
  { value: "100+", label: "Homes" },
  { value: "100%", label: "Natural" },
];

const AuroraComparison = () => {
  const [activeTab, setActiveTab] = useState("inside");
  const tab = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="pt-6 pb-10 md:pb-14 px-4" style={{ background: "linear-gradient(135deg, #1a2416, #2a3820)" }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-[#a8c690] mb-1.5">
          Aurora vs Regular Incense
        </p>
        <h2
          className="text-2xl md:text-3xl text-white mb-5 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
        >
          The difference is in <span className="italic text-[#a8c690]">every</span> detail.
        </h2>

        {/* Tab bar */}
        <div className="flex border-b border-white/10 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-[0.18em] transition-all duration-200 border-b-2 ${
                activeTab === t.id
                  ? "border-[#a8c690] text-[#a8c690]"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div className="bg-white/8 backdrop-blur-sm rounded-[24px] p-6 md:p-8 border border-white/10">
          <p
            className="text-xl md:text-2xl text-white mb-5 leading-snug whitespace-pre-line"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            {tab.emoji}{"  "}{tab.heading}
          </p>

          <div className="grid grid-cols-2 gap-5 md:gap-8">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#a8c690] mb-2.5">
                + Aurora
              </p>
              <ul className="space-y-1.5">
                {tab.aurora.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/90">
                    <span className="text-[#a8c690] font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2.5">
                ✕ Regular
              </p>
              <ul className="space-y-1.5">
                {tab.regular.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/40">
                    <span className="text-red-400/60 font-bold mt-0.5">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stats + CTA bar */}
        <div className="mt-4 flex items-stretch rounded-[16px] overflow-hidden border border-white/10 bg-white/5">
          {bottomStats.map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 flex flex-col items-center justify-center py-3 ${
                i < bottomStats.length - 1 ? "border-r border-white/10" : ""
              }`}
            >
              <p
                className="text-lg text-white font-semibold leading-none mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {s.value}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                {s.label}
              </p>
            </div>
          ))}
          <Link
            to="/collections"
            className="px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-white whitespace-nowrap flex items-center"
            style={{ background: "#b56c3d" }}
          >
            Shop Aurora →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AuroraComparison;
