# Headless Shopify Setup Guide

Your React app is now configured to use Shopify's Storefront API! This means you keep your beautiful React UI and use Shopify for all e-commerce functionality.

## What Was Done

✅ **Installed Shopify Buy SDK** - `shopify-buy` package  
✅ **Created API client** - `src/lib/shopify-client.ts`  
✅ **Created API functions** - `src/lib/shopify-api.ts`  
✅ **Updated cart store** - Now uses real Shopify checkout  
✅ **Environment setup** - `.env.example` with configuration  

## Setup Steps

### 1. Get Shopify Storefront API Credentials

You need to create a Storefront API access token:

1. **Go to your Shopify Admin**:
   - Visit: https://nvhu9m-0r.myshopify.com/admin

2. **Navigate to Apps**:
   - Settings → Apps and sales channels → Develop apps

3. **Create a new app**:
   - Click "Create an app"
   - Name it: "React Storefront"
   - Click "Create app"

4. **Configure Storefront API**:
   - Click "Configure Storefront API scopes"
   - Enable these scopes:
     - ✅ `unauthenticated_read_product_listings`
     - ✅ `unauthenticated_read_product_inventory`
     - ✅ `unauthenticated_read_product_tags`
     - ✅ `unauthenticated_read_collection_listings`
     - ✅ `unauthenticated_write_checkouts`
     - ✅ `unauthenticated_read_checkouts`
   - Click "Save"

5. **Install the app**:
   - Click "Install app"
   - Confirm installation

6. **Get your access token**:
   - Go to "API credentials" tab
   - Under "Storefront API access token"
   - Click "Reveal token once" or copy the token
   - **Save this token securely!**

### 2. Configure Environment Variables

1. **Create `.env` file** in your project root:
   ```bash
   cp .env.example .env
   ```

2. **Add your credentials** to `.env`:
   ```env
   VITE_SHOPIFY_STORE_DOMAIN=nvhu9m-0r.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_actual_token_here
   ```

3. **Replace `your_actual_token_here`** with the token you copied from Shopify

### 3. Add Products to Shopify

Your React app will fetch products from Shopify, so you need to add them:

1. **Go to Products** in Shopify Admin
2. **Add products** with:
   - Title
   - Description
   - Images
   - Price
   - Variants (if needed)
3. **Make products available** to Storefront API:
   - In product settings
   - Under "Sales channels and apps"
   - Enable "Headless" or your custom app

### 4. Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Check the console** for any errors

3. **Test functionality**:
   - Products should load from Shopify
   - Add to cart should work
   - Checkout should redirect to Shopify checkout

## How It Works

### Product Fetching

```typescript
import { fetchProducts } from '@/lib/shopify-api';

// Fetch all products
const products = await fetchProducts(20);

// Fetch product by handle
const product = await fetchProductByHandle('product-handle');
```

### Cart/Checkout Flow

1. **User adds items to cart** → Stored in Zustand state
2. **User clicks checkout** → Creates Shopify checkout with all items
3. **Redirects to Shopify** → Secure checkout on Shopify's domain
4. **After purchase** → Shopify handles order processing

### Architecture

```
React App (Your UI)
    ↓
Shopify Buy SDK
    ↓
Shopify Storefront API
    ↓
Shopify Backend (Products, Cart, Checkout, Orders)
```

## Benefits of This Approach

✅ **Keep your React UI** - No need to rebuild in Liquid  
✅ **Modern development** - React, TypeScript, your tools  
✅ **Fast performance** - SPA with API calls  
✅ **Shopify backend** - Products, cart, checkout, orders  
✅ **Secure checkout** - Shopify's PCI-compliant checkout  
✅ **Easy deployment** - Deploy React app anywhere (Vercel, Netlify, etc.)  

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Option 3: Custom Server
```bash
npm run build
# Serve dist folder with any static server
```

## Environment Variables in Production

When deploying, add these environment variables:

- `VITE_SHOPIFY_STORE_DOMAIN`
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

**Important**: These are public tokens (safe to expose in frontend)

## API Functions Available

All functions are in `src/lib/shopify-api.ts`:

- `fetchProducts()` - Get all products
- `fetchProductByHandle()` - Get single product
- `fetchCollection()` - Get collection with products
- `createCheckout()` - Create new checkout
- `addToCheckout()` - Add items to checkout
- `updateCheckoutLineItem()` - Update quantity
- `removeFromCheckout()` - Remove item
- `fetchCheckout()` - Get existing checkout
- `searchProducts()` - Search products

## Troubleshooting

### "Products not loading"
- Check your Storefront API token is correct
- Verify products are published to the Storefront API channel
- Check browser console for errors

### "Checkout not working"
- Ensure `unauthenticated_write_checkouts` scope is enabled
- Check that variant IDs are correct
- Verify checkout URL is being generated

### "CORS errors"
- Shopify Storefront API allows CORS by default
- If issues persist, check your API token permissions

## Next Steps

1. ✅ Get Storefront API token from Shopify
2. ✅ Add token to `.env` file
3. ✅ Add products to Shopify
4. ✅ Test locally with `npm run dev`
5. ✅ Deploy to Vercel/Netlify
6. ✅ Update domain settings if needed

## Resources

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Shopify Buy SDK](https://github.com/Shopify/js-buy-sdk)
- [Headless Commerce Guide](https://shopify.dev/docs/custom-storefronts)

Your React app is ready for headless Shopify! Just add your API credentials and you're good to go.
