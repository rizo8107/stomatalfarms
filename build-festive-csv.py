# -*- coding: utf-8 -*-
"""Builds the 12 festive-pack products as a Shopify product-import CSV.

Matches the EXACT 99-column schema of the store's Shopify product export CSV,
populating all custom metafield definitions (custom.box_metric, combo_includes,
how_to_use, key_highlights, panel_title, panel_subtitle, panel_tagline,
pill_tags, pricing_heading, pricing_note, pricing_rows, product_details,
product_layout).

Source of truth: Aurora-Festive-Pack-of-6-and-12-Listings (1).pdf.
Every string below is transcribed from that PDF; nothing here is invented.
Run:  python build-festive-csv.py
"""
import csv
import io
import os
import sys

# Ensure UTF-8 output
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

R = u'₹'  # rupee sign

# Shopify's importer fetches Image Src over HTTP and keeps its own copy on the
# Shopify CDN, so this only has to resolve while the import runs.
IMAGE_BASE = ('https://raw.githubusercontent.com/rizo8107/stomatalfarms/'
              'new/product-images/festive-packs/')
IMAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                         'product-images', 'festive-packs')

# ---------------------------------------------------------------- shared copy
# Keyed by product form. Cups and sticks differ in the charcoal pill, the
# lighting-guide line and the whole HOW TO USE sequence.
FORM = {
    'cups': {
        'unit': u'cups',
        'noun': u'Incense Cups',
        'incense_type': u'Cups',
        'no_charcoal_pill': u'Charcoal-free',
        'included_extra': (u'Lighting guide: A simple three-step guide inside every box '
                           u'for a clean, even burn.'),
        'how_to_use': [
            u'Hold the cup by its base and light the top rim on all sides for about 20 seconds.',
            u'Keep the flame on for another 20 seconds so the cup catches evenly.',
            u'Gently blow out the flame and look for a steady amber glow, then set the cup on a '
            u'heat-resistant holder or stand.',
            u'Always burn on a flat, heat-resistant surface, away from drafts, curtains, children '
            u'and pets. Never leave a burning cup unattended.',
        ],
        'discount_pct': 20,
    },
    'sticks': {
        'unit': u'sticks',
        'noun': u'Incense Sticks',
        'incense_type': u'Sticks',
        'no_charcoal_pill': u'No charcoal',
        'included_extra': None,
        'how_to_use': [
            u'Light the tip of the stick and let the flame catch for a few seconds.',
            u'Gently blow out the flame so the tip glows and the smoke begins to rise.',
            u'Place the stick upright in an incense holder on a flat, heat-resistant surface.',
            u'Keep away from drafts, curtains, children and pets. Never leave a burning stick '
            u'unattended.',
        ],
        'discount_pct': 25,
    },
}

# ------------------------------------------------------------ per-page copy
COPY = {
    ('Dasangam', 'cups'): dict(
        mrp=285,
        intro=(u"Bring the temple home this festive season. Dasangam is one of South India's "
               u"oldest ritual blends, and every Aurora Dasangam cup is handcrafted from cow dung "
               u"and infused with natural extracts and aromatic herbs. Light one at dawn or during "
               u"the evening aarti and let its rich, grounding aroma settle over your pooja room."),
        included=(u"15 handcrafted cups in every box, {total} cups in all. A traditional blend of "
                  u"ten botanicals with a rich, balsamic, temple-like aroma that boosts positivity "
                  u"and evokes divine harmony."),
        base_feature=(u"Handcrafted with natural extracts and aromatic herbs. No charcoal and no "
                      u"synthetic aroma."),
        second_label=u"Enough for the whole season",
        second_body=u"{total} cups means a cup every morning and evening through the festive weeks.",
        closing=u"{Word} boxes of Dasangam for a season of prayer, light and togetherness.",
    ),
    ('Floral', 'cups'): dict(
        mrp=270,
        intro=(u"Welcome every guest with the aroma of fresh temple flowers. Aurora Floral Incense "
               u"Cups are handcrafted from cow dung and infused with natural floral extracts and "
               u"aromatic herbs, releasing a soft, sweet aroma that calms the mind and fills the "
               u"home with devotion. Light one as the lamps come on for Golu evenings, or before "
               u"your evening prayers."),
        included=(u"15 handcrafted cups in every box, {total} cups in all. A gentle, sweet floral "
                  u"aroma that evokes love, compassion and devotion."),
        base_feature=(u"Handcrafted with natural floral extracts and aromatic herbs. No charcoal "
                      u"and no synthetic aroma."),
        second_label=u"Made for evenings and guests",
        second_body=(u"A soft, welcoming aroma that suits Golu evenings, festive gatherings and "
                     u"quiet evening prayers."),
        closing=u"{Word} boxes of Floral for evenings that feel like a temple garden.",
    ),
    ('Lemongrass', 'cups'): dict(
        mrp=270,
        intro=(u"Start every festive morning fresh. Aurora Lemongrass Incense Cups are handcrafted "
               u"from cow dung and infused with natural lemongrass extracts and aromatic herbs, "
               u"releasing a crisp, refreshing and earthy aroma that brightens the whole home. "
               u"Light one with your morning prayers, or before guests arrive to leave every room "
               u"feeling clean and inviting."),
        included=(u"15 handcrafted cups in every box, {total} cups in all. A crisp, refreshing and "
                  u"earthy aroma with bright, clean notes."),
        base_feature=(u"Handcrafted with natural lemongrass extracts and aromatic herbs. No "
                      u"charcoal and no synthetic aroma."),
        second_label=u"A fresh start to every day",
        second_body=(u"A bright, uplifting aroma for morning prayers and for freshening rooms "
                     u"before guests arrive."),
        closing=u"{Word} boxes of Lemongrass for bright, fresh festive mornings.",
    ),
    ('Dasangam', 'sticks'): dict(
        mrp=195,
        intro=(u"The traditional aroma of the temple, ready for every day of the festive season. "
               u"Aurora Dasangam Incense Sticks are handcrafted from cow dung and crafted with "
               u"natural botanical extracts and aromatic herbs, releasing a rich, grounding aroma "
               u"that fills the pooja room with calm. Light one for your daily prayers through "
               u"Navaratri and Deepavali."),
        included=(u"15 premium handcrafted cow dung sticks in every box, {total} sticks in all. A "
                  u"traditional blend of ten botanicals with a rich, balsamic aroma that boosts "
                  u"positivity and relaxes body and soul."),
        base_feature=(u"Crafted with natural botanical extracts and aromatic herbs. No charcoal "
                      u"and no synthetic aroma."),
        second_label=u"Stocked for the season",
        second_body=(u"{total} sticks means you won't run out on Saraswati Pooja, Vijayadashami "
                     u"or Deepavali."),
        closing=u"{Word} boxes of Dasangam for every prayer of the festive season.",
    ),
    ('Floral', 'sticks'): dict(
        mrp=180,
        intro=(u"Fill your home with the soft sweetness of fresh blossoms this festive season. "
               u"Aurora Floral Incense Sticks are handcrafted from cow dung and crafted with "
               u"natural botanical extracts and aromatic herbs, releasing a gentle floral aroma "
               u"that calms the mind and welcomes every guest. Light one as the lamps come on for "
               u"Golu, or during your evening prayers."),
        included=(u"15 premium handcrafted cow dung sticks in every box, {total} sticks in all. A "
                  u"gentle, sweet floral aroma that evokes love, compassion and devotion."),
        base_feature=(u"Crafted with natural botanical extracts and aromatic herbs. No charcoal "
                      u"and no synthetic aroma."),
        second_label=u"Made for evenings and guests",
        second_body=(u"A soft, welcoming aroma for Golu evenings, festive gatherings and evening "
                     u"prayers."),
        closing=u"{Word} boxes of Floral for festive evenings filled with warmth.",
    ),
    ('Lemongrass', 'sticks'): dict(
        mrp=180,
        intro=(u"A crisp, clean start to every festive day. Aurora Lemongrass Incense Sticks are "
               u"handcrafted from cow dung and crafted with natural botanical extracts and aromatic "
               u"herbs, releasing a refreshing, earthy aroma that brightens the whole home. Light "
               u"one with your morning prayers or before guests arrive."),
        included=(u"15 premium handcrafted cow dung sticks in every box, {total} sticks in all. A "
                  u"crisp, refreshing and earthy aroma with bright, clean notes."),
        base_feature=(u"Crafted with natural botanical extracts and aromatic herbs. No charcoal "
                      u"and no synthetic aroma."),
        second_label=u"A fresh start to every day",
        second_body=(u"A bright, uplifting aroma for morning prayers and for freshening rooms "
                     u"before guests arrive."),
        closing=u"{Word} boxes of Lemongrass for bright, fresh festive days.",
    ),
}

PACK = {
    6: dict(Word=u'Six',
            tail=(u"Six boxes and {total} {unit} carry you through Navaratri, Golu evenings and "
                  u"Deepavali, with boxes to spare for the homes you visit.")),
    12: dict(Word=u'Twelve',
             tail=(u"Twelve boxes and {total} {unit} keep your pooja room stocked for the whole "
                   u"festive season, with plenty left to gift. Keep a few for yourself and add one "
                   u"to every thamboolam.")),
}


def money(n):
    """1710 -> '1,710'; 877.5 -> '877.50'. Indian grouping, matching PDF."""
    whole = int(abs(n))
    frac = int(round((abs(n) - whole) * 100))
    s = str(whole)
    if len(s) > 3:
        head, tail = s[:-3], s[-3:]
        parts = []
        while len(head) > 2:
            parts.insert(0, head[-2:])
            head = head[:-2]
        if head:
            parts.insert(0, head)
        s = u','.join(parts + [tail])
    if frac:
        s = u'%s.%02d' % (s, frac)
    return (u'-' if n < 0 else u'') + s


# The exact 99-column schema from Shopify product export
COLUMNS = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Product Category',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Option1 Linked To',
    'Option2 Name',
    'Option2 Value',
    'Option2 Linked To',
    'Option3 Name',
    'Option3 Value',
    'Option3 Linked To',
    'Variant SKU',
    'Variant Grams',
    'Variant Inventory Tracker',
    'Variant Inventory Qty',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Unit Price Total Measure',
    'Unit Price Total Measure Unit',
    'Unit Price Base Measure',
    'Unit Price Base Measure Unit',
    'Variant Barcodes',
    'Image Src',
    'Image Position',
    'Image Alt Text',
    'Gift Card',
    'SEO Title',
    'SEO Description',
    'Google Shopping / Google Product Category',
    'Google Shopping / Gender',
    'Google Shopping / Age Group',
    'Google Shopping / MPN',
    'Google Shopping / Condition',
    'Google Shopping / Custom Product',
    'Google Shopping / Custom Label 0',
    'Google Shopping / Custom Label 1',
    'Google Shopping / Custom Label 2',
    'Google Shopping / Custom Label 3',
    'Google Shopping / Custom Label 4',
    'Ash Usage (product.metafields.custom.ash_usage)',
    'box_metrics (product.metafields.custom.box_metric)',
    'Burning Time (product.metafields.custom.burning_time)',
    'Combo Includes (product.metafields.custom.combo_includes)',
    'custom.panel_subtitle (product.metafields.custom.custom_panel_subtitle)',
    'custom.pricing_note (product.metafields.custom.custom_pricing_note)',
    'custom.pricing_rows (product.metafields.custom.custom_pricing_rows)',
    'Custom SH (product.metafields.custom.custom_sh)',
    'Custom shipping label (product.metafields.custom.custom_shipping_label)',
    'Delivery Region (product.metafields.custom.delivery_region)',
    'FSSAI License (product.metafields.custom.fssai_license)',
    'Harvest Window (product.metafields.custom.harvest_window)',
    'How to Use (product.metafields.custom.how_to_use)',
    'Ingredients (product.metafields.custom.ingredients)',
    'KEY HIGHLIGHTS (product.metafields.custom.key_highlights)',
    'Net Quantity (product.metafields.custom.net_quantity)',
    'Nutritional Focus (product.metafields.custom.nutritional_focus)',
    'panel_subtitle (product.metafields.custom.panel_subtitle)',
    'panel_tagline (product.metafields.custom.panel_tagline)',
    'panel_title (product.metafields.custom.panel_title)',
    'pill_tags (product.metafields.custom.pill_tags)',
    'Premium Quality (product.metafields.custom.premium_quality)',
    'pricing_heading (product.metafields.custom.pricing_heading)',
    'pricing_note (product.metafields.custom.pricing_note)',
    'pricing_rows (product.metafields.custom.pricing_rows)',
    'Product Details (product.metafields.custom.product_details)',
    'Product layout (product.metafields.custom.product_layout)',
    'Safety Info (product.metafields.custom.safety_info)',
    'Shelf Life (product.metafields.custom.shelf_life)',
    'Storage (product.metafields.custom.storage)',
    'EComposer product countdown end at (product.metafields.ecomposer.countdown)',
    'EComposer product countdown start at (product.metafields.ecomposer.countdown_from)',
    'Google: Custom Product (product.metafields.mm-google-shopping.custom_product)',
    'Product rating count (product.metafields.reviews.rating_count)',
    'Color (product.metafields.shopify.color-pattern)',
    'Cooking method (product.metafields.shopify.cooking-method)',
    'Dietary preferences (product.metafields.shopify.dietary-preferences)',
    'Food product form (product.metafields.shopify.food-product-form)',
    'Incense type (product.metafields.shopify.incense-type)',
    'Material (product.metafields.shopify.material)',
    'Usage type (product.metafields.shopify.usage-type)',
    'Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)',
    'Related products (product.metafields.shopify--discovery--product_recommendation.related_products)',
    'Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)',
    'Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)',
    'Variant Image',
    'Variant Weight Unit',
    'Variant Tax Code',
    'Cost per item',
    'Status',
]


def build(scent, form, qty):
    f = FORM[form]
    c = COPY[(scent, form)]
    p = PACK[qty]

    total = 15 * qty
    mrp_total = c['mrp'] * qty
    pct = f['discount_pct']
    save = mrp_total * pct / 100.0
    price = mrp_total - save
    per_box = c['mrp'] * (100 - pct) / 100.0

    title = u'Aurora %s %s — Pack of %d' % (scent, f['noun'], qty)
    handle = u'aurora-%s-incense-%s-pack-of-%d' % (scent.lower(), form, qty)
    sku = u'AUR-%s-%s-P%d' % (scent[:3].upper(), form[:2].upper(), qty)

    image_name = handle + u'.jpg'
    image_src = (IMAGE_BASE + image_name
                 if os.path.exists(os.path.join(IMAGE_DIR, image_name)) else u'')

    subtitle = u'Festive Pack • %d boxes • 15 %s per box' % (qty, f['unit'])
    intro = c['intro'] + u' ' + p['tail'].format(total=total, unit=f['unit'])
    closing = c['closing'].format(Word=p['Word'])

    # Four cards, matching the PDF's WHAT'S IN THE BOX panel.
    metrics = u'\n'.join([
        u'%d|handcrafted %s (%d boxes)' % (total, f['unit'], qty),
        u'%s%s|total value' % (R, money(mrp_total)),
        u'%s%s|you save · %d%% off' % (R, money(save), pct),
        u'%s%s|festive price' % (R, money(price)),
    ])

    pills = u'Cow dung based, %s, Nothing synthetic, Gift-ready' % f['no_charcoal_pill']

    includes = [u'%s %s × %d boxes: %s'
                % (scent, f['noun'], qty, c['included'].format(total=total))]
    if f['included_extra']:
        includes.append(f['included_extra'])

    highlights = [
        u'Cow dung base, nothing synthetic: %s' % c['base_feature'],
        u'%s: %s' % (c['second_label'], c['second_body'].format(total=total)),
        u'%s gifts in one order: Each kraft and gold-foil box is a complete gift on its own, '
        u'perfect for thamboolam and festive visits.' % p['Word'],
        u'Better value per box: At the festive price, each box works out to just %s%s.'
        % (R, money(per_box)),
    ]

    pricing_heading = (u'Festive Offer — Navaratri & Deepavali · Special Selling Price: '
                       u'%d%% OFF the total MRP' % pct)
    pricing_note = u'MRP inclusive of all taxes'

    pricing_rows = u'\n'.join([
        u'%s %s (15 %s) × %d @ %s%d|%s%s'
        % (scent, f['noun'], f['unit'], qty, R, c['mrp'], R, money(mrp_total)),
        u'Total MRP|%s%s|total' % (R, money(mrp_total)),
        u'Festive Discount (%d%% OFF)|− %s%s' % (pct, R, money(save)),
        u'Festive Selling Price (effective %s%s per box)|%s%s|offer'
        % (R, money(per_box), R, money(price)),
    ])

    body = (
        u'<p>%s</p>\n'
        u'<h3>What’s included</h3>\n<ul>%s</ul>\n'
        u'<h3>Key features &amp; benefits</h3>\n<ul>%s</ul>\n'
        u'<h3>How to use</h3>\n<ol>%s</ol>\n'
        u'<p><em>%s</em></p>'
    ) % (
        intro,
        u''.join(u'<li>%s</li>' % x for x in includes),
        u''.join(u'<li>%s</li>' % x for x in highlights),
        u''.join(u'<li>%s</li>' % x for x in f['how_to_use']),
        closing,
    )

    tags = (u'Aurora, Festive Pack, Navaratri, Deepavali, %s, %s, Pack of %d, Gift, '
            u'Cow Dung, Charcoal Free' % (scent, f['noun'], qty))

    # Initialize all columns with empty string
    row = {col: u'' for col in COLUMNS}

    # Core Shopify Product fields
    row['Handle'] = handle
    row['Title'] = title
    row['Body (HTML)'] = body
    row['Vendor'] = u'Stomatal Farms'
    row['Product Category'] = u'Uncategorized'
    row['Type'] = f['noun']
    row['Tags'] = tags
    row['Published'] = u'true'

    # Variant / Options
    row['Option1 Name'] = u'Title'
    row['Option1 Value'] = u'Default Title'
    row['Variant SKU'] = sku
    row['Variant Grams'] = u'0.0'
    row['Variant Inventory Tracker'] = u''
    row['Variant Inventory Qty'] = u'-1'
    row['Variant Inventory Policy'] = u'continue'
    row['Variant Fulfillment Service'] = u'manual'
    row['Variant Price'] = u'%.2f' % price
    row['Variant Compare At Price'] = u'%.2f' % mrp_total
    row['Variant Requires Shipping'] = u'true'
    row['Variant Taxable'] = u'true'
    row['Variant Weight Unit'] = u'kg'
    row['Gift Card'] = u'false'
    row['Status'] = u'active'

    # Images
    if image_src:
        row['Image Src'] = image_src
        row['Image Position'] = u'1'
        row['Image Alt Text'] = title

    # SEO
    row['SEO Title'] = u'%s | Festive Pack of %d' % (title, qty)
    row['SEO Description'] = (u'%d handcrafted %s across %d boxes. Cow dung based, charcoal-free, '
                              u'nothing synthetic. Festive price %s%s (%d%% off %s%s).'
                              % (total, f['unit'], qty, R, money(price), pct, R, money(mrp_total)))

    # Custom Metafields matching store's exact export definition
    row['box_metrics (product.metafields.custom.box_metric)'] = metrics
    row['Combo Includes (product.metafields.custom.combo_includes)'] = u'\n'.join(includes)
    row['How to Use (product.metafields.custom.how_to_use)'] = u'\n'.join(f['how_to_use'])
    row['KEY HIGHLIGHTS (product.metafields.custom.key_highlights)'] = u'\n'.join(highlights)
    row['Product Details (product.metafields.custom.product_details)'] = intro
    row['Product layout (product.metafields.custom.product_layout)'] = u'arka'
    row['panel_title (product.metafields.custom.panel_title)'] = title
    row['panel_subtitle (product.metafields.custom.panel_subtitle)'] = subtitle
    row['custom.panel_subtitle (product.metafields.custom.custom_panel_subtitle)'] = subtitle
    row['panel_tagline (product.metafields.custom.panel_tagline)'] = closing
    row['pill_tags (product.metafields.custom.pill_tags)'] = pills
    row['pricing_heading (product.metafields.custom.pricing_heading)'] = pricing_heading
    row['pricing_note (product.metafields.custom.pricing_note)'] = pricing_note
    row['custom.pricing_note (product.metafields.custom.custom_pricing_note)'] = pricing_note
    row['pricing_rows (product.metafields.custom.pricing_rows)'] = pricing_rows
    row['custom.pricing_rows (product.metafields.custom.custom_pricing_rows)'] = pricing_rows
    row['Custom shipping label (product.metafields.custom.custom_shipping_label)'] = u'Free shipping'
    row['Incense type (product.metafields.shopify.incense-type)'] = f['incense_type']

    return row


def main():
    rows = []
    # 6 cups products, then 6 sticks products (matching PDF pages 1-12)
    for form in ('cups', 'sticks'):
        for scent in ('Dasangam', 'Floral', 'Lemongrass'):
            for qty in (6, 12):
                rows.append(build(scent, form, qty))

    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shopify-festive-packs-import.csv')
    with io.open(out, 'w', encoding='utf-8-sig', newline='') as fh:
        writer = csv.DictWriter(fh, fieldnames=COLUMNS)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)

    print(u'Wrote %s' % out)
    print(u'Total products: %d  Columns: %d' % (len(rows), len(COLUMNS)))
    for r in rows:
        print(u'  %-46s Price: %8s  Compare: %8s  SKU: %-15s  Image: %s'
              % (r['Handle'], r['Variant Price'], r['Variant Compare At Price'],
                 r['Variant SKU'], u'YES' if r['Image Src'] else u'NO'))


if __name__ == '__main__':
    main()
