import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
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
  const location = useLocation();

  const isActive = (href: string) =>
    location.pathname + location.search === href ||
    (href.startsWith("/collections") && location.pathname === "/collections" && href.includes(location.search));

  return (
    <>
      {/* Top trust bar */}
      <div
        className="w-full text-white text-center py-2 px-4 text-xs font-medium tracking-wide"
        style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
      >
        🌿 Free shipping above ₹599 &nbsp;·&nbsp; 100% Natural &amp; Chemical-free &nbsp;·&nbsp; Gift packaging available
      </div>

      <header className="sticky top-0 left-0 right-0 z-50 bg-[#fffbf5] border-b border-[rgba(46,63,37,0.10)] shadow-sm">
        <div className="container flex items-center justify-between h-14 md:h-16 px-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Stomatal Farms" className="h-9 md:h-11 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-[#1e2519] hover:text-[#4f7a2e] transition-colors outline-none">
                Aurora
                <svg className="w-3.5 h-3.5 mt-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#fffbf5] border border-[rgba(46,63,37,0.12)] rounded-xl shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {auroraCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.href}
                    className={`block px-4 py-2 text-sm font-medium transition-colors ${
                      isActive(cat.href) ? "text-[#4f7a2e]" : "text-[#1e2519] hover:text-[#4f7a2e] hover:bg-[rgba(79,122,46,0.06)]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/collections?category=microgreens"
              className="text-sm font-medium text-[#1e2519] hover:text-[#4f7a2e] transition-colors"
            >
              Farm Fresh
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-[#1e2519] hover:text-[#4f7a2e] transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/collections"
              className="hidden md:inline-flex items-center px-5 py-2 rounded-full text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
            >
              Shop Now
            </Link>
            <CartDrawer />
            <button
              className="md:hidden p-2 rounded-full hover:bg-[rgba(79,122,46,0.08)] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5 text-[#1e2519]" /> : <Menu className="w-5 h-5 text-[#1e2519]" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#fffbf5] border-t border-[rgba(46,63,37,0.10)]">
            <nav className="container px-4 py-5 flex flex-col gap-1 max-w-7xl mx-auto">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#6a7462] mb-2">Aurora</p>
              {auroraCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.href}
                  className={`py-2 pl-3 text-base font-medium rounded-lg transition-colors ${
                    isActive(cat.href) ? "text-[#4f7a2e] bg-[rgba(79,122,46,0.08)]" : "text-[#1e2519] hover:text-[#4f7a2e]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <div className="my-2 border-t border-[rgba(46,63,37,0.10)]" />
              <Link to="/collections?category=microgreens" className="py-2 pl-3 text-base font-medium text-[#1e2519] hover:text-[#4f7a2e]" onClick={() => setIsMenuOpen(false)}>Farm Fresh Produce</Link>
              <Link to="/contact" className="py-2 pl-3 text-base font-medium text-[#1e2519] hover:text-[#4f7a2e]" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link
                to="/collections"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 w-full text-center py-3 rounded-full text-base font-bold text-white shadow-md"
                style={{ background: "linear-gradient(135deg, #2e4e18, #4f7a2e)" }}
              >
                Shop Now
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
