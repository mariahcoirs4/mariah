import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { productApi, blogApi } from '../lib/api';

const SITE_URL = 'https://www.mariahcoirsexport.com';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

interface SitemapLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface SitemapGroup {
  title: string;
  links: SitemapLink[];
}

export default function SitemapPage() {
  const [productLinks, setProductLinks] = useState<SitemapLink[]>([
    { label: 'Product Catalog', href: '/products' },
  ]);
  const [blogLinks, setBlogLinks] = useState<SitemapLink[]>([
    { label: 'All Articles', href: '/blogs' },
  ]);

  useSEO({
    title: 'Sitemap | Mariah Coirs',
    description: 'Browse the full site map of Mariah Coirs — all product pages, industry pages, company information, and blog articles.',
    canonical: `${SITE_URL}/sitemap`,
  });

  useEffect(() => {
    // Fetch products
    productApi.getAll()
      .then((res) => {
        const dynamicProds = res.data.map((p) => ({
          label: p.name,
          href: `/product/${slugify(p.name)}`,
        }));
        setProductLinks([
          { label: 'Product Catalog', href: '/products' },
          ...dynamicProds,
        ]);
      })
      .catch((err) => console.error('Sitemap failed to fetch products', err));

    // Fetch blogs
    blogApi.getAll(true)
      .then((res) => {
        const dynamicBlogs = res.data.map((b) => ({
          label: b.title,
          href: `/blog/${b.slug}`,
        }));
        setBlogLinks([
          { label: 'All Articles', href: '/blogs' },
          ...dynamicBlogs,
        ]);
      })
      .catch((err) => console.error('Sitemap failed to fetch blogs', err));
  }, []);

  const sitemapGroups: SitemapGroup[] = [
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
      links: productLinks,
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
        { label: 'Gallery', href: '/gallery' },
        { label: 'Certifications & Standards', href: '/certifications' },
        { label: 'Export Process', href: '/export-process' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'Blog & Knowledge Hub',
      links: blogLinks,
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
          {sitemapGroups.map((group) => (
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
