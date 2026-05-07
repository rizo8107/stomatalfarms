import { Link } from "react-router-dom";
import { Instagram, Mail, MessageCircle, ArrowUpRight } from "lucide-react";

const Footer = () => (
  <footer className="bg-[#1a2416] text-[#f7f1e8] relative z-10 overflow-hidden">
    {/* Subtle texture/gradient */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"https://www.transparenttextures.com/patterns/p6.png\")" }}></div>
    
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        {/* Brand Section */}
        <div className="lg:col-span-2">
          <Link to="/" className="inline-block mb-8 group">
            <span
              className="text-3xl tracking-tight text-white group-hover:text-[#a8c690] transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
            >
              STOMATAL <span className="italic">FARMS</span>
            </span>
          </Link>
          <p className="text-lg font-light leading-relaxed mb-10 max-w-md text-white/50">
            Cultivating freshness, crafting rituals. We bring the pure essence of Indian farms directly to your sacred space.
          </p>
          <div className="flex gap-4">
            {[
              { href: "https://www.instagram.com/stomatalfarms/", icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
              { href: "mailto:contact@stomatalfarms.com", icon: <Mail className="w-5 h-5" />, label: "Email" },
              { href: "https://api.whatsapp.com/send/?phone=919790768502", icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:bg-white hover:text-[#1a2416] transform hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-white/30">Aurora Collections</h4>
          <ul className="flex flex-col gap-5">
            {[
              ["Incense Sticks", "/collections?category=sticks"],
              ["Incense Cups", "/collections?category=cups"],
              ["Combo Packs", "/collections?category=combos"],
              ["Ghee Lamps", "/collections?category=ghee"],
              ["Bath Salts", "/collections?category=bath"],
            ].map(([name, href]) => (
              <li key={name}>
                <Link
                  to={href}
                  className="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-all"
                >
                  {name}
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-white/30">The Ritual List</h4>
          <p className="text-sm font-light leading-relaxed mb-8 text-white/50">
            Subscribe to receive stories of traditional rituals and early access to new releases.
          </p>
          <form className="relative group" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-full text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#a8c690]/50 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all hover:shadow-lg active:scale-95"
              style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Stats Section */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 px-8 mb-20 rounded-[40px] text-center"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {[
          ["5+", "Years of Craft"],
          ["100+", "Homes Blessed"],
          ["100%", "Purely Natural"],
          ["4.7★", "Average Rating"],
        ].map(([val, label]) => (
          <div key={label} className="flex flex-col gap-1">
            <p className="text-2xl md:text-3xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{val}</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">{label}</p>
          </div>
        ))}
      </div>

      {/* Bottom Legal Bar */}
      <div
        className="flex flex-col lg:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
          © 2025 Stomatal Farms. Crafted with intention.
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          {[
            ["Privacy", "#"],
            ["Terms", "#"],
            ["Contact Us", "mailto:contact@stomatalfarms.com"],
          ].map(([t, href]) => (
            <a
              key={t}
              href={href}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white/60 transition-colors"
            >
              {t}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
