import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

export const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const { node } = product;
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  
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
    setShowAddressDialog(true);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const submitWhatsAppOrder = () => {
    if (!addressData.name || !addressData.phone || !addressData.address) {
      toast.error("Please fill in all fields", {
        position: "top-center",
      });
      return;
    }

    const productUrl = `https://stomatalfarms.com/products/${node.handle}`;
    const message = `Hi! I want to order:

Product: ${node.title}
Price: Rs. ${Math.round(currentPrice)}

Delivery Details:
Name: ${addressData.name}
Phone: ${addressData.phone}
Address: ${addressData.address}

Product Link: ${productUrl}`;

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=916379033131&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
    
    setShowAddressDialog(false);
    setAddressData({ name: "", phone: "", address: "" });
    
    toast.success("Opening WhatsApp...", {
      description: "Your order details have been prepared",
      position: "top-center",
    });
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

      {/* Address Collection Dialog for Microgreens */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>
              Please provide your delivery information to complete your order via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={addressData.name}
                onChange={handleAddressChange}
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                Phone Number *
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={addressData.phone}
                onChange={handleAddressChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                Delivery Address *
              </label>
              <Textarea
                id="address"
                name="address"
                value={addressData.address}
                onChange={handleAddressChange}
                placeholder="Enter your complete delivery address"
                rows={4}
                className="w-full resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddressDialog(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                submitWhatsAppOrder();
              }}
              className="flex-1 bg-[#8dcc5b] hover:bg-[#8dcc5b]/90 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Link>
  );
};
