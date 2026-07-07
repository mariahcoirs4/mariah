import { useState, useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import type { Variants } from 'framer-motion';
import MobileCarousel from './MobileCarousel';

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
    transition: { staggerChildren: 0.15 },
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

// ─── Mobile swipe card ────────────────────────────────────────────
function ProcessMobileCard({ step, index }: { step: Step; index: number }) {
  return (
    <article
      className="relative flex flex-col h-full min-h-[200px] p-5 rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(229, 169, 60, 0.22)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(229,169,60,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border"
          style={{
            background: 'rgba(229, 169, 60, 0.12)',
            borderColor: 'rgba(229, 169, 60, 0.35)',
          }}
        >
          <span className="text-[15px] font-bold text-[#E5A93C]">{step.number}</span>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
          Step {index + 1} of {STEPS.length}
        </span>
      </div>

      <h3 className="font-semibold text-white text-[17px] tracking-tight leading-snug">
        {step.title}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-gray-400 flex-1">
        {step.description}
      </p>

      {/* Mini progress bar */}
      <div className="mt-5 flex gap-1" aria-hidden="true">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full flex-1 transition-colors duration-300"
            style={{
              background: i <= index ? '#E5A93C' : 'rgba(255,255,255,0.1)',
              opacity: i === index ? 1 : i < index ? 0.6 : 1,
            }}
          />
        ))}
      </div>
    </article>
  );
}

// ─── Desktop step ─────────────────────────────────────────────────
function ProcessStep({ step, reduce }: { step: Step; reduce: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={stepFade}
      onHoverStart={() => !reduce && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={reduce ? {} : { y: -4 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="relative flex flex-col items-center px-2 select-none cursor-default group"
    >
      <div
        className="w-[52px] h-[52px] rounded-xl flex items-center justify-center shrink-0 z-10 border"
        style={{
          background: hovered ? 'rgba(229, 169, 60, 0.20)' : 'rgba(229, 169, 60, 0.10)',
          borderColor: hovered ? 'rgba(229, 169, 60, 0.50)' : 'rgba(229, 169, 60, 0.30)',
          boxShadow: hovered
            ? '0 0 20px rgba(229, 169, 60, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 4px 10px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.25s ease',
        }}
        aria-hidden="true"
      >
        <span className="text-[15px] font-bold text-[#E5A93C]">{step.number}</span>
      </div>

      <div className="mt-4 text-center">
        <h3 className="font-semibold tracking-tight text-white text-[18px]" style={{ letterSpacing: '-0.015em' }}>
          {step.title}
        </h3>
        <p className="mt-2 leading-relaxed text-gray-300 text-[14px]">
          {step.description}
        </p>
      </div>
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
      className="relative w-full overflow-hidden py-12 sm:py-20 lg:py-32"
      style={{ background: '#0A0A0A' }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(229, 169, 60, 0.08), transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">

        <motion.div
          variants={headerFade}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-8 sm:mb-16 lg:mb-20"
        >
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.32em] mb-3 sm:mb-4 text-[#E5A93C]">
            Our Process
          </span>
          <h2
            className="font-extrabold text-white tracking-tight"
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 3.75rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.025em',
            }}
          >
            From <span className="text-[#E5A93C]">Husk</span> to <span className="text-[#E5A93C]">Export Container</span>
          </h2>
          <p className="mt-3 text-sm text-white/45 md:hidden">
            Swipe through each stage of our manufacturing pipeline
          </p>
        </motion.div>

        {/* ── Mobile: horizontal swipe carousel ── */}
        <div className="md:hidden">
          <MobileCarousel
            slideClassName="w-[88vw] max-w-[340px]"
            gapClassName="gap-4"
            dotClassName="bg-white/20"
            activeDotClassName="bg-[#E5A93C]"
          >
            {STEPS.map((step, index) => (
              <ProcessMobileCard key={step.number} step={step} index={index} />
            ))}
          </MobileCarousel>
        </div>

        {/* ── Desktop / tablet: horizontal timeline grid ── */}
        <div className="relative w-full hidden md:block">
          <div
            className="absolute top-[26px] left-[8%] right-[8%] h-px hidden lg:block"
            style={{ background: 'rgba(229, 169, 60, 0.4)' }}
            aria-hidden="true"
          >
            <motion.div
              className="h-full origin-left"
              style={{ width: '100%', background: 'linear-gradient(90deg, #E5A93C, #C99B67)' }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.4, ease: EASE_CUBIC }}
            />
          </div>

          <motion.div
            variants={timelineFade}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 lg:grid-cols-6 gap-x-4 lg:gap-x-6 gap-y-12 lg:gap-y-0"
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
