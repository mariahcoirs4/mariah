import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

interface SitemapGroup {
  title: string;
  links: { label: string; href: string; isExternal?: boolean }[];
}

const SITEMAP_GROUPS: SitemapGroup[] = [
  {
    title: 'Core Pages',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Product Catalog', href: '/products' },
      { label: 'Coco Peat Blocks', href: '/products' },
      { label: 'Grow Bags', href: '/products' },
      { label: 'Briquettes & Discs', href: '/products' },
      { label: 'Husk Chips', href: '/products' },
      { label: 'Coir Fibre Bales', href: '/products' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'Industries We Serve', href: '/industries' },
      { label: 'Hydroponics Farming', href: '/industries' },
      { label: 'Floriculture', href: '/industries' },
      { label: 'Greenhouse Cultivation', href: '/industries' },
      { label: 'Horticulture & Agriculture', href: '/industries' },
      { label: 'Landscaping', href: '/industries' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Certifications & Standards', href: '/certifications' },
      { label: 'Export Process', href: '/export-process' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Blog & Knowledge Hub',
    links: [
      { label: 'All Articles', href: '/blogs' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'XML Sitemap', href: '/sitemap.xml', isExternal: true },
    ],
  },
];

export default function SitemapPage() {
  useSEO({
    title: 'Sitemap | Mariah Coirs',
    description: 'Browse the full site map of Mariah Coirs — all product pages, industry pages, company information, and blog articles.',
    canonical: `${SITE_URL}/sitemap`,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F5F1EB' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Hero */}
      <section style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#A0A0A0', marginBottom: '24px' }}>
            <Link to="/" style={{ color: '#A0A0A0', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C99B67')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}
            >Home</Link>
            <span>/</span>
            <span style={{ color: '#C99B67' }}>Sitemap</span>
          </nav>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Site Map
          </h1>
          <p style={{ fontSize: '16px', color: '#667085', marginTop: '12px' }}>All pages and content sections on the Mariah Coirs website.</p>
        </div>
      </section>

      {/* Sitemap Grid */}
      <main style={{ padding: '60px 24px 80px' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '32px',
          }}
        >
          {SITEMAP_GROUPS.map((group) => (
            <div key={group.title}>
              <h2
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  color: '#C99B67',
                  marginBottom: '16px',
                  borderBottom: '1px solid rgba(201,155,103,0.2)',
                  paddingBottom: '10px',
                }}
              >
                {group.title}
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#374151', textDecoration: 'none', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C99B67')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                      >
                        {link.label}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        style={{ color: '#374151', textDecoration: 'none', fontSize: '15px' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C99B67')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
