import { Link } from 'react-router-dom';
import GallerySection from '../components/GallerySection';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

export default function GalleryPage() {
  useSEO({
    title: 'Gallery | Mariah Coirs — Factory, Production & Export Photos',
    description:
      'Explore the Mariah Coirs photo and video gallery — see our manufacturing facility, coir processing machinery, natural drying beds, export packaging, and production videos.',
    canonical: `${SITE_URL}/gallery`,
    keywords:
      'Mariah Coirs gallery, coir factory photos, coco peat production, coir manufacturing facility, coir processing videos, export packaging images',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Gallery', url: `${SITE_URL}/gallery` },
      ]),
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Page Hero */}
      <section
        style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}
        aria-label="Gallery page header"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#A0A0A0', marginBottom: '24px' }}
          >
            <Link
              to="/"
              style={{ color: '#A0A0A0', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C99B67')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >
              Home
            </Link>
            <span>/</span>
            <span style={{ color: '#C99B67' }}>Gallery</span>
          </nav>

          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#C99B67',
              marginBottom: '16px',
            }}
          >
            Inside Mariah Coirs
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}
          >
            Factory & Production Gallery
          </h1>
          <p style={{ fontSize: '18px', color: '#667085', maxWidth: '600px', lineHeight: 1.7 }}>
            A visual tour of our manufacturing facility — from raw coconut husks to export-ready
            coir products. Photos and production videos from our Nilakottai plant.
          </p>
        </div>
      </section>

      {/* Gallery Section reused */}
      <GallerySection />
    </div>
  );
}
