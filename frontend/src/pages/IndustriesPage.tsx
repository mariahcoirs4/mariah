import { Link } from 'react-router-dom';
import IndustriesSection from '../components/IndustriesSection';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

export default function IndustriesPage() {
  useSEO({
    title: 'Industries We Serve | Hydroponics, Horticulture & More — Mariah Coirs',
    description:
      'Mariah Coirs supplies premium coir products to hydroponics, floriculture, greenhouse cultivation, horticulture, landscaping, animal bedding, soil conditioning, and environmental restoration industries worldwide.',
    canonical: `${SITE_URL}/industries`,
    keywords: 'coir for hydroponics, coco peat for floriculture, coir grow bags greenhouse, coir horticulture, coir landscaping, coir animal bedding, cocopeat soil conditioning',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Industries', url: `${SITE_URL}/industries` },
      ]),
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F5F1EB' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Page Hero */}
      <section
        style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}
        aria-label="Industries page header"
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
            <span style={{ color: '#C99B67' }}>Industries</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '16px' }}>
            Markets We Serve
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '16px' }}>
            Industries We Serve
          </h1>
          <p style={{ fontSize: '18px', color: '#667085', maxWidth: '600px', lineHeight: 1.7 }}>
            From hydroponics and floriculture to landscaping and animal bedding — Mariah Coirs supplies custom-grade coir products to 8 major industries globally.
          </p>
        </div>
      </section>

      <IndustriesSection />
    </div>
  );
}
