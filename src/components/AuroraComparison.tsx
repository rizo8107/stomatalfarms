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
    <section className="pt-6 pb-14 md:pb-20 px-4 bg-[#f9f6f0]">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-[#4f7a2e] mb-2">
          Aurora vs Regular Incense
        </p>
        <h2
          className="text-3xl md:text-4xl text-[#2a3625] mb-8 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
        >
          The difference is in <span className="italic">every</span> detail.
        </h2>

        {/* Tab bar */}
        <div className="flex border-b border-[#2e3f25]/10 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-[0.18em] transition-all duration-200 border-b-2 ${
                activeTab === t.id
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
              className={`flex-1 flex flex-col items-center justify-center py-4 ${
                i < bottomStats.length - 1 ? "border-r border-[#2e3f25]/8" : ""
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
    </section>
  );
};

export default AuroraComparison;
