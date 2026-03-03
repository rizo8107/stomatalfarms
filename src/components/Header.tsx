import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/7cc0e5_83fa66911e2a42aab710af3569d86773_mv2.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Leafy Greens", href: "/collections?category=microgreens" },
    { name: "Contact", href: "/contact" },
  ];

  const auroraCategories = [
    { name: "Incense Sticks", href: "/collections?category=sticks" },
    { name: "Incense Cups", href: "/collections?category=cups" },
    { name: "Combos", href: "/collections?category=combos" },
    { name: "Ghee Lamps", href: "/collections?category=ghee" },
    { name: "Bath Salts", href: "/collections?category=bath" },
    { name: "Cow Dung Ash", href: "/collections?category=all" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm text-black">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Stomatal Farms"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {/* Aurora Dropdown - First */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-black transition-colors duration-200 outline-none">
              Aurora
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {auroraCategories.map((category) => (
                <DropdownMenuItem key={category.name} asChild>
                  <Link to={category.href} className="hover:bg-[#5a8739]/10">
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-slate-600 hover:text-black transition-colors duration-200"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-black transition-colors duration-200"
              >
                {link.name}
              </a>
            )
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/collections">
            <Button variant="hero" size="sm" className="hidden md:flex">
              Shop Now
            </Button>
          </Link>
          <CartDrawer />

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-slate-800" />
            ) : (
              <Menu className="w-5 h-5 text-slate-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg">
          <nav className="container py-6 flex flex-col gap-4">
            {/* Aurora Section */}
            <div className="border-b border-border pb-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-medium">Aurora</p>
              {auroraCategories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className="block text-base font-medium text-slate-800 py-2 pl-4 hover:text-[#5a8739] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Other Nav Links */}
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-base font-medium text-slate-800 py-2 hover:text-[#5a8739] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-slate-800 py-2 hover:text-[#5a8739] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              )
            ))}
            <Link to="/collections" onClick={() => setIsMenuOpen(false)}>
              <Button variant="hero" className="mt-4 w-full">
                Shop Now
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

