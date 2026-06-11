import Client from 'shopify-buy';

// Initialize Shopify Buy SDK Client
const client = Client.buildClient({
  domain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'pay.stomatalfarms.com',
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
});

export default client;

// Type definitions for better TypeScript support
export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: Array<{
    id: string;
    src: string;
    altText: string | null;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice: {
      amount: string;
      currencyCode: string;
    } | null;
    available: boolean;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  }>;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  } | null;
};

export type ShopifyCart = {
  id: string;
  webUrl: string;
  lineItems: Array<{
    id: string;
    title: string;
    quantity: number;
    variant: {
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      image: {
        src: string;
        altText: string | null;
      } | null;
    };
  }>;
  lineItemsSubtotalPrice: {
    amount: string;
    currencyCode: string;
  };
};
