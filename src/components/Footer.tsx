import { Link } from "react-router-dom";
import { Instagram, Mail, MessageCircle } from "lucide-react";

const Footer = () => (
  <footer style={{ background: "#1e2519", color: "#f7f1e8" }} className="relative z-10">
    <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="lg:col-span-2">
          <span
            className="block text-2xl mb-4 text-white"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            STOMATAL FARMS
          </span>
          <p className="text-sm font-light leading-relaxed mb-1" style={{ color: "rgba(247,241,232,0.65)" }}>
            Aurora Aromatic Wellness
          </p>
          <p className="text-sm font-light leading-relaxed mb-6 max-w-xs" style={{ color: "rgba(247,241,232,0.55)" }}>
            Cultivating freshness. Crafting rituals. From Indian farms to your home.
          </p>
          <div className="flex gap-3">
            {[
              { href: "https://www.instagram.com/stomatalfarms/", icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
              { href: "mailto:contact@stomatalfarms.com", icon: <Mail className="w-4 h-4" />, label: "Email" },
              { href: "https://api.whatsapp.com/send/?phone=919790768502", icon: <MessageCircle className="w-4 h-4" />, label: "WhatsApp" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-90"
                style={{ background: "rgba(247,241,232,0.08)", border: "1px solid rgba(247,241,232,0.12)" }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Aurora links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/60">Aurora Products</h4>
          <ul className="space-y-3">
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
                  className="text-sm font-light transition-colors hover:text-white"
                  style={{ color: "rgba(247,241,232,0.60)" }}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/60">Stay Connected</h4>
          <p className="text-sm font-light leading-relaxed mb-5" style={{ color: "rgba(247,241,232,0.55)" }}>
            Rituals, new releases &amp; exclusive offers.
          </p>
          <div className="flex flex-col gap-2.5">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2.5 rounded-full text-sm border text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#4f7a2e]/40 transition-all font-light"
              style={{ background: "rgba(247,241,232,0.06)", borderColor: "rgba(247,241,232,0.12)" }}
            />
            <button
              className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-4 gap-4 py-6 mb-8 rounded-2xl text-center"
        style={{ background: "rgba(247,241,232,0.04)", border: "1px solid rgba(247,241,232,0.08)" }}
      >
        {[
          ["5+", "Yrs craft"],
          ["1200+", "Homes"],
          ["100%", "Natural"],
          ["4.9★", "Rating"],
        ].map(([val, label]) => (
          <div key={label}>
            <p className="text-base md:text-xl font-extrabold text-white">{val}</p>
            <p className="text-[10px] md:text-xs font-medium" style={{ color: "rgba(247,241,232,0.50)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6"
        style={{ borderTop: "1px solid rgba(247,241,232,0.10)" }}
      >
        <p className="text-xs font-light" style={{ color: "rgba(247,241,232,0.40)" }}>
          © 2025 Stomatal Farms. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service"].map((t) => (
            <a
              key={t}
              href="#"
              className="text-xs font-light transition-colors hover:text-white"
              style={{ color: "rgba(247,241,232,0.40)" }}
            >
              {t}
            </a>
          ))}
          <a
            href="mailto:contact@stomatalfarms.com"
            className="text-xs font-light transition-colors hover:text-white"
            style={{ color: "rgba(247,241,232,0.40)" }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
