import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import logo from "@/assets/7cc0e5_83fa66911e2a42aab710af3569d86773_mv2.png";

const auroraCategories = [
  { name: "Incense Sticks", href: "/collections?category=sticks" },
  { name: "Incense Cups", href: "/collections?category=cups" },
  { name: "Combos", href: "/collections?category=combos" },
  { name: "Ghee Lamps", href: "/collections?category=ghee" },
  { name: "Bath Salts", href: "/collections?category=bath" },
  { name: "Cow Dung Ash", href: "/collections?category=ash" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    location.pathname + location.search === href ||
    (href.startsWith("/collections") && location.pathname === "/collections" && href.includes(location.search));

  return (
    <>
      {/* Top trust bar */}
      <div
        className="w-full text-white text-center py-2.5 px-4 text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase"
        style={{ background: "linear-gradient(135deg, #1e3612, #2e4e18)" }}
      >
        🌿 100% Natural &nbsp;·&nbsp; Ritual Ready
      </div>

      <header 
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-[#2e3f25]/5 py-2" 
            : "bg-[#fffbf5] border-b border-transparent py-4"
        }`}
      >
        <div className="container flex items-center justify-between px-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]">
            <img src={logo} alt="Stomatal Farms" className={`transition-all duration-300 ${isScrolled ? "h-8 md:h-9" : "h-10 md:h-12"} w-auto object-contain`} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#2a3625] hover:text-[#4f7a2e] transition-colors outline-none group">
                Aurora
                <ChevronDown className="w-3 h-3 opacity-40 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white/95 backdrop-blur-lg border border-[#2e3f25]/10 rounded-[20px] shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                {auroraCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.href}
                    className={`block px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                      isActive(cat.href) 
                        ? "text-[#4f7a2e] bg-[#4f7a2e]/5" 
                        : "text-[#2a3625] hover:text-[#4f7a2e] hover:bg-[#4f7a2e]/5"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/collections?category=microgreens"
              className="text-xs font-bold uppercase tracking-widest text-[#2a3625] hover:text-[#4f7a2e] transition-colors"
            >
              Farm Fresh
            </Link>
            <Link
              to="/contact"
              className="text-xs font-bold uppercase tracking-widest text-[#2a3625] hover:text-[#4f7a2e] transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/collections"
              className="hidden sm:inline-flex items-center px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_4px_12px_rgba(46,78,24,0.3)] transition-all hover:shadow-[0_6px_16px_rgba(46,78,24,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
            >
              Shop Now
            </Link>
            <CartDrawer />
            <button
              className="md:hidden p-2.5 rounded-full hover:bg-[#4f7a2e]/5 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5 text-[#2a3625]" /> : <Menu className="w-5 h-5 text-[#2a3625]" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden fixed inset-x-0 bg-white/95 backdrop-blur-xl border-t border-[#2e3f25]/5 transition-all duration-500 ease-in-out z-40 overflow-hidden ${
            isMenuOpen ? "max-h-[85vh] py-8 opacity-100" : "max-h-0 py-0 opacity-0"
          }`}
        >
          <nav className="container px-6 flex flex-col gap-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-[0.25em] font-black text-[#5c6e58]/60 mb-2">Our Collections</p>
              <div className="grid grid-cols-2 gap-2">
                {auroraCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.href}
                    className={`py-3 px-4 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-colors ${
                      isActive(cat.href) 
                        ? "text-[#4f7a2e] bg-[#4f7a2e]/10 shadow-sm" 
                        : "text-[#2a3625] bg-[#2e3f25]/5"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-[0.25em] font-black text-[#5c6e58]/60 mb-2">Discovery</p>
              <Link to="/collections?category=microgreens" className="py-4 border-b border-[#2e3f25]/5 text-xs font-bold uppercase tracking-widest text-[#2a3625]" onClick={() => setIsMenuOpen(false)}>Farm Fresh Produce</Link>
              <Link to="/contact" className="py-4 border-b border-[#2e3f25]/5 text-xs font-bold uppercase tracking-widest text-[#2a3625]" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
            </div>
            <Link
              to="/collections"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl"
              style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
            >
              Start Shopping
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
