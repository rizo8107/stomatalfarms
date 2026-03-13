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
      position: "bottom-right",
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
        position: "bottom-right",
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
      position: "bottom-right",
    });
  };

  return (
    <Link
      to={`/product/${node.handle}`}
      className="group block h-full"
    >
      <div className="bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full border border-white/50 shadow-soft">
        {/* Product Image Container */}
        <div className="aspect-square p-6 pb-2 relative flex items-center justify-center">
          {/* Discount Badge - Stylized */}
          {hasDiscount && discountPercentage > 0 && (
            <Badge className="absolute top-6 left-6 z-10 bg-terracotta hover:bg-terracotta text-white font-medium text-[10px] px-2 py-0.5 rounded-full border-none shadow-sm">
              {discountPercentage}% off
            </Badge>
          )}

          <div className="w-full h-full rounded-2xl overflow-hidden bg-[#F9FBF9] flex items-center justify-center">
            {firstImage ? (
              <img
                src={firstImage.url}
                alt={firstImage.altText || node.title}
                className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] uppercase tracking-tighter">
                No image
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 pt-2 flex flex-col flex-grow">
          <div className="flex-grow mb-4">
            {/* Title - Clean & Bold */}
            <h3 className="text-sm md:text-base font-semibold text-[#1a1a1a] mb-1 leading-tight group-hover:text-primary transition-colors">
              {node.title}
            </h3>
          </div>

          {/* Footer: Price and Add to Cart Button */}
          <div className="flex flex-col gap-3 mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-foreground">
                ₹{Math.round(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through decoration-terracotta/50">
                  ₹{Math.round(originalPrice)}
                </span>
              )}
            </div>

            <Button
              onClick={isMicrogreens ? handleWhatsAppOrder : handleAddToCart}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 py-6 font-medium"
            >
              {isMicrogreens ? (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Order on WhatsApp
                </>
              ) : (
                "Add to Cart"
              )}
            </Button>
          </div>
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
              className="flex-1 bg-[#5a8739] hover:bg-[#5a8739]/90 text-white"
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

