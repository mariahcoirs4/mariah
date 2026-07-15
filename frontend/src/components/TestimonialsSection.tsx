import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  content: string;
  avatarPlaceholder: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'David Miller',
    role: 'Procurement Director',
    company: 'GreenSpace Growers Ltd.',
    location: 'Netherlands',
    rating: 5,
    content: 'We have been importing coco peat blocks from Mariah Coirs since 2018. The EC and pH levels are consistently within the specified range, which is critical for our automated greenhouse operations.',
    avatarPlaceholder: 'DM',
  },
  {
    id: 2,
    name: 'Elena Rostova',
    role: 'Horticultural Specialist',
    company: 'BioSoil Solutions',
    location: 'Australia',
    rating: 5,
    content: 'The custom grow media bags we ordered were perfectly sized, pre-drilled, and the plastic UV stability was outstanding. Their factory-direct pricing makes them our primary source in Asia.',
    avatarPlaceholder: 'ER',
  },
  {
    id: 3,
    name: 'Marcus Vance',
    role: 'Supply Chain Manager',
    company: 'Vance Bedding & Co.',
    location: 'United States',
    rating: 5,
    content: 'Their coir fiber bales are of exceptional grade—long strands, low impurities, and properly compressed. Customer service is highly responsive, sending weekly container status tracking reports.',
    avatarPlaceholder: 'MV',
  },
  {
    id: 4,
    name: 'Kenji Sato',
    role: 'Production Supervisor',
    company: 'Tokyo Agri-Tech',
    location: 'Japan',
    rating: 5,
    content: 'Very impressed with the low EC buffered coco peat blocks. The expansion volume exceeded our expectations. Excellent phytosanitary certification handling for quick custom clearances.',
    avatarPlaceholder: 'KS',
  },
  {
    id: 5,
    name: 'Rajesh Patel',
    role: 'Director of Operations',
    company: 'Vedic Organic Farms & Nurseries',
    location: 'India',
    rating: 5,
    content: 'We source high-quality cocopeat blocks and coir pith in bulk from Mariah Coirs. The low EC and stable pH are perfect for our vegetable crop propagation. Their local delivery speed and reliability are exceptional.',
    avatarPlaceholder: 'RP',
  },
  {
    id: 6,
    name: 'Chen Wei',
    role: 'Import Specialist',
    company: 'Grand East Agricultural Import',
    location: 'China',
    rating: 5,
    content: 'Importing coco peat blocks in large quantities to China was smooth with Mariah Coirs. Their team provided all phytosanitary and export documentations on time. Excellent expansion volume after wetting.',
    avatarPlaceholder: 'CW',
  },
  {
    id: 7,
    name: 'Min-ho Ji',
    role: 'Agronomic Research Lead',
    company: 'Greenhouse Innovations Corp',
    location: 'South Korea',
    rating: 5,
    content: 'We ordered custom coir grow bags for our smart-farm greenhouse. The bags are pre-cut perfectly and the UV stability of the plastic is outstanding. Mariah Coirs is our trusted partner in Asia.',
    avatarPlaceholder: 'MJ',
  },
  {
    id: 8,
    name: 'Mateo Silva',
    role: 'Hydroponics Consultant',
    company: 'Iberia Growers Alliance',
    location: 'Spain',
    rating: 5,
    content: 'For hydroponic greenhouse crop production, the water retention and structural stability of Mariah Coirs cocopeat is top-tier. Exceptional quality that meets rigorous European import standards.',
    avatarPlaceholder: 'MS',
  },
  {
    id: 9,
    name: 'Hans Müller',
    role: 'Product Sourcing Lead',
    company: 'Alpen Soil Mixtures GmbH',
    location: 'Germany',
    rating: 5,
    content: 'We import raw coir fiber and coco pith for our premium potting soil formulations. Mariah Coirs provides consistent grade, low impurities, and excellent customer communication throughout.',
    avatarPlaceholder: 'HM',
  },
];

const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const shouldReduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(handleNext, 3000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      aria-label="Client Testimonials and Reviews"
      style={{
        background: '#FAF8F4',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_CUBIC }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#B87038',
              display: 'inline-block',
              marginBottom: '12px',
            }}
          >
            Worldwide Trust
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              color: '#0F0A04',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            What Our Clients Say
          </h2>
          <p style={{ color: '#6B5840', fontSize: '15px', marginTop: '12px', maxWidth: '600px', margin: '12px auto 0' }}>
            Hear from leading commercial growers, agricultural supply chains, and industrial manufacturers importing our premium coir products globally.
          </p>
        </motion.div>

        {/* Carousel Content */}
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px 32px 32px',
            border: '1.5px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 12px 32px rgba(185, 120, 45, 0.05)',
          }}
        >
          {/* Quote Icon Background */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '32px',
              fontSize: '64px',
              color: 'rgba(184, 112, 56, 0.08)',
              fontFamily: 'serif',
              lineHeight: 1,
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            “
          </div>

          <div style={{ position: 'relative', minHeight: '180px' }}>
            {TESTIMONIALS.map((t, idx) => {
              const isActive = idx === activeIndex;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={shouldReduce ? { duration: 0 } : { duration: 0.4, ease: EASE_CUBIC }}
                  style={{
                    display: isActive ? 'block' : 'none',
                  }}
                >
                  {/* Rating Stars */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }} aria-label={`${t.rating} star rating`}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} style={{ color: '#D4AF37', fontSize: '18px' }}>★</span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p
                    style={{
                      fontSize: '18px',
                      lineHeight: 1.6,
                      color: '#2A2015',
                      fontWeight: 500,
                      margin: '0 0 24px',
                    }}
                  >
                    "{t.content}"
                  </p>

                  {/* Reviewer Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #B87038 0%, #E6C09C 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        letterSpacing: '1px',
                      }}
                    >
                      {t.avatarPlaceholder}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#0F0A04', fontWeight: 700 }}>
                        {t.name}
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#8F7D66' }}>
                        {t.role}, <span style={{ fontWeight: 600, color: '#B87038' }}>{t.company}</span> ({t.location})
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            <button
              onClick={handlePrev}
              aria-label="Previous Review"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.1)',
                background: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3C2C18',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#B87038';
                e.currentTarget.style.color = '#B87038';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                e.currentTarget.style.color = '#3C2C18';
              }}
            >
              ←
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Review"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.1)',
                background: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3C2C18',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#B87038';
                e.currentTarget.style.color = '#B87038';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                e.currentTarget.style.color = '#3C2C18';
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Carousel indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === activeIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: i === activeIndex ? '#B87038' : 'rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* View All Testimonials Link */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <Link
            to="/testimonials"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#B87038',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <span>View All Client Stories</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="8" x2="13" y2="8" />
              <polyline points="9 4 13 8 9 12" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
