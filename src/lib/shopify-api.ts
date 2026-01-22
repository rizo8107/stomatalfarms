import client from './shopify-client';

/**
 * Fetch all products from Shopify
 */
export async function fetchProducts(limit = 20) {
  try {
    const products = await client.product.fetchAll(limit);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by handle
 */
export async function fetchProductByHandle(handle: string) {
  try {
    const product = await client.product.fetchByHandle(handle);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Fetch products from a specific collection
 */
export async function fetchCollection(collectionId: string) {
  try {
    const collection = await client.collection.fetchWithProducts(collectionId, {
      productsFirst: 20,
    });
    return collection;
  } catch (error) {
    console.error('Error fetching collection:', error);
    throw error;
  }
}

/**
 * Create a new checkout (cart)
 */
export async function createCheckout() {
  try {
    const checkout = await client.checkout.create();
    return checkout;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
}

/**
 * Add items to checkout
 */
export async function addToCheckout(checkoutId: string, lineItems: Array<{ variantId: string; quantity: number }>) {
  try {
    const checkout = await client.checkout.addLineItems(checkoutId, lineItems);
    return checkout;
  } catch (error) {
    console.error('Error adding to checkout:', error);
    throw error;
  }
}

/**
 * Update line item quantity in checkout
 */
export async function updateCheckoutLineItem(checkoutId: string, lineItemId: string, quantity: number) {
  try {
    const checkout = await client.checkout.updateLineItems(checkoutId, [
      { id: lineItemId, quantity },
    ]);
    return checkout;
  } catch (error) {
    console.error('Error updating checkout:', error);
    throw error;
  }
}

/**
 * Remove line item from checkout
 */
export async function removeFromCheckout(checkoutId: string, lineItemId: string) {
  try {
    const checkout = await client.checkout.removeLineItems(checkoutId, [lineItemId]);
    return checkout;
  } catch (error) {
    console.error('Error removing from checkout:', error);
    throw error;
  }
}

/**
 * Fetch existing checkout by ID
 */
export async function fetchCheckout(checkoutId: string) {
  try {
    const checkout = await client.checkout.fetch(checkoutId);
    return checkout;
  } catch (error) {
    console.error('Error fetching checkout:', error);
    throw error;
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string) {
  try {
    const products = await client.product.fetchQuery({
      query: `title:${query}*`,
      first: 20,
    });
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}
