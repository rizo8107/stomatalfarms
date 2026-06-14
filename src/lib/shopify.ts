import { toast } from "sonner";

const SHOPIFY_API_VERSION = '2024-01';
const SHOPIFY_STORE_PERMANENT_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'pay.stomatalfarms.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
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
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    combo_includes?: { value: string } | null;
    ingredients?: { value: string } | null;
    ingredients_list?: { value: string } | null;
    how_to_use?: { value: string } | null;
    product_details?: { value: string } | null;
    nutritional_focus?: { value: string } | null;
    harvest_window?: { value: string } | null;
    delivery_region?: { value: string } | null;
    premium_quality?: { value: string } | null;
    ash_usage?: { value: string } | null;
    safety_info?: { value: string } | null;
    burning_time?: { value: string } | null;
    storage?: { value: string } | null;
    fssai_license?: { value: string } | null;
    shelf_life?: { value: string } | null;
    net_quantity?: { value: string } | null;
    custom_shipping_label?: { value: string } | null;
    custom_description?: { value: string } | null;
    key_highlights?: { value: string } | null;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Payment required on Shopify");
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    // Check if ALL errors are metafield access errors — if so, return partial data instead of crashing
    const metafieldErrors = data.errors.filter((e: { message: string }) =>
      e.message.includes('unauthenticated_read_metafields')
    );
    const otherErrors = data.errors.filter((e: { message: string }) =>
      !e.message.includes('unauthenticated_read_metafields')
    );

    if (otherErrors.length > 0) {
      // Real errors — throw as before
      throw new Error(`Error calling Shopify: ${otherErrors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    if (metafieldErrors.length > 0) {
      // Metafield scope not enabled yet — log warning, return whatever data we got
      console.warn(
        `Shopify metafields not accessible yet. Enable "Storefront access" for each metafield in Shopify Admin → Settings → Custom data → Metafields → Products.`
      );
      return data; // partial data still has the product, just null metafields
    }
  }

  return data;
}

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
      combo_includes: metafield(namespace: "custom", key: "combo_includes") {
        value
      }
      ingredients: metafield(namespace: "custom", key: "ingredients") {
        value
      }
      ingredients_list: metafield(namespace: "custom", key: "ingredients_list") {
        value
      }
      how_to_use: metafield(namespace: "custom", key: "how_to_use") {
        value
      }
      product_details: metafield(namespace: "custom", key: "product_details") {
        value
      }
      nutritional_focus: metafield(namespace: "custom", key: "nutritional_focus") {
        value
      }
      harvest_window: metafield(namespace: "custom", key: "harvest_window") {
        value
      }
      delivery_region: metafield(namespace: "custom", key: "delivery_region") {
        value
      }
      premium_quality: metafield(namespace: "custom", key: "premium_quality") {
        value
      }
      ash_usage: metafield(namespace: "custom", key: "ash_usage") {
        value
      }
      safety_info: metafield(namespace: "custom", key: "safety_info") {
        value
      }
      burning_time: metafield(namespace: "custom", key: "burning_time") {
        value
      }
      storage: metafield(namespace: "custom", key: "storage") {
        value
      }
      fssai_license: metafield(namespace: "custom", key: "fssai_license") {
        value
      }
      shelf_life: metafield(namespace: "custom", key: "shelf_life") {
        value
      }
      net_quantity: metafield(namespace: "custom", key: "net_quantity") {
        value
      }
      custom_shipping_label: metafield(namespace: "custom", key: "custom_shipping_label") {
        value
      }
      custom_description: metafield(namespace: "custom", key: "custom_description") {
        value
      }
      key_highlights: metafield(namespace: "custom", key: "key_highlights") {
        value
      }
    }
  }
`;

export async function fetchProducts(first: number = 20): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first });
  if (!data) return [];
  return data.data.products.edges || [];
}

// Lightweight query without metafields — used as fallback when metafield scope is not enabled
const PRODUCT_BY_HANDLE_QUERY_NO_METAFIELDS = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct['node'] | null> {
  try {
    const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
    if (!data) return null;
    return data.data.product || null;
  } catch (err) {
    // If metafield query failed with a real error, fall back to query without metafields
    console.warn('Falling back to product query without metafields:', err);
    const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY_NO_METAFIELDS, { handle });
    if (!data) return null;
    return data.data.product || null;
  }
}

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createStorefrontCheckout(items: Array<{ variantId: string; quantity: number }>): Promise<string> {
  const lines = items.map(item => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines },
  });

  if (!cartData) {
    throw new Error('Failed to create checkout');
  }

  if (cartData.data.cartCreate.userErrors.length > 0) {
    throw new Error(`Cart creation failed: ${cartData.data.cartCreate.userErrors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  const cart = cartData.data.cartCreate.cart;

  if (!cart.checkoutUrl) {
    throw new Error('No checkout URL returned from Shopify');
  }

  const url = new URL(cart.checkoutUrl);
  // Ensure the checkout uses our custom domain
  if (url.hostname.endsWith('myshopify.com')) {
    url.hostname = SHOPIFY_STORE_PERMANENT_DOMAIN;
  }
  url.searchParams.set('channel', 'online_store');
  return url.toString();
}
