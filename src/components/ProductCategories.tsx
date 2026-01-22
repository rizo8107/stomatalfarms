import { Link } from "react-router-dom";

const categories = [
  {
    name: "Incense Cups",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/8cc70f16-1c6a-4429-97c5-5609582b0b3d.jpg?v=1757489082",
    description: "Handcrafted cups made from cow dung",
    link: "/collections?category=cups",
  },
  {
    name: "Incense Sticks",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/ea0cf119-44bf-493c-b2df-36eab2c43b70.jpg?v=1757489122",
    description: "Bamboo-less sticks with pure herbs",
    link: "/collections?category=sticks",
  },
  {
    name: "Combo Packs",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/7b9ccf00-4df1-4412-ab72-bf3a24d59552.jpg?v=1757489157",
    description: "Complete aromatic wellness bundles",
    link: "/collections?category=combos",
  },
  {
    name: "Ghee Lamps",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/4a9b45ef-2389-4561-a655-01e94a2d38e2.jpg?v=1757489189",
    description: "Panchagavya ghee-filled diyas",
    link: "/collections?category=ghee",
  },
  {
    name: "Bath Salts",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/f95000d1-6627-4602-bba0-33a568379747.jpg?v=1757489305",
    description: "Relaxing & detoxifying self-care",
    link: "/collections?category=bath",
  },
  {
    name: "All Products",
    image: "https://cdn.shopify.com/s/files/1/0735/4469/5965/files/aaWhatsAppImage2025-09-15at18.13.24.jpg?v=1757948321",
    description: "Browse our complete collection",
    link: "/collections",
  },
];

const ProductCategories = () => {
  return (
    <section className="py-16 md:py-24 bg-sage-light/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-primary text-xs uppercase tracking-[0.2em] mb-3 block">
            Aurora Collection
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Explore Our Handcrafted Products
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Lab-tested aromatic wellness products made from cow dung & traditional herbs for your family's well-being.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.link}
              className="group relative aspect-square rounded-2xl overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-earth/80 via-earth/30 to-transparent transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="font-serif text-lg md:text-xl text-warm-white font-medium leading-tight">
                  {category.name}
                </h3>
                <p className="text-warm-white/70 text-xs mt-1 hidden md:block">
                  {category.description}
                </p>
              </div>
              
              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
