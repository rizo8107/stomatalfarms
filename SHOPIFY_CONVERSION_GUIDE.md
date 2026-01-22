# React to Shopify Theme Conversion Guide

## Overview

This document explains how to convert your React-based Muse Scent Studio application to a Shopify theme. The conversion has been completed and the Shopify theme is available in the `shopify-theme/` directory.

## Conversion Approach

### What Was Done

Your React application has been converted to a **native Shopify Liquid theme**. This approach provides:

✅ **Full Shopify Integration** - Native cart, checkout, and admin features  
✅ **Better Performance** - Server-side rendering, no React overhead  
✅ **Easier Maintenance** - Standard Shopify theme structure  
✅ **SEO Optimized** - Proper meta tags and structured data  
✅ **No Hosting Costs** - Hosted on Shopify's infrastructure  

## Architecture Changes

### Before (React SPA)
```
React Components → React Router → Zustand State → Vite Build → Static Hosting
```

### After (Shopify Theme)
```
Liquid Templates → Shopify Routing → Ajax Cart API → Shopify CDN
```

## Component Mapping

| React Component | Shopify Equivalent | Location |
|----------------|-------------------|----------|
| `Header.tsx` | `header.liquid` | `sections/header.liquid` |
| `Footer.tsx` | `footer.liquid` | `sections/footer.liquid` |
| `HeroSection.tsx` | `hero-section.liquid` | `sections/hero-section.liquid` |
| `FeaturesBar.tsx` | `features-bar.liquid` | `sections/features-bar.liquid` |
| `CraftPuritySection.tsx` | `craft-purity.liquid` | `sections/craft-purity.liquid` |
| `ProductCategories.tsx` | `product-categories.liquid` | `sections/product-categories.liquid` |
| `ProductsSection.tsx` | `featured-collection.liquid` | `sections/featured-collection.liquid` |
| `RitualsSection.tsx` | `rituals-section.liquid` | `sections/rituals-section.liquid` |
| `ShopifyProductCard.tsx` | `product-card.liquid` | `snippets/product-card.liquid` |
| `ProductDetail.tsx` | `main-product.liquid` | `sections/main-product.liquid` |
| `Collections.tsx` | `collection.json` + sections | `templates/collection.json` |
| `CartDrawer.tsx` | Cart Ajax API + `cart.js` | `assets/cart.js` |

## Page Routing Changes

### React Router → Shopify Templates

| React Route | Shopify Template | File |
|------------|-----------------|------|
| `/` | Homepage | `templates/index.json` |
| `/collections` | Collection List | `templates/collection.json` |
| `/product/:handle` | Product Page | `templates/product.json` |
| `/cart` | Cart Page | `templates/cart.json` |

## State Management Changes

### React (Zustand) → Shopify Ajax API

**Before (React/Zustand):**
```javascript
const addItem = useCartStore(state => state.addItem);
addItem({ product, variantId, quantity: 1 });
```

**After (Shopify):**
```javascript
fetch('/cart/add.js', {
  method: 'POST',
  body: JSON.stringify({ id: variantId, quantity: 1 })
});
```

## Styling Changes

### TailwindCSS → Custom CSS

Your Tailwind classes have been converted to custom CSS using CSS variables for consistency:

**Before (React/Tailwind):**
```jsx
<div className="bg-primary text-white rounded-lg p-4">
```

**After (Shopify/CSS):**
```liquid
<div class="btn btn--primary">
```

**CSS Variables:**
```css
:root {
  --color-primary: #8B7355;
  --color-accent: #d4a574;
  --spacing-md: 1.5rem;
  --radius-lg: 0.75rem;
}
```

## Data Flow Changes

### Product Data

**React (API/Props):**
```typescript
interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    images: { edges: Array<...> };
  }
}
```

**Shopify (Liquid Objects):**
```liquid
{{ product.id }}
{{ product.title }}
{{ product.featured_image | image_url }}
```

## Deployment Steps

### Option 1: Shopify CLI (Recommended)

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Navigate to theme directory
cd shopify-theme

# Login to Shopify
shopify auth login

# Push to your store
shopify theme push

# Or develop locally
shopify theme dev
```

### Option 2: Manual Upload

1. **Create ZIP file** of the `shopify-theme` folder
2. Go to **Shopify Admin → Online Store → Themes**
3. Click **Add theme → Upload ZIP file**
4. Upload and publish

## Post-Conversion Setup

### 1. Configure Theme Settings

Go to **Online Store → Themes → Customize**:

- **Colors**: Set primary (#8B7355) and accent (#d4a574) colors
- **Typography**: Choose Playfair Display for headings, DM Sans for body
- **Logo**: Upload your logo
- **Social Media**: Add your social links

### 2. Create Navigation Menus

**Online Store → Navigation**:

Create "main-menu":
- Home → `/`
- Shop → `/collections/all`
- About → `/pages/about`
- Contact → `/pages/contact`

### 3. Set Up Collections

**Products → Collections**:

1. Create collections (e.g., "Perfumes", "Essential Oils", "Candles")
2. Add products to collections
3. Upload collection images
4. Add descriptions

### 4. Configure Homepage

**Customize → Homepage**:

1. **Hero Section**: Add heading, subheading, and CTA
2. **Features Bar**: Add 3 features (e.g., "Natural Ingredients", "Free Shipping", "Handcrafted")
3. **Product Categories**: Link to your collections
4. **Featured Products**: Select a collection to display
5. **Rituals Section**: Add lifestyle content

### 5. Add Products

**Products → Add Product**:

- Upload product images
- Set prices and compare-at prices (for discounts)
- Add variants (size, scent, etc.)
- Write descriptions
- Assign to collections

## Feature Comparison

| Feature | React App | Shopify Theme | Status |
|---------|-----------|---------------|--------|
| Homepage | ✅ | ✅ | Converted |
| Product Listing | ✅ | ✅ | Converted |
| Product Detail | ✅ | ✅ | Converted |
| Add to Cart | ✅ | ✅ | Converted (Ajax) |
| Cart Management | ✅ | ✅ | Converted (Ajax) |
| Responsive Design | ✅ | ✅ | Converted |
| Product Variants | ✅ | ✅ | Converted |
| Discount Badges | ✅ | ✅ | Converted |
| Collections | ✅ | ✅ | Converted |
| Search | ❌ | ✅ | Enhanced |
| Checkout | External | ✅ | Native Shopify |
| Customer Accounts | External | ✅ | Native Shopify |
| Order Management | External | ✅ | Native Shopify |

## What You Gain with Shopify

### 1. **E-commerce Features**
- Secure checkout
- Payment processing (100+ gateways)
- Inventory management
- Order tracking
- Customer accounts
- Email notifications

### 2. **Admin Dashboard**
- Product management
- Order processing
- Customer management
- Analytics and reports
- Marketing tools
- Discount codes

### 3. **Infrastructure**
- Global CDN
- SSL certificate
- 99.99% uptime
- Automatic backups
- DDoS protection
- PCI compliance

### 4. **Marketing Tools**
- SEO optimization
- Email marketing
- Social media integration
- Gift cards
- Abandoned cart recovery
- Product reviews

## Customization Guide

### Adding New Sections

1. Create file in `sections/` folder:
```liquid
<!-- sections/my-custom-section.liquid -->
<section class="my-section">
  <h2>{{ section.settings.heading }}</h2>
</section>

{% schema %}
{
  "name": "My Custom Section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading"
    }
  ]
}
{% endschema %}
```

2. Add to template JSON:
```json
{
  "sections": {
    "my-custom": {
      "type": "my-custom-section"
    }
  }
}
```

### Modifying Styles

Edit `assets/theme.css`:
```css
/* Add your custom styles */
.my-custom-class {
  color: var(--color-primary);
  padding: var(--spacing-lg);
}
```

### Adding JavaScript

Edit `assets/global.js` or create new JS file:
```javascript
// Custom functionality
document.addEventListener('DOMContentLoaded', function() {
  // Your code here
});
```

## Maintenance

### Theme Updates

```bash
# Pull latest from Shopify
shopify theme pull

# Make changes locally
# Test changes
shopify theme dev

# Push updates
shopify theme push
```

### Version Control

```bash
# Initialize git (if not already)
cd shopify-theme
git init
git add .
git commit -m "Initial Shopify theme"

# Create repository and push
git remote add origin <your-repo-url>
git push -u origin main
```

## Troubleshooting

### Common Issues

**Issue**: Products not showing  
**Solution**: Ensure products are published and assigned to collections

**Issue**: Images not loading  
**Solution**: Check image URLs and ensure images are uploaded to Shopify

**Issue**: Cart not updating  
**Solution**: Check browser console for JavaScript errors, verify Ajax API calls

**Issue**: Styles not applying  
**Solution**: Clear browser cache, check CSS file paths in theme.liquid

**Issue**: Sections not appearing  
**Solution**: Verify section files exist and JSON syntax is correct

## Performance Optimization

### Image Optimization

Shopify automatically optimizes images, but you can control sizes:

```liquid
{{ product.featured_image | image_url: width: 800 }}
```

### Lazy Loading

Images use `loading="lazy"` by default for better performance.

### CSS/JS Minification

Use Shopify CLI to minify assets:
```bash
shopify theme check
```

## Next Steps

1. ✅ **Upload theme to Shopify**
2. ✅ **Configure theme settings**
3. ✅ **Create navigation menus**
4. ✅ **Add products and collections**
5. ✅ **Customize homepage sections**
6. ✅ **Test on multiple devices**
7. ✅ **Set up payment gateway**
8. ✅ **Configure shipping**
9. ✅ **Launch store**

## Resources

- **Shopify Theme Documentation**: https://shopify.dev/themes
- **Liquid Documentation**: https://shopify.dev/api/liquid
- **Shopify CLI**: https://shopify.dev/themes/tools/cli
- **Theme Check**: https://shopify.dev/themes/tools/theme-check
- **Shopify Community**: https://community.shopify.com

## Support

For questions about:
- **Theme functionality**: Review this guide and Shopify documentation
- **Shopify platform**: Contact Shopify Support
- **Custom development**: Consider hiring a Shopify Expert

---

**Conversion completed**: January 2026  
**Theme version**: 1.0.0  
**Compatible with**: Shopify Online Store 2.0
