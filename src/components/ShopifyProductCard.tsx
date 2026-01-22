import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";


interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

export const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const { node } = product;
  
  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const compareAtPrice = node.compareAtPriceRange?.minVariantPrice;
  
  // Calculate discount percentage
  const currentPrice = parseFloat(price.amount);
  const originalPrice = compareAtPrice ? parseFloat(compareAtPrice.amount) : 0;
  const hasDiscount = originalPrice > currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;

  // Check if product is microgreens
  const isMicrogreens = node.title.toLowerCase().includes('microgreen') || 
    node.title.toLowerCase().includes('leafy') ||
    node.description.toLowerCase().includes('microgreen');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) return;

    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });

    toast.success("Added to cart", {
      description: node.title,
      position: "top-center",
    });
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productUrl = `https://stomatalfarms.com/products/${node.handle}`;
    const message = `Hi! I want to order: ${node.title} - Rs. ${Math.round(currentPrice)}`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=916379033131&text=${encodeURIComponent(message + ' ' + productUrl)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Link 
      to={`/product/${node.handle}`}
      className="group block"
    >
      <div className="bg-card rounded-lg overflow-hidden border border-border transition-all duration-300 hover:shadow-md">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-[#f5f0e8] relative">
          {/* Discount Badge */}
          {hasDiscount && discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-500 text-white font-medium text-[10px] px-1.5 py-0.5">
              {discountPercentage}% off
            </Badge>
          )}
          
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-3 text-center">
          {/* Title */}
          <h3 className="text-xs md:text-sm text-foreground mb-2 line-clamp-1 leading-snug">
            {node.title}
          </h3>
          
          {/* Price */}
          <div className="mb-3">
            <div className="font-semibold text-foreground text-base">
              ₹ {Math.round(currentPrice)}
            </div>
            {hasDiscount && (
              <div className="flex items-center justify-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground line-through">
                  ₹{Math.round(originalPrice)}
                </span>
                <span className="text-xs text-emerald-500 font-semibold">
                  {discountPercentage}% off
                </span>
              </div>
            )}
          </div>
          
          {/* Add to Cart / WhatsApp Button */}
          {isMicrogreens ? (
            <Button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#8dcc5b] text-white hover:bg-[#8dcc5b]/90 text-xs h-9 rounded font-medium shadow-sm"
            >
              <MessageCircle className="h-3 w-3 mr-1.5" />
              Buy via WhatsApp
            </Button>
          ) : (
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-[#8dcc5b] text-white hover:bg-[#8dcc5b]/90 text-xs h-9 rounded font-medium shadow-sm"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};
