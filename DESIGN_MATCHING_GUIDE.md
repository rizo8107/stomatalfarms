# Making Your Shopify Theme Match the Original React Design

## Current Situation

The Shopify theme I created has the **structure and functionality** but is missing the **visual design, images, and styling** from your original React application. This is because:

1. **Images are not included** - The React app uses specific product images and hero images
2. **Content is placeholder** - Sections need actual content from your store
3. **Styling needs customization** - Theme editor settings need to be configured

## What's Different

### Original React App Has:
- ✅ Beautiful hero images with overlay text
- ✅ Product category cards with actual product photos
- ✅ Illustrated "How We Craft Purity" section with custom graphics
- ✅ Product grid showing real products with images
- ✅ Rich color scheme (sage green, terracotta, cream)
- ✅ Custom fonts (Playfair Display, DM Sans)

### Current Shopify Theme Has:
- ⚠️ Basic placeholder content
- ⚠️ No images uploaded
- ⚠️ Default styling
- ⚠️ Empty sections waiting for content

## How to Match the Original Design

### Step 1: Upload the Theme

1. Use the ZIP file I created: `stomatal-farms-clean.zip`
2. Go to: https://nvhu9m-0r.myshopify.com/admin/themes
3. Click **Add theme → Upload ZIP file**
4. Upload and then click **Customize**

### Step 2: Configure Theme Settings

In the theme editor, go to **Theme Settings**:

#### **Colors**
- Primary color: `#6B8E4E` (sage green)
- Accent color: `#D4A574` (warm terracotta)
- Background: `#FFFFFF` (white)
- Text: `#302820` (dark earth)

#### **Typography**
- Heading font: **Playfair Display** (or similar serif)
- Body font: **DM Sans** (or similar sans-serif)

#### **Logo**
- Upload your "Stomatal Farms" logo
- Set width to 150-200px

### Step 3: Add Hero Images

The hero section needs **2 images**:

1. **Card 1 - Aromatic Wellness**
   - Upload an image of incense sticks burning with herbs
   - Similar to your React app's left hero card
   - Recommended size: 800x1000px

2. **Card 2 - Cow Dung & Herbs**
   - Upload an image of natural ingredients (lavender, sandalwood, etc.)
   - Similar to your React app's right hero card
   - Recommended size: 800x1000px

**How to add:**
- In theme editor, click on "Hero Section"
- You'll see 2 blocks (Hero Card 1 and Hero Card 2)
- Click each block and upload the images
- Add the text content:
  - Card 1: "Introducing Aurora" / "Aromatic Wellness"
  - Card 2: "Pure & Lab-Tested" / "Cow Dung & Herbs"

### Step 4: Set Up Product Categories

The "Product Categories" section needs **6 category images**:

1. **Incense Cups** - Image of dhoop cups
2. **Incense Sticks** - Image of incense sticks
3. **Combo Packs** - Image of product bundles
4. **Ghee Lamps** - Image of traditional lamps
5. **Bath Salts** - Image of bath products
6. **All Products** - General product image

**How to add:**
- In theme editor, click "Product Categories"
- For each block:
  - Upload the category image
  - Select the corresponding Shopify collection
  - The title and description will auto-populate from the collection

### Step 5: Add Products

Before the theme looks complete, you need to:

1. **Add products to Shopify**:
   - Go to Products → Add product
   - Upload product images (at least 1 per product)
   - Set prices and descriptions
   - Assign to collections

2. **Create collections**:
   - Go to Products → Collections
   - Create: "Incense Cups", "Incense Sticks", "Combo Packs", etc.
   - Add products to each collection
   - Upload collection featured images

3. **Link collections to homepage**:
   - In theme editor, go to "Featured Products" section
   - Select which collection to display
   - Products will automatically appear

### Step 6: Add the "How We Craft Purity" Section

This section shows the illustrated cards (meditation, cow, herbs, etc.). You have two options:

**Option A: Use Images**
- Create/upload the 5 illustrated images from your React app
- Add them as blocks in the "Rituals Section"

**Option B: Simplify**
- Use the "Craft & Purity" section instead
- Add a single image and descriptive text
- Focus on your brand story

### Step 7: Customize Navigation

1. **Create main menu**:
   - Go to Online Store → Navigation
   - Create menu called "main-menu"
   - Add links: Home, Shop, About, Contact

2. **Create footer menu**:
   - Create menu called "footer"
   - Add links: Privacy Policy, Shipping, Returns, etc.

## Quick Fixes for Common Issues

### "The colors don't match"
- Go to Theme Settings → Colors
- Update each color to match your brand
- Use the hex codes I provided above

### "No products are showing"
- You need to add products to your Shopify store first
- Then assign them to collections
- Then link collections to the homepage sections

### "Images are missing"
- Upload images in each section's settings
- For hero: 2 images (800x1000px each)
- For categories: 6 images (600x600px each)
- For products: Add via Products → Add product

### "Fonts look different"
- Go to Theme Settings → Typography
- Select fonts that match your original design
- Playfair Display for headings
- DM Sans or similar for body text

## Why This Approach?

Shopify themes work differently than React apps:

| React App | Shopify Theme |
|-----------|---------------|
| Images bundled in code | Images uploaded via admin |
| Content hardcoded | Content managed in theme editor |
| Styling in CSS/Tailwind | Styling in theme.css + editor settings |
| Data from API | Data from Shopify database |

The theme I created has all the **structure** - you just need to add the **content** (images, products, text) through the Shopify admin.

## Expected Timeline

- **Upload theme**: 2 minutes
- **Configure settings**: 10 minutes
- **Add hero images**: 5 minutes
- **Add products**: 30-60 minutes (depending on how many)
- **Set up collections**: 15 minutes
- **Add category images**: 10 minutes
- **Final tweaks**: 15 minutes

**Total**: About 1.5-2 hours to fully match your original design

## Need Help?

If you're stuck on any step:

1. **Check the theme editor** - Most settings are visual and easy to find
2. **Review Shopify docs** - https://help.shopify.com/en/manual/online-store/themes
3. **Test in preview mode** - Don't publish until you're happy with how it looks

## Next Steps

1. ✅ Upload the theme ZIP file
2. ✅ Open theme editor (Customize button)
3. ✅ Start with Theme Settings (colors, fonts, logo)
4. ✅ Add hero images
5. ✅ Add products to your store
6. ✅ Configure homepage sections
7. ✅ Preview and publish

The structure is ready - now it's time to add your beautiful content!
