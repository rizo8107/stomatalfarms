import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ShopifyProductCard } from "@/components/ShopifyProductCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", name: "All Products", query: "" },
  { id: "microgreens", name: "Farm Fresh Produce", query: "microgreen OR greens OR leafy" },
  { id: "cups", name: "Incense Cups", query: "cup" },
  { id: "sticks", name: "Incense Sticks", query: "stick" },
  { id: "combos", name: "Combo Packs", query: "combo" },
  { id: "ghee", name: "Ghee Lamps", query: "ghee OR diya" },
  { id: "bath", name: "Bath Salts", query: "bath salt" },
  { id: "ash", name: "Cow Dung Ash", query: "bhasma OR dung ash OR vibhuti OR -diya" },
];

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const loadProducts = async () => {
      try {
        const data = await fetchProducts(50);
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (activeCategory === "all" || !activeCategory) {
      setFilteredProducts(products);
    } else {
      const category = categories.find(c => c.id === activeCategory);
      if (category && category.query) {
        const queryTerms = category.query.split(/\s+OR\s+/i).map(t => t.trim().toLowerCase());
        const includeTerms = queryTerms.filter(t => !t.startsWith('-'));
        const excludeTerms = queryTerms.filter(t => t.startsWith('-')).map(t => t.substring(1));

        const filtered = products.filter(product => {
          const title = product.node.title.toLowerCase();
          const description = (product.node.description || "").toLowerCase();
          const content = title + " " + description;

          // Must match at least one include term
          const matchesInclude = includeTerms.length === 0 || includeTerms.some(term => content.includes(term));
          // Must NOT match any exclude terms
          const matchesExclude = excludeTerms.some(term => content.includes(term));

          return matchesInclude && !matchesExclude;
        });
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
    }
  }, [activeCategory, products]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background texture-overlay">
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero Banner */}
        <section className="py-12 md:py-16 bg-sage-light/30">
          <div className="container text-center">
            <span className="text-primary text-xs uppercase tracking-[0.2em] mb-3 block">
              {activeCategory === 'microgreens' ? 'Stomatal Farms' : 'Aurora Collection'}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              {categories.find(c => c.id === activeCategory)?.name || "All Products"}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {activeCategory === 'microgreens'
                ? 'Fresh, nutrient-dense farm-grown microgreens and produce harvested daily and delivered to your doorstep for maximum flavor and nutrition.'
                : 'Authentic aromatic wellness products crafted from traditional Indian herbs, essential oils, and pure cow dung. Lab-tested for your family\'s well-being.'}
            </p>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-6 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-sm z-40">
          <div className="container">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className={`whitespace-nowrap rounded-full ${activeCategory === category.id
                      ? "bg-[#5a8739] text-white"
                      : "border-border hover:bg-sage-light"
                    }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 md:py-20">
          <div className="container">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="max-w-md mx-auto">
                  <h3 className="font-serif text-2xl text-foreground mb-3">No products found</h3>
                  <p className="text-muted-foreground mb-6">
                    No products match this category. Try browsing all products instead.
                  </p>
                  <Button onClick={() => handleCategoryChange("all")}>
                    View All Products
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm mb-6">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {filteredProducts.map((product) => (
                    <ShopifyProductCard key={product.node.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;

