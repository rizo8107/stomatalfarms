import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/shopify';
import { createCheckout, addToCheckout, updateCheckoutLineItem, removeFromCheckout, fetchCheckout, updateCheckoutAttributes } from '@/lib/shopify-api';
import { appendUtmToUrl, getShopifyCheckoutAttributes } from '@/lib/utm';

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
        
        // Track AddToCart
        if (typeof window !== 'undefined') {
          if (window.gtag) {
            window.gtag('event', 'add_to_cart', {
              currency: item.price.currencyCode,
              value: parseFloat(item.price.amount) * item.quantity,
              items: [{
                item_id: item.variantId,
                item_name: item.product.node.title,
                quantity: item.quantity,
                price: parseFloat(item.price.amount)
              }]
            });
          }
          if (window.fbq) {
            window.fbq('track', 'AddToCart', {
              content_ids: [item.variantId],
              content_name: item.product.node.title,
              content_type: 'product',
              value: parseFloat(item.price.amount) * item.quantity,
              currency: item.price.currencyCode
            });
          }
        }

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
          // Keys like _landing_page, _source_url, _ref, _ga are read by Shopify to attribute the order.
          const checkoutAttributes = getShopifyCheckoutAttributes();
          if (checkoutAttributes.length > 0) {
            await updateCheckoutAttributes(checkout.id, checkoutAttributes);
          }
          
          const finalCheckoutUrl = appendUtmToUrl(updatedCheckout.webUrl);
          setCheckoutUrl(finalCheckoutUrl);

          // Track InitiateCheckout
          if (typeof window !== 'undefined') {
            const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
            if (window.gtag) {
              window.gtag('event', 'begin_checkout', {
                currency: items[0]?.price.currencyCode || 'INR',
                value: totalValue,
                items: items.map(item => ({
                  item_id: item.variantId,
                  item_name: item.product.node.title,
                  quantity: item.quantity,
                  price: parseFloat(item.price.amount)
                }))
              });
            }
            if (window.fbq) {
              window.fbq('track', 'InitiateCheckout', {
                content_ids: items.map(item => item.variantId),
                content_type: 'product',
                value: totalValue,
                currency: items[0]?.price.currencyCode || 'INR',
                num_items: items.reduce((sum, item) => sum + item.quantity, 0)
              });
            }
          }
          
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
