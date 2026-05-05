import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const bundleItems = ["Incense Cups × 1", "Incense Sticks × 2", "Ghee Lamp × 1"];

const FeaturedBundle = () => (
  <section className="py-20 md:py-32 px-4 bg-[#f9f6f0] relative overflow-hidden">
    {/* Decorative element */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-[#4f7a2e]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5c6e58] mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-3 h-3" />
          Limited Ritual Set
        </p>
        <h2
          className="text-3xl md:text-5xl text-[#2a3625] mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          Everything for your sacred space.
        </h2>
      </div>

      <div
        className="relative overflow-hidden rounded-[40px] flex flex-col lg:flex-row shadow-2xl border border-[#2e3f25]/5 group"
        style={{ background: "#ffffff" }}
      >
        {/* Image Section */}
        <div className="lg:w-1/2 relative overflow-hidden min-h-[350px] lg:min-h-[500px]">
          <img
            src="https://cdn.shopify.com/s/files/1/0735/4469/5965/files/7b9ccf00-4df1-4412-ab72-bf3a24d59552.jpg?v=1757489157"
            alt="Aurora Ritual Bundle"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Save badge */}
          <div
            className="absolute top-8 left-8 text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-lg backdrop-blur-md"
            style={{ background: "rgba(181, 108, 61, 0.9)" }}
          >
            Save ₹200 Today
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3
              className="text-3xl lg:text-4xl text-[#2a3625] mb-6 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              The Aurora Ritual Bundle
            </h3>
            <p className="text-[#6a7462] text-lg font-light leading-relaxed mb-8">
              A curated collection of our finest aromatics, designed to transform your home into a sanctuary of peace and intention. Perfect for gifting or starting your own daily ritual.
            </p>

            {/* Bundle contents */}
            <div className="flex flex-wrap gap-3 mb-10">
              {bundleItems.map((item) => (
                <div
                  key={item}
                  className="px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-[#4f7a2e] bg-[#4f7a2e]/5 border border-[#4f7a2e]/10"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-6 mb-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5c6e58]/60 mb-1">Our Price</span>
                <span className="text-4xl font-light text-[#2a3625]">₹999</span>
              </div>
              <div className="h-10 w-[1px] bg-[#2e3f25]/10"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5c6e58]/60 mb-1">Value</span>
                <span className="text-xl text-[#6a7462]/60 line-through">₹1,199</span>
              </div>
            </div>
          </div>

          <Link
            to="/collections?category=combos"
            className="group inline-flex items-center justify-center gap-3 w-full px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
            style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
          >
            Claim Your Bundle
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="text-center mt-6 text-[10px] font-bold uppercase tracking-widest text-[#5c6e58]/40">
            * Limited stock available for this month
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturedBundle;
