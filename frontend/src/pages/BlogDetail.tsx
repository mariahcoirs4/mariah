import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogApi, getUploadUrl } from '../lib/api';
import type { Blog } from '../lib/api';
import { articleSchema, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/mariahcoirs/og-image.jpg`;

const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    blogApi
      .getBySlug(slug)
      .then((res) => {
        const b = res.data;
        setBlog(b);

        // ── Dynamic SEO ──────────────────────────────────────────
        const pageTitle = b.metaTitle ?? `${b.title} | Mariah Coirs`;
        const pageDesc = b.metaDescription ?? b.shortDescription;
        const pageUrl = b.canonicalUrl ?? `${SITE_URL}/blog/${b.slug}`;
        const pageImage = b.featuredImage ? getUploadUrl(b.featuredImage) : DEFAULT_OG_IMAGE;

        document.title = pageTitle;

        const setMeta = (nameOrProp: string, content: string, isProperty = false) => {
          const attr = isProperty ? 'property' : 'name';
          let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${nameOrProp}"]`);
          if (!el) { el = document.createElement('meta'); el.setAttribute(attr, nameOrProp); document.head.appendChild(el); }
          el.setAttribute('content', content);
        };
        const setLink = (rel: string, href: string) => {
          let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
          if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
          el.href = href;
        };

        setMeta('description', pageDesc);
        setMeta('robots', 'index, follow');
        setLink('canonical', pageUrl);

        // Open Graph
        setMeta('og:title', pageTitle, true);
        setMeta('og:description', pageDesc, true);
        setMeta('og:type', 'article', true);
        setMeta('og:url', pageUrl, true);
        setMeta('og:image', pageImage, true);
        setMeta('og:site_name', 'Mariah Coirs', true);

        // Twitter
        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', pageTitle);
        setMeta('twitter:description', pageDesc);
        setMeta('twitter:image', pageImage);

        // Article + Breadcrumb JSON-LD
        document.querySelectorAll('script[type="application/ld+json"][data-seo]').forEach(s => s.remove());
        [
          articleSchema({ title: b.title, description: pageDesc, image: pageImage, datePublished: b.createdAt, dateModified: b.updatedAt, url: pageUrl }),
          breadcrumbSchema([
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Blog', url: `${SITE_URL}/blogs` },
            { name: b.title, url: pageUrl },
          ]),
        ].forEach(schema => {
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.setAttribute('data-seo', 'true');
          script.textContent = JSON.stringify(schema);
          document.head.appendChild(script);
        });
      })
      .catch(() => setError('Article not found or has been removed.'))
      .finally(() => setLoading(false));

    return () => {
      document.title = 'Mariah Coirs | Premium Coir Products Exporter from India';
      document.querySelectorAll('script[type="application/ld+json"][data-seo]').forEach(s => s.remove());
    };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F1EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(201,155,103,0.2)',
            borderTopColor: '#C99B67',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F1EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <span style={{ fontSize: '48px' }}>🌿</span>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111111' }}>Article Not Found</h1>
        <p style={{ color: '#667085', fontSize: '16px' }}>{error}</p>
        <Link
          to="/blogs"
          style={{
            marginTop: '8px',
            padding: '12px 24px',
            background: '#C99B67',
            color: '#111111',
            fontWeight: 700,
            borderRadius: '12px',
            textDecoration: 'none',
          }}
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F1EB' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* ── Hero Image ── */}
      {blog.featuredImage && (
        <div
          className="h-[200px] sm:h-[420px]"
          style={{
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            background: '#0A0A0A',
          }}
        >
          <img
            src={getUploadUrl(blog.featuredImage)}
            alt={blog.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.8) 100%)',
            }}
          />
        </div>
      )}

      {/* ── Article Body ── */}
      <main
        className="py-8 px-4 sm:py-16 sm:px-6"
        style={{ maxWidth: '820px', margin: '0 auto' }}
      >
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_CUBIC }}
          style={{ marginBottom: '32px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#A0A0A0' }}
          aria-label="Breadcrumb"
        >
          <Link to="/" style={{ color: '#A0A0A0', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#C99B67')} onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}>
            Home
          </Link>
          <span>/</span>
          <Link to="/blogs" style={{ color: '#A0A0A0', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#C99B67')} onMouseLeave={e => (e.currentTarget.style.color = '#A0A0A0')}>
            Blog
          </Link>
          <span className="hidden sm:inline">/</span>
          <span className="hidden sm:inline" style={{ color: '#667085', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>
            {blog.title}
          </span>
        </motion.nav>

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_CUBIC }}
        >
          {/* Meta label */}
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#C99B67',
              marginBottom: '16px',
            }}
          >
            {formatDate(blog.createdAt)}
          </span>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#111111',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}
          >
            {blog.title}
          </h1>

          {/* Short description */}
          <p
            style={{
              fontSize: '18px',
              color: '#667085',
              lineHeight: 1.8,
              borderLeft: '3px solid #C99B67',
              paddingLeft: '20px',
              marginBottom: '40px',
            }}
          >
            {blog.shortDescription}
          </p>

          {/* Divider */}
          <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)', marginBottom: '40px' }} />

          {/* Rich Content */}
          <div
            className="prose-mariah"
            style={{
              fontSize: '17px',
              lineHeight: 1.85,
              color: '#374151',
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.article>

        {/* ── Back link ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          <Link
            to="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px',
              fontWeight: 700,
              color: '#111111',
              textDecoration: 'none',
              padding: '12px 24px',
              background: 'rgba(201,155,103,0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(201,155,103,0.2)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,155,103,0.2)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(201,155,103,0.1)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back to All Articles
          </Link>
        </motion.div>
      </main>

      {/* ── Prose styling ── */}
      <style>{`
        .prose-mariah h2 { font-size: 1.6rem; font-weight: 800; color: #111; margin: 2.5rem 0 1rem; letter-spacing: -0.02em; }
        .prose-mariah h3 { font-size: 1.2rem; font-weight: 700; color: #111; margin: 2rem 0 0.75rem; }
        .prose-mariah p  { margin-bottom: 1.25rem; }
        .prose-mariah ul, .prose-mariah ol { padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose-mariah li { margin-bottom: 0.6rem; }
        .prose-mariah strong { font-weight: 700; color: #111; }
        .prose-mariah a { color: #C99B67; text-decoration: underline; }
        .prose-mariah blockquote { border-left: 3px solid #C99B67; padding-left: 20px; color: #667085; font-style: italic; margin: 2rem 0; }
      `}</style>
    </div>
  );
}
