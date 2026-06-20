import { useState, useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import type { Variants } from 'framer-motion';

// ─── Types & Interfaces ──────────────────────────────────────────
interface Step {
  number: string;
  title: string;
  description: string;
}

const EASE_CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Process Steps Dataset ────────────────────────────────────────
const STEPS: Step[] = [
  {
    number: '01',
    title: 'Raw Coconut Husk',
    description: 'Sourced from certified coconut farms across Tamil Nadu and Kerala.',
  },
  {
    number: '02',
    title: 'Fibre Extraction',
    description: 'Industrial decorticators separate long coir fibre from the pith.',
  },
  {
    number: '03',
    title: 'Washing & Buffering',
    description: 'Multi-cycle washing reduces EC levels and buffering is performed based on customer requirements.',
  },
  {
    number: '04',
    title: 'Compression',
    description: 'Hydraulic compression converts processed material into blocks, briquettes and bales.',
  },
  {
    number: '05',
    title: 'QC & Lab Testing',
    description: 'EC, pH, moisture and compression ratio are verified according to export standards.',
  },
  {
    number: '06',
    title: 'Export Packaging',
    description: 'Products are packed, labelled and container-loaded for international shipment.',
  },
];

// ─── Animations ───────────────────────────────────────────────────
const headerFade: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_CUBIC } },
};

const timelineFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stepFade: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_CUBIC },
  },
};

// ─── Process Step Card Component ──────────────────────────────────
function ProcessStep({ step, reduce }: { step: Step; reduce: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={stepFade}
      onHoverStart={() => !reduce && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={reduce ? {} : { y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="relative flex flex-col items-center text-center px-4 select-none cursor-default group"
    >
      {/* Step Badge */}
      <div
        className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 z-10 border"
        style={{
          background: 'rgba(201, 155, 103, 0.12)',
          borderColor: hovered ? 'rgba(201, 155, 103, 0.45)' : 'rgba(201, 155, 103, 0.18)',
          boxShadow: hovered
            ? '0 0 20px rgba(201, 155, 103, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 4px 10px rgba(0, 0, 0, 0.2)',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        }}
        aria-hidden="true"
      >
        <span
          className="text-[15px] font-bold"
          style={{ color: '#D8A56D' }}
        >
          {step.number}
        </span>
      </div>

      {/* Content */}
      <h3
        className="mt-6 font-bold tracking-tight text-white"
        style={{ fontSize: '20px', letterSpacing: '-0.015em' }}
      >
        {step.title}
      </h3>
      <p
        className="mt-3 leading-relaxed max-w-[280px]"
        style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.6)' }}
      >
        {step.description}
      </p>
    </motion.div>
  );
}

// ─── Main Section Component ────────────────────────────────────────
export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-label="Our Manufacturing Process"
      className="relative w-full overflow-hidden"
      style={{
        background: '#0A0A0A',
        paddingTop: '140px',
        paddingBottom: '140px',
      }}
    >
      {/* ── Background Radial Glow ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(201, 155, 103, 0.08), transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* ══════════════════════════════════════════
            SECTION HEADER
        ══════════════════════════════════════════ */}
        <motion.div
          variants={headerFade}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-20"
        >
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-[0.32em] mb-4"
            style={{ color: '#C99B67' }}
          >
            Our Process
          </span>
          <h2
            className="font-extrabold text-white tracking-tight"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.025em',
            }}
          >
            From Husk to Export Container
          </h2>
        </motion.div>

        {/* ══════════════════════════════════════════
            PROCESS TIMELINE GRID
        ══════════════════════════════════════════ */}
        <div className="relative w-full">
          
          {/* ── Connecting line for Desktop/Tablet ──
              Hidden on mobile. Displays as a thin line running behind the badges. */}
          <div
            className="absolute top-[26px] left-[8%] right-[8%] h-[2px] hidden md:block"
            style={{ background: 'rgba(201, 155, 103, 0.25)' }}
            aria-hidden="true"
          >
            {/* Animated progress reveal */}
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-[#D8A56D] to-[#C99B67]"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.4, ease: EASE_CUBIC }}
              style={{ width: '100%' }}
            />
          </div>

          {/* ── Steps Container ── */}
          <motion.div
            variants={timelineFade}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-y-12 md:gap-y-16 gap-x-4 lg:gap-x-2"
          >
            {STEPS.map((step) => (
              <ProcessStep
                key={step.number}
                step={step}
                reduce={!!shouldReduce}
              />
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
