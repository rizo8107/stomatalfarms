import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/shopify';
import { createCheckout, addToCheckout, updateCheckoutLineItem, removeFromCheckout, fetchCheckout, updateCheckoutAttributes } from '@/lib/shopify-api';
import { appendUtmToUrl, getShopifyCheckoutAttributes } from '@/lib/utm';
import { trackAddToCart, trackInitiateCheckout } from '@/lib/tracking';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isCartOpen: boolean;

  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  setCartOpen: (open: boolean) => void;
  createCheckout: () => Promise<string | null>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isCartOpen: false,

      setCartOpen: (open) => set({ isCartOpen: open }),

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        // Track AddToCart across Meta Pixel & Google Analytics/Ads
        trackAddToCart({
          id: item.product.node.id,
          variantId: item.variantId,
          title: item.product.node.title,
          price: item.price.amount,
          quantity: item.quantity,
          currency: item.price.currencyCode,
        });

        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            isCartOpen: true,
          });
        } else {
          set({ items: [...items, item], isCartOpen: true });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl, setCartId } = get();
        if (items.length === 0) return null;

        setLoading(true);
        try {
          // Create a new checkout
          const checkout = await createCheckout();
          setCartId(checkout.id);
          
          // Add all items to the checkout
          const lineItems = items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
          }));
          
          const updatedCheckout = await addToCheckout(checkout.id, lineItems);
          
          // Add UTM + Shopify tracking attributes to the checkout.
          // This populates the "Conversion Summary" panel in Shopify Admin.
          // Keys like _landing_page, _source_url, _ref, _ga, _fbc, _fbp are read by Shopify to attribute the order.
          const checkoutAttributes = getShopifyCheckoutAttributes();
          if (checkoutAttributes.length > 0) {
            await updateCheckoutAttributes(checkout.id, checkoutAttributes);
          }
          
          const finalCheckoutUrl = appendUtmToUrl(updatedCheckout.webUrl);
          setCheckoutUrl(finalCheckoutUrl);

          // Track InitiateCheckout / begin_checkout
          const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
          trackInitiateCheckout(
            items.map(item => ({
              id: item.product.node.id,
              variantId: item.variantId,
              title: item.product.node.title,
              price: item.price.amount,
              quantity: item.quantity,
            })),
            totalValue,
            items[0]?.price.currencyCode || 'INR'
          );
          
          return finalCheckoutUrl;
        } catch (error) {
          console.error('Failed to create checkout:', error);
          return null;
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: 'incense-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
