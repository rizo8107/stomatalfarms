import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="about" className="py-16 md:py-24 bg-[#1a2316] text-[#faf7f2] border-t border-white/5 relative z-20">
      <div className="container px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-10 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="font-serif text-3xl font-semibold text-white tracking-tight">
                Stomatal Farms
              </span>
            </Link>
            <p className="text-[#faf7f2]/70 max-w-md mb-8 leading-relaxed font-light text-base">
              Cultivating Freshness, Embracing Nature. We grow fresh greens and craft
              Aurora aromatic wellness products from traditional Indian herbs.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/stomatalfarms/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#5a8739] hover:border-[#5a8739] transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:contact@stomatalfarms.com"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#5a8739] hover:border-[#5a8739] transition-all duration-300"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-medium text-white tracking-wide uppercase text-sm">Aurora Products</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/collections?category=sticks" className="text-[#faf7f2]/70 hover:text-white transition-colors text-base font-light">
                  Incense Sticks
                </Link>
              </li>
              <li>
                <Link to="/collections?category=cups" className="text-[#faf7f2]/70 hover:text-white transition-colors text-base font-light">
                  Incense Cups
                </Link>
              </li>
              <li>
                <Link to="/collections?category=combos" className="text-[#faf7f2]/70 hover:text-white transition-colors text-base font-light">
                  Combo Packs
                </Link>
              </li>
              <li>
                <Link to="/collections?category=ghee" className="text-[#faf7f2]/70 hover:text-white transition-colors text-base font-light">
                  Ghee Lamps
                </Link>
              </li>
              <li>
                <Link to="/collections?category=bath" className="text-[#faf7f2]/70 hover:text-white transition-colors text-base font-light">
                  Bath Salts
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-medium text-white tracking-wide uppercase text-sm">Stay Connected</h4>
            <p className="text-[#faf7f2]/70 text-base font-light leading-relaxed">
              Join our community for rituals, new releases & exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3 text-base rounded-full border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#5a8739]/50 transition-all font-light"
              />
              <Button className="rounded-full bg-[#5a8739] hover:bg-[#4a722e] text-white px-8 py-3 h-auto font-semibold shadow-lg shadow-[#5a8739]/20 transition-all text-base border-none">
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-[#faf7f2]/50 font-light tracking-wide">
            © 2025 Stomatal Farms. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-[#faf7f2]/50 hover:text-white transition-colors font-light tracking-wide">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-[#faf7f2]/50 hover:text-white transition-colors font-light tracking-wide">
              Terms of Service
            </a>
            <a href="mailto:contact@stomatalfarms.com" className="text-sm text-[#faf7f2]/50 hover:text-white transition-colors font-light tracking-wide">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
