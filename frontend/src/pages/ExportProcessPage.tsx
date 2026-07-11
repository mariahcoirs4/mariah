import { Link } from 'react-router-dom';
import ProcessSection from '../components/ProcessSection';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

export default function ExportProcessPage() {
  useSEO({
    title: 'Export Process | How We Manufacture & Ship Coir Products — Mariah Coirs',
    description:
      'Discover Mariah Coirs\' 6-step manufacturing and export process: from raw coconut husk sourcing and fibre extraction to washing, compression, QC lab testing, and container loading for international shipment.',
    canonical: `${SITE_URL}/export-process`,
    keywords: 'coir manufacturing process, coco peat production, coir export packaging, coir quality control, cocopeat manufacturing India, coir export process',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Export Process', url: `${SITE_URL}/export-process` },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How Mariah Coirs Manufactures and Exports Coir Products',
        description:
          'A step-by-step overview of Mariah Coirs\' coir manufacturing pipeline — from husk to export container.',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Raw Coconut Husk', text: 'Sourced from certified coconut farms across Tamil Nadu and Kerala.' },
          { '@type': 'HowToStep', position: 2, name: 'Fibre Extraction', text: 'Industrial decorticators separate long coir fibre from the pith.' },
          { '@type': 'HowToStep', position: 3, name: 'Washing & Buffering', text: 'Multi-cycle washing reduces EC levels; buffering is performed based on customer requirements.' },
          { '@type': 'HowToStep', position: 4, name: 'Compression', text: 'Hydraulic compression converts processed material into blocks, briquettes and bales.' },
          { '@type': 'HowToStep', position: 5, name: 'QC & Lab Testing', text: 'EC, pH, moisture and compression ratio are verified according to export standards.' },
          { '@type': 'HowToStep', position: 6, name: 'Export Packaging', text: 'Products are packed, labelled and container-loaded for international shipment.' },
        ],
      },
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Page Hero */}
      <section
        style={{ background: '#050505', padding: '48px 24px 40px', borderBottom: '1px solid rgba(229,169,60,0.12)' }}
        aria-label="Export process page header"
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
            <span style={{ color: '#C99B67' }}>Export Process</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '16px' }}>
            Our Process
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '16px' }}>
            From Husk to Export Container
          </h1>
          <p style={{ fontSize: '18px', color: '#667085', maxWidth: '600px', lineHeight: 1.7 }}>
            Our 6-step manufacturing pipeline — raw husk sourcing, fibre extraction, washing, compression, QC lab testing, and container-ready export packaging.
          </p>
        </div>
      </section>

      <ProcessSection />
    </div>
  );
}
