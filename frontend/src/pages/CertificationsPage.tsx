import { Link } from 'react-router-dom';
import CertificationsSection from '../components/CertificationsSection';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

export default function CertificationsPage() {
  useSEO({
    title: 'Certifications & Quality Standards | Mariah Coirs Coir Products',
    description:
      'Mariah Coirs is ISO 9001:2015 certified and Coir Board registered. We provide EC, pH, moisture and phytosanitary certificates for every export shipment. Quality-assured coir products from Nilakottai, Dindigul District, Tamil Nadu.',
    canonical: `${SITE_URL}/certifications`,
    keywords: 'ISO 9001 coir manufacturer, coir board registered, phytosanitary certificate coir, coco peat quality certificates, coir export compliance',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Certifications', url: `${SITE_URL}/certifications` },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'CredentialCategory',
        name: 'Quality Certifications',
        description: 'ISO 9001:2015 and Coir Board certifications held by Mariah Coirs for coir product manufacturing and export.',
      },
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: '#10100F' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Page Hero */}
      <section
        style={{ background: '#0A0A0A', padding: '48px 24px 40px', borderBottom: '1px solid rgba(229,169,60,0.15)' }}
        aria-label="Certifications page header"
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
            <span style={{ color: '#C99B67' }}>Certifications</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '16px' }}>
            Quality &amp; Compliance
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '16px' }}>
            Certifications &amp; Standards
          </h1>
          <p style={{ fontSize: '18px', color: '#667085', maxWidth: '600px', lineHeight: 1.7 }}>
            ISO 9001:2015 certified, Coir Board registered, with full phytosanitary and batch quality documentation for every international shipment.
          </p>
        </div>
      </section>

      <CertificationsSection />
    </div>
  );
}
