import { Link } from 'react-router-dom';
import ContactSection from '../components/ContactSection';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

export default function ContactPage() {
  useSEO({
    title: 'Contact Mariah Coirs | Export Enquiries & Bulk Orders',
    description:
      'Contact Mariah Coirs export team for coir product enquiries, bulk pricing, and shipping quotes. Based in Pollachi, Tamil Nadu. Responds within 24 hours. FOB, CIF, CNF shipping to 50+ countries.',
    canonical: `${SITE_URL}/contact`,
    keywords: 'contact Mariah Coirs, coir export enquiry, cocopeat bulk order, coir supplier contact, export quote India',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Contact', url: `${SITE_URL}/contact` },
      ]),
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F5F1EB' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Page Hero */}
      <section
        style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}
        aria-label="Contact page header"
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
            <span style={{ color: '#C99B67' }}>Contact</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '16px' }}>
            Get in Touch
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '16px' }}>
            Contact Our Export Team
          </h1>
          <p style={{ fontSize: '18px', color: '#667085', maxWidth: '600px', lineHeight: 1.7 }}>
            Whether you're importing from overseas or sourcing in bulk across India — our team responds within 24 hours with pricing, specs, and logistics support.
          </p>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
