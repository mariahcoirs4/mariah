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

function Avatar({ blog }: { blog: Blog }) {
  if (blog.authorAvatar) {
    return <img src={blog.authorAvatar} alt={blog.authorName ?? blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  }

  return <span style={{ fontWeight: 800, letterSpacing: '-0.03em', color: '#102A1D' }}>{authorInitials(blog.authorName)}</span>;
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
        background: '#fffaf4',
        borderRadius: '22px',
        overflow: 'hidden',
        border: '1px solid rgba(119,84,42,0.12)',
        boxShadow: '0 16px 34px rgba(16, 24, 40, 0.07)',
        display: 'grid',
        gridTemplateRows: '180px 1fr',
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0D1B14 0%, #7A4E14 100%)' }}>
        {blog.featuredImage ? (
          <img src={getUploadUrl(blog.featuredImage)} alt={imageAlt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#F3E8D6', fontSize: '42px' }}>✦</div>
        )}
      </div>
      <div style={{ padding: '20px', display: 'grid', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          {blog.category && <span style={{ fontSize: '11px', fontWeight: 800, color: '#8F5D22', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{blog.category}</span>}
          <span style={{ fontSize: '12px', color: '#6B7280' }}>{readingTime} min read</span>
        </div>
        <h3 style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.2, letterSpacing: '-0.03em', color: '#102A1D' }}>{blog.title}</h3>
        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.7, color: '#5B6472' }}>{blog.shortDescription}</p>
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
      .filter((candidate) => candidate.id !== blog.id)
      .map((candidate) => {
        const candidateTags = splitList(candidate.tags);
        const score =
          Number(candidate.category && blog.category && candidate.category === blog.category) * 3 +
          candidateTags.filter((tag) => currentTags.includes(tag)).length * 2 +
          (candidate.authorName === blog.authorName ? 1 : 0);
        return { candidate, score };
      })
      .sort((left, right) => right.score - left.score)
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
    keywords: seoKeywords || 'coir blog, coco peat insights, sustainable agriculture, greenhouse growing',
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F3EA', display: 'grid', placeItems: 'center' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '3px solid rgba(143,93,34,0.16)', borderTopColor: '#8F5D22', animation: 'spin 0.85s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F7F1E7 0%, #FFFDF9 100%)', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center', padding: '40px 28px', borderRadius: '28px', border: '1px solid rgba(16,24,40,0.08)', background: 'rgba(255,255,255,0.82)', boxShadow: '0 30px 70px rgba(16,24,40,0.08)' }}>
          <div style={{ width: '76px', height: '76px', borderRadius: '22px', margin: '0 auto 18px', display: 'grid', placeItems: 'center', background: '#102A1D', color: '#E6B46B', fontSize: '30px' }}>✦</div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', letterSpacing: '-0.05em', color: '#102A1D' }}>Article Not Found</h1>
          <p style={{ margin: '12px 0 0', color: '#5B6472', lineHeight: 1.7 }}>{error || 'The article is unavailable right now.'}</p>
          <Link to="/blogs" style={{ display: 'inline-flex', marginTop: '22px', padding: '12px 18px', borderRadius: '999px', background: '#8F5D22', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = estimateReadingTime(blog.content);
  const tags = splitList(blog.tags);
  const toc = tocEntries.length > 0 ? tocEntries : [];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F7F1E7 0%, #FFFDF9 100%)' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #102A1D 0%, #1F4A33 44%, #2A1A11 100%)' }}>
        {blog.featuredImage ? (
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src={getUploadUrl(blog.featuredImage)} alt={blog.featuredImageAlt || blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
          </div>
        ) : null}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(16,42,29,0.35) 0%, rgba(16,42,29,0.78) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 42px' }}>
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_CUBIC }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', flexWrap: 'wrap' }}
            aria-label="Breadcrumb"
          >
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to="/blogs" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
            <span>/</span>
            <span style={{ color: '#fff', maxWidth: '54ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</span>
          </motion.nav>

          <div style={{ marginTop: '22px', maxWidth: '980px' }}>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_CUBIC }} style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {blog.category && <span style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.16)', color: '#FDEBD2', fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{blog.category}</span>}
                <span style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {formatBlogDate(blog.publishedAt)}
                </span>
                <span style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {readingTime} min read
                </span>
              </div>
              <h1 style={{ margin: 0, maxWidth: '14ch', fontSize: 'clamp(2.8rem, 6vw, 5.1rem)', lineHeight: 0.96, letterSpacing: '-0.07em', color: '#fff' }}>
                {blog.title}
              </h1>
              <p style={{ margin: 0, maxWidth: '760px', fontSize: '1.06rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.84)' }}>
                {blog.shortDescription}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '8px' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #EBD8B7 0%, #D99C3C 100%)', display: 'grid', placeItems: 'center' }}>
                  <Avatar blog={blog} />
                </div>
                <div>
                  <p style={{ margin: 0, color: '#fff', fontWeight: 700 }}>{blog.authorName ?? 'Mariah Coirs Editorial Team'}</p>
                  <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.78)', fontSize: '14px' }}>{blog.authorRole ?? 'Sustainable supply chain editorial'}</p>
                </div>
                {tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
                    {tags.map((tag) => (
                      <span key={tag} style={{ padding: '8px 11px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 88px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '32px', alignItems: 'start' }}>
          <article>
            <div style={{ display: 'grid', gap: '26px' }}>
              {blog.featuredImage && (
                <div style={{ borderRadius: '28px', overflow: 'hidden', boxShadow: '0 24px 50px rgba(16,24,40,0.12)', background: '#102A1D' }}>
                  <img src={getUploadUrl(blog.featuredImage)} alt={blog.featuredImageAlt || blog.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              )}

              <div style={{ padding: '28px', borderRadius: '28px', background: '#fffaf4', border: '1px solid rgba(119,84,42,0.12)', boxShadow: '0 18px 40px rgba(16,24,40,0.06)' }}>
                <p style={{ margin: 0, color: '#5B6472', fontSize: '1.05rem', lineHeight: 1.8, borderLeft: '4px solid #8F5D22', paddingLeft: '18px' }}>
                  {blog.metaDescription || blog.shortDescription}
                </p>
              </div>

              <div className="blog-rich-text" dangerouslySetInnerHTML={{ __html: contentHtml }} />

              <section style={{ padding: '26px', borderRadius: '26px', background: '#102A1D', color: '#F7F1E7', boxShadow: '0 20px 42px rgba(16,42,29,0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '22px', overflow: 'hidden', background: 'linear-gradient(135deg, #EBD8B7 0%, #D99C3C 100%)', display: 'grid', placeItems: 'center' }}>
                    <Avatar blog={blog} />
                  </div>
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#E6B46B' }}>Author bio</div>
                    <h2 style={{ margin: '10px 0 0', fontSize: '1.5rem', letterSpacing: '-0.04em' }}>{blog.authorName ?? 'Mariah Coirs Editorial Team'}</h2>
                    <p style={{ margin: '6px 0 0', color: 'rgba(247,241,231,0.8)' }}>{blog.authorRole ?? 'Operations and agronomy specialists sharing sourcing insights.'}</p>
                  </div>
                </div>
                {blog.authorBio && <p style={{ margin: '18px 0 0', lineHeight: 1.8, color: 'rgba(247,241,231,0.86)' }}>{blog.authorBio}</p>}
              </section>

              {relatedPosts.length > 0 && (
                <section style={{ display: 'grid', gap: '18px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8F5D22' }}>
                      Related Posts
                    </span>
                    <h2 style={{ margin: '8px 0 0', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.04em', color: '#102A1D' }}>
                      More articles from the archive
                    </h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    {relatedPosts.map((related) => (
                      <RelatedCard key={related.id} blog={related} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>

          <aside style={{ position: 'sticky', top: '108px', display: 'grid', gap: '16px' }}>
            <div style={{ padding: '20px', borderRadius: '24px', border: '1px solid rgba(119,84,42,0.12)', background: '#fffaf4', boxShadow: '0 18px 34px rgba(16,24,40,0.06)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8F5D22' }}>On This Page</div>
              <h3 style={{ margin: '10px 0 0', fontSize: '1rem', color: '#102A1D' }}>Table of contents</h3>
              {toc.length > 0 ? (
                <nav style={{ display: 'grid', gap: '8px', marginTop: '14px' }} aria-label="Table of contents">
                  {toc.map((entry) => (
                    <a
                      key={entry.id}
                      href={`#${entry.id}`}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '14px',
                        textDecoration: 'none',
                        color: '#3F4A55',
                        background: entry.level === 2 ? 'rgba(143,93,34,0.07)' : 'transparent',
                        marginLeft: `${Math.max(0, entry.level - 2) * 10}px`,
                        fontWeight: entry.level === 2 ? 700 : 600,
                        lineHeight: 1.5,
                      }}
                    >
                      {entry.text}
                    </a>
                  ))}
                </nav>
              ) : (
                <p style={{ margin: '12px 0 0', color: '#6B7280', lineHeight: 1.7 }}>This article does not include section headings.</p>
              )}
            </div>

            <div style={{ padding: '20px', borderRadius: '24px', background: '#102A1D', color: '#F7F1E7', boxShadow: '0 18px 34px rgba(16,42,29,0.12)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E6B46B' }}>Quick Facts</div>
              <ul style={{ margin: '14px 0 0', paddingLeft: '18px', display: 'grid', gap: '10px', lineHeight: 1.65 }}>
                <li>{formatBlogDate(blog.publishedAt)}</li>
                <li>{readingTime} minute read</li>
                <li>{blog.category || 'Coir & cocopeat editorial'}</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}