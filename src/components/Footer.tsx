import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="about" className="py-16 md:py-20 border-t border-border">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold text-foreground">
                Stomatal Farms
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
              Cultivating Freshness, Embracing Nature. We grow fresh greens and craft 
              Aurora aromatic wellness products from traditional Indian herbs.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Aurora Products</h4>
            <ul className="space-y-3">
              <li>
                <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Incense Sticks
                </a>
              </li>
              <li>
                <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Incense Cups
                </a>
              </li>
              <li>
                <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Combo Packs
                </a>
              </li>
              <li>
                <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Ghee Lamps
                </a>
              </li>
              <li>
                <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Bath Salts
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Stay Connected</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Join our community for rituals, new releases & exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 text-sm rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button variant="default" size="sm" className="rounded-full px-4">
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div id="contact" className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Stomatal Farms. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
