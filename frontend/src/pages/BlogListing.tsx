import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogApi, getUploadUrl } from '../lib/api';
import type { Blog } from '../lib/api';
import { useSEO, breadcrumbSchema } from '../hooks/useSEO';
import { estimateReadingTime, formatBlogDate, splitList } from '../lib/blogContent';

const SITE_URL = 'https://www.mariahcoirsexport.com';
const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

function BlogCard({ blog, featured = false }: { blog: Blog; featured?: boolean }) {
  const tags = splitList(blog.tags).slice(0, 3);
  const readingTime = estimateReadingTime(blog.content);
  const imageAlt = blog.featuredImageAlt || blog.title;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: EASE_CUBIC }}
      whileHover={{ y: -6 }}
      style={{
        background: '#fffaf4',
        borderRadius: featured ? '28px' : '22px',
        overflow: 'hidden',
        border: '1px solid rgba(119, 84, 42, 0.12)',
        boxShadow: '0 20px 50px rgba(16, 24, 40, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
      }}
    >
      <Link to={`/blog/${blog.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: featured ? '16/10' : '16/9',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0D1B14 0%, #7A4E14 100%)',
          }}
        >
          {blog.featuredImage ? (
            <img
              src={getUploadUrl(blog.featuredImage)}
              alt={imageAlt}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.45s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#F3E8D6' }}>
              <span style={{ fontSize: featured ? '64px' : '42px' }}>✦</span>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: featured
                ? 'linear-gradient(180deg, rgba(7, 15, 10, 0.08) 0%, rgba(7, 15, 10, 0.72) 100%)'
                : 'linear-gradient(180deg, rgba(7, 15, 10, 0.02) 0%, rgba(7, 15, 10, 0.2) 100%)',
            }}
          />

          <div style={{ position: 'absolute', left: '18px', top: '18px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {blog.category && (
              <span style={{ background: 'rgba(255, 255, 255, 0.92)', color: '#1A3B2A', padding: '7px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {blog.category}
              </span>
            )}
            {featured && (
              <span style={{ background: '#D98C2B', color: '#fff', padding: '7px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Featured Post
              </span>
            )}
          </div>
        </div>
      </Link>

      <div style={{ padding: featured ? '28px' : '24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8F5D22' }}>
            {formatBlogDate(blog.publishedAt)}
          </span>
          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>
            {readingTime} min read
          </span>
        </div>

        <div>
          <Link to={`/blog/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2
              style={{
                fontSize: featured ? 'clamp(1.9rem, 4vw, 3rem)' : '1.3rem',
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
                color: '#101828',
                margin: 0,
              }}
            >
              {blog.title}
            </h2>
          </Link>
          <p style={{ marginTop: '12px', fontSize: featured ? '1.05rem' : '0.98rem', lineHeight: 1.75, color: '#5B6472' }}>
            {blog.shortDescription}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '18px', flexWrap: 'wrap', marginTop: 'auto' }}>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {tags.map((tag) => (
                <span key={tag} style={{ background: '#F5EAD8', color: '#7A4E14', padding: '7px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogListing() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO({
    title: 'Insights | Coir, Cocopeat & Sustainable Farming',
    description:
      'Editorial guides on coco peat, coir fiber, greenhouse substrates, export logistics, and sustainable agriculture from Mariah Coirs.',
    canonical: `${SITE_URL}/blogs`,
    keywords:
      'coir blog, coco peat insights, cocopeat exports, greenhouse growing, coir fiber, sustainable agriculture, coconut husk processing',
    jsonLd: breadcrumbSchema([
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Blog', url: `${SITE_URL}/blogs` },
    ]),
  });

  useEffect(() => {
    blogApi
      .getAll(true)
      .then((res) => setBlogs(res.data))
      .catch(() => setError('Failed to load articles. Please try again.'))
      .finally(() => setLoading(false));
  }, []);


  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F7F1E7 0%, #FFFDF9 100%)' }}>
      <style>{`
        .mc-hero-inner { padding: 56px 24px 48px; }
        .mc-main { padding: 36px 24px 84px; }
        .mc-archive-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1100px) {
          .mc-archive-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 860px) {
          .mc-archive-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .mc-hero-inner { padding: 36px 16px 28px; }
          .mc-main { padding: 24px 16px 56px; }
          .mc-archive-grid { grid-template-columns: 1fr; gap: 18px; }
        }
      `}</style>
      <div style={{ height: '72px' }} aria-hidden="true" />

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
          background:
            'radial-gradient(circle at top left, rgba(217, 140, 43, 0.16), transparent 36%), radial-gradient(circle at top right, rgba(28, 94, 65, 0.12), transparent 30%), linear-gradient(180deg, #FFF8EF 0%, #F5EEE1 100%)',
        }}
      >
        <div className="mc-hero-inner" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_CUBIC }}
            style={{ display: 'grid', gap: '20px' }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#8F5D22' }}>
              Knowledge Hub
            </span>
            <h1 style={{ margin: 0, maxWidth: '13ch', fontSize: 'clamp(2.6rem, 6vw, 5rem)', lineHeight: 0.96, letterSpacing: '-0.06em', color: '#102A1D' }}>
              Coir stories worth reading.
            </h1>
            <p style={{ margin: 0, maxWidth: '680px', fontSize: '1.05rem', lineHeight: 1.8, color: '#54606B' }}>
              Deep dives on coco peat, coir fiber, greenhouse substrates, export logistics, and the practical side of building a sustainable supply chain.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(16,24,40,0.08)' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#8F5D22', fontWeight: 800 }}>Published Guides</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#102A1D' }}>{blogs.length.toString().padStart(2, '0')}</div>
              </div>
              <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(16,24,40,0.08)' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#8F5D22', fontWeight: 800 }}>Focus</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#102A1D' }}>Sustainable farming</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="mc-main" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {loading && (
          <div style={{ display: 'grid', placeItems: 'center', padding: '100px 0' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '3px solid rgba(143,93,34,0.18)', borderTopColor: '#8F5D22', animation: 'spin 0.85s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#54606B' }}>
            {error}
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div style={{ padding: '80px 24px', textAlign: 'center', color: '#54606B' }}>
            No articles have been published yet.
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div style={{ display: 'grid', gap: '32px' }}>
            <section>
              <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8F5D22' }}>
                    All Articles
                  </span>
                  <h2 style={{ margin: '8px 0 0', fontSize: 'clamp(1.5rem, 3vw, 2.3rem)', letterSpacing: '-0.04em', color: '#102A1D' }}>
                    Explore the archive
                  </h2>
                </div>
                <span style={{ color: '#6B7280', fontSize: '14px' }}>
                  {blogs.length} post{blogs.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="mc-archive-grid">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}