import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import MobileCarousel from './MobileCarousel';

const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Animation Variants ───────────────────────────────────────────
const leftFade: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE_CUBIC } },
};
const rightFade: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: EASE_CUBIC } },
};
const sectionFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: EASE_CUBIC } },
};

// ─── Contact Info Data ────────────────────────────────────────────
const MAP_URL = 'https://share.google/77OchJpcylLqnEawb';

const OFFICES = [
  {
    label: 'Factory & Head Office',
    lines: [
      'Mariah Coirs Pvt. Ltd.',
      '206-13B Krishnapuram Road, Kalladipatti,',
      'Nilakottai, Dindigul District,',
      'Tamil Nadu — 624 201, India',
    ],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const CONTACT_ROWS = [
  {
    id: 'export-desk',
    label: 'Export Desk',
    value: '+91 96776 41979',
    href: 'tel:+919677641979',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.16 6.16l.97-.97a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: 'export-email',
    label: 'Export Email',
    value: 'mariahcoirs4@gmail.com',
    href: 'mailto:mariahcoirs4@gmail.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    id: 'domestic-desk',
    label: 'Domestic Sales',
    value: '+91 94860 00001',
    href: 'tel:+919486000001',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.16 6.16l.97-.97a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: '24/7 WhatsApp',
    value: '+91 96776 41979',
    href: 'https://wa.me/919677641979',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25D366' }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
];

const BADGES = [
  'ISO 9001:2015',
  'Coir Board Certified',
  'Phytosanitary Certified',
  'FCL & LCL Export',
  '100% Eco-Friendly',
];

// ─── Contact Info Row ─────────────────────────────────────────────
function ContactRow({
  id, label, value, href, icon,
}: typeof CONTACT_ROWS[0]) {
  return (
    <a
      id={`contact-row-${id}`}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="group flex items-center gap-4 py-4 no-underline"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', transition: 'opacity 0.2s' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
        style={{ background: 'rgba(201,155,103,0.1)', color: '#C99B67' }}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A0A0A0' }}>
          {label}
        </span>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#111111', letterSpacing: '-0.01em', marginTop: '1px' }}>
          {value}
        </span>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#C99B67' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.08 });
  const shouldReduce = useReducedMotion();
  const { openModal } = useModal();

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-label="Contact Our Team"
      className="relative w-full overflow-hidden py-14 sm:py-24 lg:py-32"
      style={{ background: '#F5F1EB' }}
    >
      {/* Separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,155,103,0.25), transparent)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          variants={shouldReduce ? {} : sectionFade}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >

          {/* ════════════════════════════════════════
              LEFT COLUMN — Contact Info
          ════════════════════════════════════════ */}
          <motion.div
            variants={shouldReduce ? {} : leftFade}
            className="flex flex-col"
          >
            {/* Eyebrow */}
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#C99B67',
                marginBottom: '20px',
              }}
            >
              Get in Touch
            </span>

            {/* Heading */}
            <h2
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                fontWeight: 800,
                color: '#111111',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                marginBottom: '20px',
              }}
            >
              Contact Our
              <br />
              <span style={{ color: '#C99B67' }}>Export Team</span>
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.8,
                color: '#667085',
                maxWidth: '460px',
                marginBottom: '36px',
              }}
            >
              Whether you're importing from overseas or sourcing in bulk across India — our team
              responds within 24 hours with pricing, specs, and logistics support.
            </p>

            {/* Office */}
            {OFFICES.map(o => (
              <div key={o.label} className="flex items-start gap-4 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(201,155,103,0.1)', color: '#C99B67' }}
                >
                  {o.icon}
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A0A0A0' }}>
                    {o.label}
                  </p>
                  {o.lines.map((line, i) => (
                    <p key={i} style={{ fontSize: '14px', fontWeight: i === 0 ? 700 : 500, color: '#111111', lineHeight: 1.65 }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {/* Get Directions CTA */}
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="contact-directions-link"
              className="inline-flex items-center gap-2 mb-6"
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#C99B67',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Get Directions on Google Maps
            </a>

            {/* Contact Rows */}
            <div className="flex flex-col" style={{ marginBottom: '32px' }}>
              {CONTACT_ROWS.map(row => (
                <ContactRow key={row.id} {...row} />
              ))}
            </div>

            {/* Certification Badges — swipe on mobile */}
            <div className="md:hidden -mx-2">
              <MobileCarousel
                slideClassName="w-auto"
                gapClassName="gap-2"
                bleed={false}
                showDots={false}
              >
                {BADGES.map(badge => (
                  <span
                    key={badge}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: 'rgba(201,155,103,0.08)',
                      border: '1px solid rgba(201,155,103,0.2)',
                      color: '#7A5C3A',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </MobileCarousel>
            </div>
            <div className="hidden md:flex flex-wrap gap-2">
              {BADGES.map(badge => (
                <span
                  key={badge}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: 'rgba(201,155,103,0.08)',
                    border: '1px solid rgba(201,155,103,0.2)',
                    color: '#7A5C3A',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* CTA Buttons — hide export quote on mobile (floating bar handles it) */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10">
              <motion.button
                id="contact-export-btn"
                onClick={() => openModal('export')}
                whileHover={shouldReduce ? {} : { scale: 1.04, y: -2 }}
                whileTap={shouldReduce ? {} : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                className="hidden sm:inline-flex"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '15px 28px',
                  borderRadius: '14px',
                  background: '#C99B67',
                  color: '#111111',
                  fontWeight: 700,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(201,155,103,0.35)',
                  fontFamily: 'inherit',
                }}
              >
                Request Export Quote
              </motion.button>

              <motion.button
                id="contact-domestic-btn"
                onClick={() => openModal('domestic')}
                whileHover={shouldReduce ? {} : { scale: 1.03 }}
                whileTap={shouldReduce ? {} : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '15px 28px',
                  borderRadius: '14px',
                  background: 'transparent',
                  color: '#111111',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: '1.5px solid rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                India Bulk Pricing
              </motion.button>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════
              RIGHT COLUMN — Map + Stats
          ════════════════════════════════════════ */}
          <motion.div
            variants={shouldReduce ? {} : rightFade}
            className="relative w-full flex flex-col gap-4"
          >
            {/* ── Google Maps Embed ── */}
            <div
              className="relative w-full overflow-hidden"
              style={{ borderRadius: '24px', boxShadow: '0 40px 80px rgba(0,0,0,0.18)', aspectRatio: '4/3' }}
            >
              <iframe
                title="Mariah Coirs Factory Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3921.15!2d77.9125!3d10.1834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c3b3b3b3b3b3%3A0x0!2s206-13B+Krishnapuram+Road%2C+Kalladipatti%2C+Nilakottai%2C+Tamil+Nadu+624201!5e0!3m2!1sen!2sin!4v1720000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Google Maps showing Mariah Coirs factory location"
              />
              {/* Address overlay — top-left */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.55, duration: 0.55, ease: EASE_CUBIC }}
                style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 2, pointerEvents: 'none' }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.96)',
                    backdropFilter: 'blur(14px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C99B67" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#111111', letterSpacing: '-0.01em' }}>
                    Nilakottai, Dindigul District, Tamil Nadu
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ── Get Directions Button ── */}
            <motion.a
              id="contact-map-directions-btn"
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={shouldReduce ? {} : { scale: 1.03, y: -2 }}
              whileTap={shouldReduce ? {} : { scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '15px 24px',
                borderRadius: '14px',
                background: '#111111',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                textDecoration: 'none',
                fontFamily: 'inherit',
                boxShadow: '0 4px 18px rgba(0,0,0,0.18)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C99B67" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Get Directions on Google Maps
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.6 }}>
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
            </motion.a>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: 'rgba(201,155,103,0.06)', border: '1px solid rgba(201,155,103,0.15)' }}
              >
                <span style={{ fontSize: '22px' }}>🌍</span>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#C99B67' }}>Export Reach</p>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#111111', letterSpacing: '-0.01em' }}>50+ Countries</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: '#0A0A0A', border: '1px solid rgba(201,155,103,0.15)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C99B67' }}>Response</p>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>Within 24 hrs</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px rgba(74,222,128,0.9)', display: 'block', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF' }}>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
