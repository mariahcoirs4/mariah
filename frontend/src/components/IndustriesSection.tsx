import { useState, useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import type { Variants } from 'framer-motion';

// ─── Types & Interfaces ──────────────────────────────────────────
interface Industry {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── SVG Icons ───────────────────────────────────────────────────
const SproutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12" />
    <path d="M12 12c-2-2.67-4-3-6-2.5C4 10 3 12 3 14c2.5 0 5-1 7-3.5Z" />
    <path d="M12 14c2-2.67 4-3 6-2.5 2 .5 3 2.5 3 4.5-2.5 0-5-1-7-3.5Z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const FactoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20" />
    <path d="M5 17V9.3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V17" />
    <path d="M11 17v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4" />
    <path d="M17 17V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v12" />
  </svg>
);

const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 8.28-4.2 14.2A7 7 0 0 1 11 20z" />
    <path d="M19 2L9.8 11.2" />
  </svg>
);

const LayersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const PackageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08" />
    <polygon points="12 22.08 12 12 21 6.92 21 17.08 12 22.08" />
    <polygon points="12 12 3 6.92 12 1.84 21 6.92 12 12" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ─── Industries Dataset ───────────────────────────────────────────
const INDUSTRIES: Industry[] = [
  {
    id: 1,
    icon: <SproutIcon />,
    title: 'Hydroponics Farming',
    description: 'Low EC cocopeat blocks for DWC, NFT and drip irrigation systems.',
  },
  {
    id: 2,
    icon: <GlobeIcon />,
    title: 'Floriculture',
    description: 'Propagation discs and briquettes for high-value flower cultivation.',
  },
  {
    id: 3,
    icon: <FactoryIcon />,
    title: 'Greenhouse Cultivation',
    description: 'Grow bags and slab systems for commercial pepper and tomato farming.',
  },
  {
    id: 4,
    icon: <LeafIcon />,
    title: 'Horticulture & Agriculture',
    description: 'Soil amendment and growing media for commercial farms worldwide.',
  },
  {
    id: 5,
    icon: <LayersIcon />,
    title: 'Landscaping',
    description: 'Coir fibre for slope stabilization and large erosion control projects.',
  },
  {
    id: 6,
    icon: <PackageIcon />,
    title: 'Animal Bedding',
    description: 'Processed coir pith as premium absorbent livestock bedding.',
  },
  {
    id: 7,
    icon: <BarChartIcon />,
    title: 'Soil Conditioning',
    description: 'Improve water retention and aeration in degraded agricultural land.',
  },
  {
    id: 8,
    icon: <ShieldIcon />,
    title: 'Environmental Solutions',
    description: 'Biodegradable erosion mats and eco-restoration growing substrates.',
  },
];

// ─── Animations ───────────────────────────────────────────────────
const headerFade: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_CUBIC } },
};

const gridFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardFade: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_CUBIC },
  },
};

// ─── Industry Card Component ──────────────────────────────────────
function IndustryCard({ industry, reduce }: { industry: Industry; reduce: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardFade}
      onHoverStart={() => !reduce && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={reduce ? {} : { y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="relative flex flex-col justify-start p-8 overflow-hidden select-none cursor-default"
      style={{
        minHeight: '220px',
        background: '#FFFFFF',
        border: hovered ? '1px solid rgba(201, 155, 103, 0.45)' : '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '24px',
        boxShadow: hovered
          ? '0 20px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(185, 120, 45, 0.06)'
          : '0 10px 30px rgba(0, 0, 0, 0.04)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Icon Container */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
        style={{
          background: hovered ? 'rgba(201, 155, 103, 0.16)' : 'rgba(201, 155, 103, 0.08)',
          color: '#C99B67',
          transition: 'background-color 0.25s ease',
        }}
        aria-hidden="true"
      >
        <motion.div
          animate={hovered ? { rotate: 8, scale: 1.05 } : { rotate: 0, scale: 1.0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {industry.icon}
        </motion.div>
      </div>

      {/* Card Content */}
      <h3
        className="mt-5 font-bold tracking-tight text-[#111111] text-[17px] sm:text-[18px]"
        style={{ letterSpacing: '-0.01em' }}
      >
        {industry.title}
      </h3>
      <p
        className="mt-2.5 leading-relaxed text-[13px] sm:text-[14px]"
        style={{ color: '#555555' }}
      >
        {industry.description}
      </p>
    </motion.div>
  );
}

// ─── Main Section Component ────────────────────────────────────────
export default function IndustriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="industries"
      ref={sectionRef}
      aria-label="Industries We Serve"
      className="relative w-full overflow-hidden"
      style={{
        background: '#F5F1EB',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* ══════════════════════════════════════════
            SECTION HEADER
        ══════════════════════════════════════════ */}
        <motion.div
          variants={headerFade}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-[0.32em] mb-4"
            style={{ color: '#C99B67' }}
          >
            Markets We Serve
          </span>
          <h2
            className="font-extrabold text-[#111111] tracking-tight"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.025em',
            }}
          >
            Industries We Serve
          </h2>
        </motion.div>

        {/* ══════════════════════════════════════════
            FEATURES GRID
        ══════════════════════════════════════════ */}
        <motion.div
          variants={gridFade}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {INDUSTRIES.map((industry) => (
            <IndustryCard
              key={industry.id}
              industry={industry}
              reduce={!!shouldReduce}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
