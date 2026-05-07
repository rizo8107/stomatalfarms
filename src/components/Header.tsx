import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { items, setCartOpen } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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

          {/* Main nav — now visible on all screens */}
          <nav className="flex items-center gap-4 md:gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#2a3625] hover:text-[#4f7a2e] transition-colors outline-none group">
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
              className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#2a3625] hover:text-[#4f7a2e] transition-colors whitespace-nowrap"
            >
              Farm Fresh
            </Link>
            <Link
              to="/contact"
              className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#2a3625] hover:text-[#4f7a2e] transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/collections"
              className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_4px_12px_rgba(46,78,24,0.3)] transition-all hover:shadow-[0_6px_16px_rgba(46,78,24,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
            >
              Shop Now
            </Link>
            <CartDrawer />
            {/* Cart icon */}
            <button
              className="relative p-2 rounded-full hover:bg-[#4f7a2e]/5 transition-colors"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5 text-[#2a3625]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#b56c3d] text-white text-[9px] font-black flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
