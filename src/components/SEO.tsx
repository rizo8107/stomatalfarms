import { useEffect } from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  canonical?: string;
  // Product specific e-commerce & Schema.org data
  product?: {
    name: string;
    description?: string;
    image?: string;
    price: number | string;
    currency?: string;
    sku?: string;
    inStock?: boolean;
    brand?: string;
    ratingValue?: number;
    reviewCount?: number;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const DEFAULT_TITLE = "Stomatal Farms | Aurora Aromatic Wellness Products";
const DEFAULT_DESCRIPTION =
  "Authentic aromatic wellness products crafted from traditional Indian herbs, cow dung, and essential oils. Natural incense sticks, cups, ghee lamps & more from Stomatal Farms.";
const DEFAULT_IMAGE = "https://stomatalfarms.com/og-image.png";
const SITE_NAME = "Stomatal Farms";
const BASE_URL = "https://stomatalfarms.com";

export const SEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  canonical,
  product,
  breadcrumbs,
}: SEOProps) => {
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const metaImage = image
    ? image.startsWith("http")
      ? image
      : `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`
    : DEFAULT_IMAGE;
  const currentUrl = url
    ? url.startsWith("http")
      ? url
      : `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`
    : typeof window !== "undefined"
    ? window.location.href
    : BASE_URL;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 2. Standard Meta
    setMetaTag("name", "description", metaDescription);
    setMetaTag("name", "author", SITE_NAME);

    // 3. OpenGraph Tags (Facebook, WhatsApp, LinkedIn)
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", metaDescription);
    setMetaTag("property", "og:image", metaImage);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:locale", "en_IN");

    // Product OpenGraph Extension (Meta Catalog & Ads)
    if (product) {
      const priceNum = String(product.price).replace(/[^0-9.]/g, "");
      setMetaTag("property", "product:price:amount", priceNum);
      setMetaTag("property", "product:price:currency", product.currency || "INR");
      setMetaTag("property", "og:price:amount", priceNum);
      setMetaTag("property", "og:price:currency", product.currency || "INR");
      setMetaTag(
        "property",
        "product:availability",
        product.inStock !== false ? "in stock" : "out of stock"
      );
    }

    // 4. Twitter Cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", metaDescription);
    setMetaTag("name", "twitter:image", metaImage);

    // 5. Canonical Link Tag
    let canonicalTag = document.querySelector("link[rel='canonical']");
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonicalUrl);

    // 6. JSON-LD Structured Data for Search Crawlers (Google Rich Results)
    const jsonLdScripts: Element[] = [];

    // Base Organization & WebSite Schema
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Stomatal Farms",
      url: BASE_URL,
      logo: `${BASE_URL}/aurora-logo.png`,
      sameAs: [
        "https://www.instagram.com/aurora_wellness_official",
        "https://www.facebook.com/stomatalfarms",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-9940822606",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "ta", "hi"],
      },
    };

    const siteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Stomatal Farms",
      url: BASE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${BASE_URL}/collections?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };

    // Product Schema (if on a product page)
    let productSchema = null;
    if (product) {
      const priceNum = String(product.price).replace(/[^0-9.]/g, "");
      productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: metaImage,
        description: product.description || metaDescription,
        sku: product.sku || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        brand: {
          "@type": "Brand",
          name: product.brand || "Aurora by Stomatal Farms",
        },
        offers: {
          "@type": "Offer",
          url: currentUrl,
          priceCurrency: product.currency || "INR",
          price: priceNum,
          priceValidUntil: "2027-12-31",
          availability:
            product.inStock !== false
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "Stomatal Farms",
          },
        },
        ...(product.ratingValue
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.ratingValue,
                reviewCount: product.reviewCount || 50,
                bestRating: "5",
                worstRating: "1",
              },
            }
          : {}),
      };
    }

    // Breadcrumbs Schema
    let breadcrumbsSchema = null;
    if (breadcrumbs && breadcrumbs.length > 0) {
      breadcrumbsSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((bc, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: bc.name,
          item: bc.url.startsWith("http") ? bc.url : `${BASE_URL}${bc.url}`,
        })),
      };
    }

    // Inject JSON-LD
    const schemasToInject = [
      orgSchema,
      siteSchema,
      productSchema,
      breadcrumbsSchema,
    ].filter(Boolean);

    // Remove previously injected dynamic json-ld
    document
      .querySelectorAll("script[data-dynamic-seo-jsonld='true']")
      .forEach((el) => el.remove());

    schemasToInject.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-dynamic-seo-jsonld", "true");
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      jsonLdScripts.push(script);
    });

    return () => {
      jsonLdScripts.forEach((script) => script.remove());
    };
  }, [
    fullTitle,
    metaDescription,
    metaImage,
    currentUrl,
    canonicalUrl,
    type,
    product,
    breadcrumbs,
  ]);

  return null;
};

export default SEO;
