import { Link } from 'react-router-dom';
import ProductsSection from '../components/ProductsSection';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

export default function ProductsPage() {
  useSEO({
    title: 'Coir Products | Coco Peat Blocks, Grow Bags, Coir Fiber — Mariah Coirs',
    description:
      'Browse Mariah Coirs\' premium export product catalog: coco peat blocks, grow bags, briquettes, husk chips, coir fiber bales, and custom packaging. Factory-direct pricing for FCL and LCL shipments worldwide.',
    canonical: `${SITE_URL}/products`,
    keywords: 'coco peat blocks, grow bags, coir fiber bales, husk chips, coir briquettes, coir products export, cocopeat supplier, coir exporter catalog',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Products', url: `${SITE_URL}/products` },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Mariah Coirs Export Product Catalog',
        description: 'Premium coir products manufactured and exported from Pollachi, Tamil Nadu, India.',
        url: `${SITE_URL}/products`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Coco Peat Blocks', url: `${SITE_URL}/products` },
          { '@type': 'ListItem', position: 2, name: 'Grow Bags', url: `${SITE_URL}/products` },
          { '@type': 'ListItem', position: 3, name: 'Briquettes & Discs', url: `${SITE_URL}/products` },
          { '@type': 'ListItem', position: 4, name: 'Husk Chips', url: `${SITE_URL}/products` },
          { '@type': 'ListItem', position: 5, name: 'Coir Fibre Bales', url: `${SITE_URL}/products` },
          { '@type': 'ListItem', position: 6, name: 'Custom Packaging', url: `${SITE_URL}/products` },
        ],
      },
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Page Hero */}
      <section
        style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}
        aria-label="Products page header"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#A0A0A0', marginBottom: '24px' }}
          >
            <Link to="/" style={{ color: '#A0A0A0', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C99B67')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >Home</Link>
            <span>/</span>
            <span style={{ color: '#C99B67' }}>Products</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '16px' }}>
            Product Catalog
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '16px' }}>
            Premium Coir Export Products
          </h1>
          <p style={{ fontSize: '18px', color: '#667085', maxWidth: '600px', lineHeight: 1.7 }}>
            Factory-direct coco peat blocks, grow bags, coir fiber bales, husk chips, and custom OEM packaging — engineered to international export standards.
          </p>
        </div>
      </section>

      <ProductsSection />
    </div>
  );
}
