import { Link } from "react-router-dom";

const bundleItems = ["Cups × 1", "Sticks × 2", "Ghee Lamp × 1"];

const FeaturedBundle = () => (
  <section className="py-10 md:py-14 px-4 bg-[#f7f1e8]">
    <div className="max-w-7xl mx-auto">
      {/* Label */}
      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#6a7462] mb-4 text-center">
        ✦ Featured Offer
      </p>

      <div
        className="relative overflow-hidden rounded-2xl md:rounded-3xl flex flex-col md:flex-row gap-0 shadow-lg border border-[rgba(46,63,37,0.10)]"
        style={{ background: "#fffbf5" }}
      >
        {/* Image */}
        <div className="md:w-2/5 flex-shrink-0 relative overflow-hidden" style={{ minHeight: 220 }}>
          <img
            src="https://cdn.shopify.com/s/files/1/0735/4469/5965/files/7b9ccf00-4df1-4412-ab72-bf3a24d59552.jpg?v=1757489157"
            alt="Aurora Ritual Bundle"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Save badge */}
          <div
            className="absolute top-4 left-4 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md"
            style={{ background: "#b56c3d" }}
          >
            SAVE ₹200
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-4">
          <div>
            <h2
              className="text-2xl md:text-3xl text-[#1e2519] mb-2 leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Aurora Ritual Bundle
            </h2>
            <p className="text-[#6a7462] text-sm leading-relaxed mb-4">
              Everything for a complete home ritual — incense cups, sticks &amp; ghee lamp. Gift-ready packaging.
            </p>

            {/* Bundle tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {bundleItems.map((item) => (
                <span
                  key={item}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full text-[#4f7a2e]"
                  style={{ background: "rgba(79,122,46,0.10)", border: "1px solid rgba(79,122,46,0.18)" }}
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-extrabold text-[#1e2519]">₹999</span>
              <span className="text-base text-[#6a7462] line-through">₹1,199</span>
              <span className="text-sm font-bold text-[#b56c3d]">Save ₹200</span>
            </div>
          </div>

          <Link
            to="/collections?category=combos"
            className="inline-flex items-center justify-center w-full md:w-auto px-8 py-3.5 rounded-full text-sm font-black text-white shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
          >
            Get the Bundle — ₹999
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturedBundle;
