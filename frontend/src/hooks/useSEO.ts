import { useEffect } from 'react';

const SITE_NAME = 'Mariah Coirs';
const SITE_URL = 'https://www.mariahcoirsexport.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/mariahcoirs/og-image.jpg`;

export interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: object | object[];
  noIndex?: boolean;
  keywords?: string;
}

function setMeta(nameOrProp: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${nameOrProp}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, nameOrProp);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function injectJsonLd(schemas: object[]) {
  document.querySelectorAll('script[type="application/ld+json"][data-seo]').forEach((s) => s.remove());
  schemas.forEach((schema) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'true');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

export function useSEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  jsonLd,
  noIndex = false,
  keywords,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const desc =
      description ??
      'Mariah Coirs — India\'s premier manufacturer and exporter of premium coco peat blocks, coir fiber, grow bags, and coir products. Supplying 50+ countries since 2009.';

    setMeta('description', desc);
    if (keywords) setMeta('keywords', keywords);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Canonical
    const canonicalHref = canonical ?? `${SITE_URL}${window.location.pathname}`;
    setLink('canonical', canonicalHref);

    // Open Graph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', desc, true);
    setMeta('og:type', ogType, true);
    setMeta('og:url', canonicalHref, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:site_name', SITE_NAME, true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', ogImage);

    // JSON-LD
    if (jsonLd) {
      injectJsonLd(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);
    }

    return () => {
      document.querySelectorAll('script[type="application/ld+json"][data-seo]').forEach((s) => s.remove());
    };
  }, [title, description, canonical, ogImage, ogType, noIndex, keywords, jsonLd]);
}

// ─── Shared JSON-LD Schemas ───────────────────────────────────────

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Mariah Coirs',
  url: SITE_URL,
  logo: `${SITE_URL}/mariahcoirs/logo.png`,
  description:
    'India\'s premier manufacturer and exporter of premium coconut coir products. ISO 9001:2015 certified. Supplying 50+ countries since 2009.',
  foundingDate: '2009',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '206-13B Krishnapuram Road, Kalladipatti',
    addressLocality: 'Nilakottai',
    addressRegion: 'Tamil Nadu',
    postalCode: '624201',
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-96776-41979',
      contactType: 'customer service',
      areaServed: 'Worldwide',
      availableLanguage: 'English',
    },
  ],
  sameAs: [
    'https://www.facebook.com/MariahCoirsExport',
    'https://www.instagram.com/mariahcoirsexport/',
    'https://www.youtube.com/@MariahCoirsExport',
  ],
};

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Mariah Coirs',
  url: SITE_URL,
  description:
    'Premium coco peat blocks, coir fiber, grow bags, and coir products manufactured and exported from Nilakottai, Dindigul District, Tamil Nadu, India.',
};

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function articleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  url,
  author,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  author?: { name: string; url?: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image ?? DEFAULT_OG_IMAGE,
    datePublished,
    dateModified: dateModified ?? datePublished,
    url,
    author: author
      ? { '@type': 'Person', name: author.name, url: author.url ?? SITE_URL }
      : { '@type': 'Organization', name: 'Mariah Coirs', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Mariah Coirs',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/mariahcoirs/logo.png`,
      },
    },
  };
}
