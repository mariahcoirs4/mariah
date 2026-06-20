import { useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import type { Variants } from 'framer-motion';

// ─── Interfaces ──────────────────────────────────────────────────
interface StatCard {
  stat: string;
  label: string;
}

interface Country {
  code: string;
  name: string;
}

const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Datasets ─────────────────────────────────────────────────────
const STATS: StatCard[] = [
  { stat: '50+', label: 'Countries Served' },
  { stat: '490+', label: 'Active Importers' },
  { stat: '12,000+', label: 'MT Exported / Year' },
  { stat: '99.2%', label: 'On-Time Delivery' },
];

const ROW_1: Country[] = [
  { code: 'US', name: 'USA' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'AU', name: 'Australia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'KR', name: 'South Korea' },
  { code: 'JP', name: 'Japan' },
  { code: 'AE', name: 'UAE' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'FR', name: 'France' },
];

const ROW_2: Country[] = [
  { code: 'ES', name: 'Spain' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'IL', name: 'Israel' },
  { code: 'PL', name: 'Poland' },
  { code: 'MY', name: 'Malaysia' },
];

// ─── Animations ───────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_CUBIC },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_CUBIC },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function GlobalNetworkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="global-reach"
      ref={sectionRef}
      aria-label="Global Export Network"
      className="relative w-full overflow-hidden"
      style={{
        background: '#0A0A0A',
        paddingTop: '100px',
        paddingBottom: '120px',
      }}
    >
      {/* ── Background Radial Glow for Depth ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(201, 155, 103, 0.06), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
        {/* ══════════════════════════════════════════
            SECTION HEADER
        ══════════════════════════════════════════ */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col items-center mb-14"
        >
          {/* Eyebrow Badge */}
          <span
            className="inline-block text-[12px] font-bold uppercase tracking-[4px] mb-4"
            style={{ color: '#C99B67' }}
          >
            GLOBAL EXPORT NETWORK
          </span>

          {/* Main Heading */}
          <h2
            className="font-extrabold text-white tracking-tight leading-[1.2] mb-5 text-[32px] md:text-[54px]"
            style={{ letterSpacing: '-0.02em' }}
          >
            Exporting to 50+ Countries
          </h2>

          {/* Description */}
          <p
            className="text-[18px] leading-[1.6] max-w-[650px] mx-auto"
            style={{ color: '#667085' }}
          >
            Direct FCL and LCL shipments from Chennai and Tuticorin ports to major trade hubs worldwide.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════
            STATISTICS GRID
        ══════════════════════════════════════════ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {STATS.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={
                shouldReduce
                  ? {}
                  : {
                      y: -4,
                      borderColor: 'rgba(201, 155, 103, 0.2)',
                      background: 'rgba(255, 255, 255, 0.03)',
                    }
              }
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center rounded-[20px] py-8 px-6 cursor-default group"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                transition: 'border-color 0.3s ease, background 0.3s ease, transform 0.3s ease',
              }}
            >
              <span
                className="text-[38px] font-extrabold mb-2"
                style={{ color: '#C99B67' }}
              >
                {item.stat}
              </span>
              <span
                className="text-[14px] font-semibold tracking-wide"
                style={{ color: '#667085' }}
              >
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ══════════════════════════════════════════
            COUNTRY PILLS LAYER
        ══════════════════════════════════════════ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col gap-3 items-center max-w-[1000px] mx-auto mt-12"
        >
          {/* Row 1 */}
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {ROW_1.map((country) => (
              <motion.div
                key={country.code}
                variants={pillVariants}
                className="flex items-center gap-2 rounded-full py-2 px-4.5 text-[13px] font-semibold text-[#E4E7EC] select-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <span className="text-[10px] font-bold text-[#C99B67]/70 uppercase tracking-wider">
                  {country.code}
                </span>
                <span>{country.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {ROW_2.map((country) => (
              <motion.div
                key={country.code}
                variants={pillVariants}
                className="flex items-center gap-2 rounded-full py-2 px-4.5 text-[13px] font-semibold text-[#E4E7EC] select-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <span className="text-[10px] font-bold text-[#C99B67]/70 uppercase tracking-wider">
                  {country.code}
                </span>
                <span>{country.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
