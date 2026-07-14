import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogApi, getUploadUrl } from '../lib/api';
import type { Blog } from '../lib/api';
import { useSEO, articleSchema, breadcrumbSchema } from '../hooks/useSEO';
import {
  authorInitials,
  estimateReadingTime,
  extractTableOfContents,
  formatBlogDate,
  renderBlogContent,
  splitList,
} from '../lib/blogContent';

const SITE_URL = 'https://www.mariahcoirsexport.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/mariahcoirs/og-image.jpg`;
const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Palette ─────────────────────────────────────────────────────── */
const P = {
  bg: '#F4F1EA',
  card: '#FDFAF5',
  green: '#0F291E',
  greenMid: '#1C4A32',
  gold: '#C99B4E',
  goldLight: '#F5EAD8',
  text: '#1A1A1A',
  muted: '#5B6472',
  border: 'rgba(119,84,42,0.13)',
};

function Avatar({ blog }: { blog: Blog }) {
  if (blog.authorAvatar) {
    return <img src={blog.authorAvatar} alt={blog.authorName ?? blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  }
  return <span style={{ fontWeight: 800, letterSpacing: '-0.03em', color: P.green }}>{authorInitials(blog.authorName)}</span>;
}

function RelatedCard({ blog }: { blog: Blog }) {
  const imageAlt = blog.featuredImageAlt || blog.title;
  const readingTime = estimateReadingTime(blog.content);

  return (
    <Link
      to={`/blog/${blog.slug}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        background: P.card,
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1px solid ${P.border}`,
        boxShadow: '0 10px 28px rgba(16,24,40,0.07)',
        display: 'grid',
        gridTemplateRows: '180px 1fr',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 22px 44px rgba(16,24,40,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 28px rgba(16,24,40,0.07)';
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${P.green} 0%, #7A4E14 100%)` }}>
        {blog.featuredImage ? (
          <img src={getUploadUrl(blog.featuredImage)} alt={imageAlt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#F3E8D6', fontSize: '40px' }}>✦</div>
        )}
      </div>
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          {blog.category && <span style={{ fontSize: '11px', fontWeight: 800, color: '#8F5D22', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{blog.category}</span>}
          <span style={{ fontSize: '12px', color: P.muted }}>{readingTime} min read</span>
        </div>
        <h3 style={{ margin: 0, fontSize: '1rem', lineHeight: 1.35, letterSpacing: '-0.025em', color: P.green, fontWeight: 800 }}>{blog.title}</h3>
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.7, color: P.muted }}>{blog.shortDescription}</p>
      </div>
    </Link>
  );
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    setBlog(null);
    setAllBlogs([]);

    blogApi
      .getBySlug(slug)
      .then((res) => setBlog(res.data))
      .catch(() => setError('Article not found or has been removed.'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!blog) return;
    blogApi
      .getAll(true)
      .then((res) => setAllBlogs(res.data))
      .catch(() => setAllBlogs([]));
  }, [blog]);

  const contentHtml = useMemo(() => (blog ? renderBlogContent(blog.content) : ''), [blog]);
  const tocEntries = useMemo(() => (blog ? extractTableOfContents(blog.content) : []), [blog]);
  const relatedPosts = useMemo(() => {
    if (!blog) return [] as Blog[];
    const currentTags = splitList(blog.tags);
    return allBlogs
      .filter((c) => c.id !== blog.id)
      .map((c) => {
        const candidateTags = splitList(c.tags);
        const score =
          Number(c.category && blog.category && c.category === blog.category) * 3 +
          candidateTags.filter((t) => currentTags.includes(t)).length * 2 +
          (c.authorName === blog.authorName ? 1 : 0);
        return { candidate: c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ candidate }) => candidate);
  }, [allBlogs, blog]);

  const seoKeywords = [blog?.focusKeywords, blog?.category, blog?.tags].filter(Boolean).join(', ');

  useSEO({
    title: blog ? blog.metaTitle || blog.title : 'Blog | Mariah Coirs',
    description: blog ? blog.metaDescription || blog.shortDescription : 'Insights on coir, cocopeat, and sustainable agriculture from Mariah Coirs.',
    canonical: blog ? blog.canonicalUrl || `${SITE_URL}/blog/${blog.slug}` : `${SITE_URL}/blogs`,
    ogImage: blog?.featuredImage ? getUploadUrl(blog.featuredImage) : DEFAULT_OG_IMAGE,
    ogType: 'article',
    keywords: seoKeywords || 'coir blog, coco peat insights, sustainable agriculture',
    jsonLd: blog
      ? [
          articleSchema({
            title: blog.title,
            description: blog.metaDescription || blog.shortDescription,
            image: blog.featuredImage ? getUploadUrl(blog.featuredImage) : DEFAULT_OG_IMAGE,
            datePublished: blog.publishedAt,
            dateModified: blog.updatedAt,
            url: blog.canonicalUrl || `${SITE_URL}/blog/${blog.slug}`,
            author: blog.authorName ? { name: blog.authorName } : undefined,
          }),
          breadcrumbSchema([
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Blog', url: `${SITE_URL}/blogs` },
            { name: blog.title, url: blog.canonicalUrl || `${SITE_URL}/blog/${blog.slug}` },
          ]),
        ]
      : breadcrumbSchema([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: 'Blog', url: `${SITE_URL}/blogs` },
        ]),
  });

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: P.bg, display: 'grid', placeItems: 'center' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '3px solid rgba(143,93,34,0.16)', borderTopColor: '#8F5D22', animation: 'spin 0.85s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !blog) {
    return (
      <div style={{ minHeight: '100vh', background: P.bg, display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center', padding: '40px 28px', borderRadius: '28px', border: `1px solid ${P.border}`, background: P.card, boxShadow: '0 28px 60px rgba(16,24,40,0.08)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '22px', margin: '0 auto 18px', display: 'grid', placeItems: 'center', background: P.green, color: P.gold, fontSize: '28px' }}>✦</div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', letterSpacing: '-0.04em', color: P.green, lineHeight: 1.2 }}>Article Not Found</h1>
          <p style={{ margin: '12px 0 0', color: P.muted, lineHeight: 1.7 }}>{error || 'The article is unavailable right now.'}</p>
          <Link to="/blogs" style={{ display: 'inline-flex', marginTop: '22px', padding: '12px 22px', borderRadius: '999px', background: P.green, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = estimateReadingTime(blog.content);
  const tags = splitList(blog.tags);
  const toc = tocEntries.length > 0 ? tocEntries : [];

  return (
    <div style={{ minHeight: '100vh', background: P.bg }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* ══════════════════════════════════════════════
          HERO — crisp image + gradient text overlay
      ══════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '420px' }}>
        {/* Background image — natural, no green tint */}
        {blog.featuredImage && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <img
              src={getUploadUrl(blog.featuredImage)}
              alt={blog.featuredImageAlt || blog.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Text readability overlay — smooth gradient only, NO solid color fill */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: blog.featuredImage
              ? 'linear-gradient(to right, rgba(10,22,16,0.88) 40%, rgba(10,22,16,0.30) 100%)'
              : `linear-gradient(135deg, ${P.green} 0%, #1C4A32 100%)`,
          }}
        />

        {/* Hero content */}
        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: 'clamp(36px,5vw,56px) clamp(16px,4vw,32px) clamp(40px,6vw,64px)' }}>
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_CUBIC }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.72)', fontSize: '13px', flexWrap: 'wrap', marginBottom: '24px' }}
            aria-label="Breadcrumb"
          >
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/blogs" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'rgba(255,255,255,0.9)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '40ch' }}>{blog.title}</span>
          </motion.nav>

          {/* Meta pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_CUBIC }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px' }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {blog.category && (
                <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.18)', color: '#FDEBD2', fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', backdropFilter: 'blur(6px)' }}>
                  {blog.category}
                </span>
              )}
              <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', backdropFilter: 'blur(6px)' }}>
                {formatBlogDate(blog.publishedAt)}
              </span>
              <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', backdropFilter: 'blur(6px)' }}>
                {readingTime} min read
              </span>
            </div>

            {/* Title — crisp white, proper line-height */}
            <h1 style={{ margin: 0, fontSize: 'clamp(1.85rem, 4.5vw, 3.8rem)', lineHeight: 1.18, letterSpacing: '-0.04em', color: '#FFFFFF', fontWeight: 900 }}>
              {blog.title}
            </h1>

            <p style={{ margin: 0, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', lineHeight: 1.8, color: 'rgba(255,255,255,0.82)' }}>
              {blog.shortDescription}
            </p>

            {/* Author row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', paddingTop: '8px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: `linear-gradient(135deg, #EBD8B7 0%, ${P.gold} 100%)`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Avatar blog={blog} />
              </div>
              <div>
                <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '15px' }}>{blog.authorName ?? 'Mariah Coirs Editorial Team'}</p>
                <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}>{blog.authorRole ?? 'Sustainable supply chain editorial'}</p>
              </div>
              {tags.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MOBILE: ToC accordion (visible < lg)
      ══════════════════════════════════════════════ */}
      {toc.length > 0 && (
        <div
          className="mobile-toc"
          style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px clamp(16px,4vw,32px) 0' }}
        >
          <div
            style={{
              borderRadius: '18px',
              border: `1px solid ${P.border}`,
              background: P.card,
              overflow: 'hidden',
              boxShadow: '0 4px 18px rgba(16,24,40,0.06)',
            }}
          >
            <button
              type="button"
              onClick={() => setTocOpen((o) => !o)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                color: P.green,
                fontWeight: 800,
                fontSize: '14px',
              }}
              aria-expanded={tocOpen}
            >
              <span>📑 Table of Contents</span>
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: tocOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s ease', flexShrink: 0 }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {tocOpen && (
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px 16px 16px' }} aria-label="Table of contents">
                {toc.map((entry) => (
                  <a
                    key={entry.id}
                    href={`#${entry.id}`}
                    onClick={() => setTocOpen(false)}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: entry.level === 2 ? P.green : '#3F4A55',
                      background: entry.level === 2 ? `rgba(143,93,34,0.07)` : 'transparent',
                      marginLeft: `${Math.max(0, entry.level - 2) * 12}px`,
                      fontWeight: entry.level === 2 ? 700 : 500,
                      fontSize: '14px',
                      lineHeight: 1.5,
                      display: 'block',
                    }}
                  >
                    • {entry.text}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          MAIN: 70/30 desktop grid | stacked mobile
      ══════════════════════════════════════════════ */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(16px,4vw,32px) 100px' }}>
        <div className="blog-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '32px', alignItems: 'start' }}>

          {/* ── Left: Article ── */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '28px', minWidth: 0 }}>
            {/* Featured image (full width in main column) */}
            {blog.featuredImage && (
              <div style={{ borderRadius: '22px', overflow: 'hidden', boxShadow: '0 18px 44px rgba(16,24,40,0.10)', background: P.green }}>
                <img
                  src={getUploadUrl(blog.featuredImage)}
                  alt={blog.featuredImageAlt || blog.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            {/* Summary pull-quote */}
            <div style={{ padding: '22px 24px', borderRadius: '18px', background: P.card, border: `1px solid ${P.border}`, boxShadow: '0 8px 24px rgba(16,24,40,0.05)' }}>
              <p style={{ margin: 0, color: P.muted, fontSize: '1.05rem', lineHeight: 1.8, borderLeft: `4px solid #8F5D22`, paddingLeft: '18px' }}>
                {blog.metaDescription || blog.shortDescription}
              </p>
            </div>

            {/* Article body */}
            <div
              className="blog-rich-text"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              style={{ fontSize: '17px', lineHeight: 1.8, color: '#2A2A2A' }}
            />

            {/* Author bio */}
            <section style={{ padding: '24px', borderRadius: '22px', background: P.green, color: '#F7F1E7', boxShadow: '0 16px 38px rgba(15,41,30,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ width: '68px', height: '68px', borderRadius: '20px', overflow: 'hidden', background: `linear-gradient(135deg, #EBD8B7 0%, ${P.gold} 100%)`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Avatar blog={blog} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: P.gold }}>Author</div>
                  <h2 style={{ margin: '8px 0 0', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', letterSpacing: '-0.03em', color: '#F7F1E7', lineHeight: 1.25 }}>
                    {blog.authorName ?? 'Mariah Coirs Editorial Team'}
                  </h2>
                  <p style={{ margin: '6px 0 0', color: 'rgba(247,241,231,0.78)', fontSize: '14px', lineHeight: 1.6 }}>
                    {blog.authorRole ?? 'Operations and agronomy specialists sharing sourcing insights.'}
                  </p>
                </div>
              </div>
              {blog.authorBio && (
                <p style={{ margin: '18px 0 0', lineHeight: 1.8, color: 'rgba(247,241,231,0.84)', fontSize: '15px' }}>
                  {blog.authorBio}
                </p>
              )}
            </section>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8F5D22' }}>
                    Related Posts
                  </span>
                  <h2 style={{ margin: '8px 0 0', fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', letterSpacing: '-0.04em', color: P.green, fontWeight: 800, lineHeight: 1.2 }}>
                    More from the archive
                  </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,240px), 1fr))', gap: '18px' }}>
                  {relatedPosts.map((related) => (
                    <RelatedCard key={related.id} blog={related} />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* ── Right: Sticky Sidebar (desktop only via CSS) ── */}
          <aside
            className="blog-sidebar"
            style={{ position: 'sticky', top: '108px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Table of Contents */}
            <div style={{ padding: '20px', borderRadius: '22px', border: `1px solid ${P.border}`, background: P.card, boxShadow: '0 10px 28px rgba(16,24,40,0.05)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8F5D22' }}>On This Page</div>
              <h3 style={{ margin: '10px 0 0', fontSize: '1rem', color: P.green, fontWeight: 800 }}>Table of Contents</h3>
              {toc.length > 0 ? (
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '14px' }} aria-label="Table of contents">
                  {toc.map((entry) => (
                    <a
                      key={entry.id}
                      href={`#${entry.id}`}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: entry.level === 2 ? P.green : '#3F4A55',
                        background: entry.level === 2 ? 'rgba(143,93,34,0.07)' : 'transparent',
                        marginLeft: `${Math.max(0, entry.level - 2) * 10}px`,
                        fontWeight: entry.level === 2 ? 700 : 500,
                        fontSize: '13.5px',
                        lineHeight: 1.5,
                        display: 'block',
                        transition: 'background 0.18s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(143,93,34,0.12)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = entry.level === 2 ? 'rgba(143,93,34,0.07)' : 'transparent')}
                    >
                      • {entry.text}
                    </a>
                  ))}
                </nav>
              ) : (
                <p style={{ margin: '12px 0 0', color: P.muted, lineHeight: 1.7, fontSize: '14px' }}>
                  This article does not include section headings.
                </p>
              )}
            </div>

            {/* Quick Facts */}
            <div style={{ padding: '20px', borderRadius: '22px', background: P.green, color: '#F7F1E7', boxShadow: '0 14px 32px rgba(15,41,30,0.13)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: P.gold }}>Quick Facts</div>
              <ul style={{ margin: '14px 0 0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: 1.65, color: 'rgba(247,241,231,0.9)', fontSize: '14px' }}>
                <li>{formatBlogDate(blog.publishedAt)}</li>
                <li>{readingTime} minute read</li>
                <li>{blog.category || 'Coir & cocopeat editorial'}</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Responsive styles ── */}
      <style>{`
        /* Mobile: hide desktop sidebar, show mobile ToC accordion */
        @media (max-width: 900px) {
          .blog-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .blog-sidebar {
            display: none !important;
          }
          .mobile-toc {
            display: block;
          }
        }

        /* Desktop: hide mobile ToC */
        @media (min-width: 901px) {
          .mobile-toc {
            display: none !important;
          }
        }

        /* Blog rich text typography */
        .blog-rich-text h1,
        .blog-rich-text h2,
        .blog-rich-text h3,
        .blog-rich-text h4 {
          color: #0F291E;
          letter-spacing: -0.03em;
          line-height: 1.25;
          font-weight: 800;
          margin: 2rem 0 1rem;
        }
        .blog-rich-text h2 { font-size: clamp(1.4rem, 2.5vw, 1.85rem); }
        .blog-rich-text h3 { font-size: clamp(1.15rem, 2vw, 1.45rem); }
        .blog-rich-text p {
          font-size: 17px;
          line-height: 1.8;
          color: #2A2A2A;
          margin: 0 0 1.4rem;
        }
        .blog-rich-text a { color: #8F5D22; text-underline-offset: 3px; }
        .blog-rich-text a:hover { color: #0F291E; }
        .blog-rich-text ul,
        .blog-rich-text ol { padding-left: 1.5rem; margin: 0 0 1.4rem; }
        .blog-rich-text li { margin-bottom: 0.6rem; line-height: 1.75; color: #2A2A2A; font-size: 16px; }
        .blog-rich-text img {
          max-width: 100%;
          height: auto;
          border-radius: 16px;
          margin: 1.5rem 0;
          box-shadow: 0 12px 32px rgba(16,24,40,0.10);
        }
        .blog-rich-text blockquote {
          border-left: 4px solid #8F5D22;
          padding: 12px 20px;
          margin: 1.5rem 0;
          background: rgba(143,93,34,0.06);
          border-radius: 0 12px 12px 0;
          color: #5B6472;
          font-style: italic;
          font-size: 1.05rem;
          line-height: 1.8;
        }
        .blog-rich-text code {
          background: rgba(15,41,30,0.08);
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 0.9em;
          color: #0F291E;
        }
        .blog-rich-text pre {
          background: #0F291E;
          color: #F4F1EA;
          padding: 20px;
          border-radius: 16px;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-size: 14px;
          line-height: 1.7;
        }
        .blog-rich-text pre code { background: none; color: inherit; padding: 0; }
        .blog-rich-text hr {
          border: none;
          border-top: 1px solid rgba(119,84,42,0.15);
          margin: 2.5rem 0;
        }
        .blog-rich-text table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          border-radius: 12px;
          overflow: hidden;
          font-size: 15px;
        }
        .blog-rich-text th {
          background: #0F291E;
          color: #F4F1EA;
          padding: 12px 16px;
          text-align: left;
          font-weight: 700;
        }
        .blog-rich-text td {
          padding: 10px 16px;
          border-bottom: 1px solid rgba(119,84,42,0.10);
          color: #2A2A2A;
        }
        .blog-rich-text tr:last-child td { border-bottom: none; }
        .blog-rich-text tr:nth-child(even) td { background: rgba(143,93,34,0.04); }
      `}</style>
    </div>
  );
}