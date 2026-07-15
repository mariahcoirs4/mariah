import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { TESTIMONIALS } from '../components/TestimonialsSection';
import { useSEO, ORGANIZATION_SCHEMA, breadcrumbSchema } from '../hooks/useSEO';

const SITE_URL = 'https://www.mariahcoirsexport.com';

const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: EASE_CUBIC,
    },
  }),
};

export default function TestimonialsPage() {
  useSEO({
    title: 'Customer Testimonials | Worldwide Importers & Growers — Mariah Coirs',
    description:
      'Read reviews and success stories from international crop growers, greenhouse operators, and soil mixing companies importing our premium coir and cocopeat products globally.',
    canonical: `${SITE_URL}/testimonials`,
    keywords: 'coir customer reviews, cocopeat testimonials, coir block export reviews, coco peat grower feedback, Mariah Coirs clients',
    jsonLd: [
      ORGANIZATION_SCHEMA,
      breadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Testimonials', url: `${SITE_URL}/testimonials` },
      ]),
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>
      <div style={{ height: '72px' }} aria-hidden="true" />

      {/* Page Hero */}
      <section
        style={{ background: '#0A0A0A', padding: '48px 24px 40px' }}
        aria-label="Testimonials page header"
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
            <span style={{ color: '#C99B67' }}>Testimonials</span>
          </nav>

          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C99B67', marginBottom: '16px' }}>
            Worldwide Trust
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: '16px' }}>
            What Our Clients Say
          </h1>
          <p style={{ fontSize: '18px', color: '#667085', maxWidth: '600px', lineHeight: 1.7 }}>
            Hear from leading commercial growers, agricultural supply chains, and greenhouse operators across Europe, Asia, Australia, and the Americas importing our premium coir products.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px 80px' }} aria-label="Customer Reviews">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(185, 120, 45, 0.08)' }}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '32px',
                border: '1.5px solid rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
              }}
            >
              <div>
                {/* Rating */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }} aria-label={`${t.rating} star rating`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} style={{ color: '#D4AF37', fontSize: '16px' }}>★</span>
                  ))}
                </div>

                {/* Review Text */}
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: '#2A2015',
                    fontWeight: 500,
                    margin: '0 0 24px',
                    fontStyle: 'italic',
                  }}
                >
                  "{t.content}"
                </p>
              </div>

              {/* Reviewer Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px', marginTop: 'auto' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #B87038 0%, #E6C09C 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    letterSpacing: '1px',
                    flexShrink: 0,
                  }}
                >
                  {t.avatarPlaceholder}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#0F0A04', fontWeight: 700 }}>
                    {t.name}
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#8F7D66', lineHeight: 1.3 }}>
                    {t.role}, <span style={{ fontWeight: 600, color: '#B87038' }}>{t.company}</span> ({t.location})
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0A0A0A 0%, #050505 100%)',
          padding: '80px 24px',
          textAlign: 'center',
          color: '#FFFFFF',
        }}
        aria-label="Export enquiry CTA"
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '16px', color: '#FFFFFF' }}>
            Partner with a Trusted Coir Supplier
          </h2>
          <p style={{ fontSize: '16px', color: '#A0A0A0', lineHeight: 1.6, marginBottom: '32px' }}>
            We serve agricultural projects and bulk distributors in 50+ countries from our facility in Nilakottai, Tamil Nadu. Reach out to get customized solutions.
          </p>
          <Link
            to="/enquiries"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 32px',
              borderRadius: '8px',
              backgroundColor: '#E5A93C',
              color: '#160D03',
              fontWeight: 700,
              fontSize: '14.5px',
              textDecoration: 'none',
              transition: 'background-color 0.2s, transform 0.2s',
              cursor: 'pointer',
              border: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D99828')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E5A93C')}
          >
            Submit Export Enquiry
          </Link>
        </div>
      </section>
    </div>
  );
}
