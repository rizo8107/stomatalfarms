/**
 * Unified Analytics & Ads Tracking Library
 * Handles Meta Pixel (fbq) and Google Analytics / Google Ads (gtag) events
 * Standardized according to Meta Conversions API & GA4 E-Commerce specs
 */

export interface TrackingProduct {
  id: string; // Product or Variant ID
  title: string;
  price: number | string;
  currency?: string;
  category?: string;
  quantity?: number;
  handle?: string;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const DEFAULT_CURRENCY = 'INR';

/**
 * Format clean numeric value
 */
const parsePrice = (price: number | string): number => {
  if (typeof price === 'number') return price;
  const cleaned = String(price).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Track PageView across all platforms
 */
export const trackPageView = (path?: string) => {
  if (typeof window === 'undefined') return;

  const currentPath = path || window.location.pathname + window.location.search;

  // Google Analytics 4 / Google Tag
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: currentPath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Track ViewContent / view_item when a user visits a product page
 * Critical for Facebook Dynamic Product Ads (DPA) and Google Ads Remarketing
 */
export const trackViewContent = (product: {
  id: string;
  variantId?: string;
  title: string;
  price: number | string;
  currency?: string;
  category?: string;
}) => {
  if (typeof window === 'undefined') return;

  const priceNum = parsePrice(product.price);
  const currency = product.currency || DEFAULT_CURRENCY;
  const contentId = product.variantId || product.id;

  // Google Analytics 4 / Google Ads
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: currency,
      value: priceNum,
      items: [
        {
          item_id: contentId,
          item_name: product.title,
          price: priceNum,
          item_category: product.category || 'Incense & Aromatic Wellness',
        },
      ],
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [contentId],
      content_name: product.title,
      content_type: 'product',
      content_category: product.category || 'Incense & Aromatic Wellness',
      value: priceNum,
      currency: currency,
    });
  }
};

/**
 * Track AddToCart / add_to_cart
 */
export const trackAddToCart = (product: {
  id: string;
  variantId?: string;
  title: string;
  price: number | string;
  quantity: number;
  currency?: string;
  category?: string;
}) => {
  if (typeof window === 'undefined') return;

  const unitPrice = parsePrice(product.price);
  const totalPrice = unitPrice * (product.quantity || 1);
  const currency = product.currency || DEFAULT_CURRENCY;
  const contentId = product.variantId || product.id;

  // Google Analytics 4 / Google Ads
  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: currency,
      value: totalPrice,
      items: [
        {
          item_id: contentId,
          item_name: product.title,
          price: unitPrice,
          quantity: product.quantity || 1,
          item_category: product.category || 'Incense & Aromatic Wellness',
        },
      ],
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [contentId],
      content_name: product.title,
      content_type: 'product',
      value: totalPrice,
      currency: currency,
    });
  }
};

/**
 * Track InitiateCheckout / begin_checkout
 */
export const trackInitiateCheckout = (
  items: Array<{
    id: string;
    variantId?: string;
    title: string;
    price: number | string;
    quantity: number;
  }>,
  totalValue: number,
  currency: string = DEFAULT_CURRENCY
) => {
  if (typeof window === 'undefined') return;

  const contentIds = items.map((i) => i.variantId || i.id);
  const totalQuantity = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

  // Google Analytics 4 / Google Ads
  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: currency,
      value: totalValue,
      items: items.map((i) => ({
        item_id: i.variantId || i.id,
        item_name: i.title,
        price: parsePrice(i.price),
        quantity: i.quantity,
      })),
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      content_type: 'product',
      value: totalValue,
      currency: currency,
      num_items: totalQuantity,
    });
  }
};

/**
 * Track Site Search
 */
export const trackSearch = (searchTerm: string) => {
  if (typeof window === 'undefined' || !searchTerm) return;

  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }

  if (window.fbq) {
    window.fbq('track', 'Search', {
      search_string: searchTerm,
    });
  }
};

/**
 * Track Lead / Contact Inquiries
 */
export const trackContact = () => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'Contact',
    });
  }

  if (window.fbq) {
    window.fbq('track', 'Contact');
  }
};
