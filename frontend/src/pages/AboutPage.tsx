import { Link } from 'react-router-dom';
import AboutSection from '../components/AboutSection';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

export default function AboutPage() {
  useSEO({
    title: 'About Mariah Coirs | Coir Manufacturer in Nilakottai, Tamil Nadu',
    description:
      'Learn about Mariah Coirs — a world-class coir manufacturing facility in Nilakottai, Dindigul District, Tamil Nadu. Founded in 2009, ISO 9001:2015 certified, serving 490+ global clients with 1,000+ MT monthly capacity.',
    canonical: `${SITE_URL}/about`,
    keywords: 'Mariah Coirs about, coir manufacturer Nilakottai, coir factory Tamil Nadu, ISO certified coir manufacturer, coir exporter India',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'About', url: `${SITE_URL}/about` },
      ]),
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F5F1EB' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Page Hero */}
      <section
        style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}
        aria-label="About page header"
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
            <span style={{ color: '#C99B67' }}>About</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '16px' }}>
            Our Story
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '16px' }}>
            About Mariah Coirs
          </h1>
          <p style={{ fontSize: '18px', color: '#667085', maxWidth: '600px', lineHeight: 1.7 }}>
            A world-class coir manufacturing facility in Nilakottai, Dindigul District, Tamil Nadu — serving global importers, greenhouse operators, and agricultural businesses since 2009.
          </p>
        </div>
      </section>

      <AboutSection />
    </div>
  );
}
